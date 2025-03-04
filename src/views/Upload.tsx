import {Button, Card, Image} from '@rneui/base';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {Input} from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {UploadResponse} from 'hybrid-types/MessageTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/apiHooks';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavigatorType} from '../types/LocalTypes';
import VideoPlayer from '../components/VideoPlayer';

const Upload = () => {
  const [showLoading, setShowLoading] = useState(false);
  const {postMedia} = useMedia();
  const [media, setMedia] = useState<ImagePicker.ImagePickerResult | null>(
    null,
  );
  const initValues = {title: '', description: ''};
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: initValues,
  });

  const navigation = useNavigation<NativeStackNavigationProp<NavigatorType>>();

  const pickMedia = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos', 'livePhotos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
    });
    console.log('Media', result);

    if (!result.canceled) {
      setMedia(result);
    }
  };

  const postExpoFile = async (
    imageUri: string,
    token: string,
  ): Promise<UploadResponse> => {
    setShowLoading(true);
    const fileResult = await FileSystem.uploadAsync(
      process.env.EXPO_PUBLIC_UPLOAD_API + '/upload',
      imageUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setShowLoading(false);
    return fileResult.body
      ? JSON.parse(fileResult.body)
      : {error: 'No response from server'};
  };

  const doUpload = async (inputs: {title: string; description: string}) => {
    if (!media || !media.assets || media.assets.length === 0) {
      Alert.alert('Error', 'No media selected');
      return;
    }
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }

    const postExpo = await postExpoFile(media.assets[0].uri, token);
    console.log('File uploaded test', postExpo);

    await postMedia(postExpo, inputs, token);
    handleReset();
    navigation.navigate('My Media');
  };

  const handleReset = () => {
    reset(initValues);
    setMedia(null);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      handleReset();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Card>
        <Card.Title>Upload your media</Card.Title>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Title is required'},
            minLength: {
              value: 5,
              message: 'Title is too short (min 5 characters)',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Title"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.title?.message}
            />
          )}
          name="title"
        />

        <Controller
          control={control}
          rules={{
            maxLength: {
              value: 100,
              message: 'Description is too long (max 100 characters)',
            },
            minLength: {
              value: 10,
              message: 'Description is too short (min 10 characters)',
            },
            required: {value: true, message: 'Description is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Tell us more about your media? (min 10 characters)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.description?.message}
            />
          )}
          name="description"
        />
      </Card>
      <Card>
        <View>
          <Card.Title>Preview</Card.Title>
          {media ? (
            media.assets && media.assets[0].type === 'image' ? (
              <Image
                containerStyle={{
                  width: 200,
                  margin: 'auto',
                }}
                source={{uri: media.assets[0].uri}}
                style={{
                  width: 200,
                  height: 200,
                  margin: 'auto',
                  paddingBottom: 20,
                }}
              />
            ) : (
              media.assets &&
              media.assets[0].type === 'video' && (
                <VideoPlayer
                  videoFile={media.assets[0].uri}
                  style={{
                    width: 200,
                    height: 200,
                    margin: 'auto',
                    paddingBottom: 20,
                  }}
                />
              )
            )
          ) : (
            <CardTitle>No media selected</CardTitle>
          )}
          <CardDivider>
            <Button title="Select Media" onPress={pickMedia} />
          </CardDivider>
          <CardDivider>
            <Button
              title="Upload"
              loading={showLoading}
              disabled={!isValid || !media}
              onPress={handleSubmit(doUpload)}
            />
          </CardDivider>

          <Button title="Reset" color="warning" onPress={handleReset} />
        </View>
      </Card>
    </>
  );
};

export default Upload;
