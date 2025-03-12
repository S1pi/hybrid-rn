import {RouteProp, useNavigation} from '@react-navigation/native';
import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Video} from 'expo-av';
import {Button, Card, Icon, ListItem} from '@rneui/base';
import Likes from '../components/Likes';
import Ratings from '../components/Ratings';
import {useMedia} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUpdateContext, useUserContext} from '../hooks/ContextHooks';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params.item;
  const {deleteMedia} = useMedia();
  const {user} = useUserContext();
  const {triggerUpdate} = useUpdateContext();
  const navigate = useNavigation();

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('Token not found');
        return;
      }
      const deleteResponse = await deleteMedia(item.media_id, token);
      triggerUpdate();
      Alert.alert('Deleted Successfully', deleteResponse.message);
      navigate.goBack();
      console.log(deleteResponse);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title>{item.title}</Card.Title>

        {item.media_type.includes('image') ? (
          <Image style={styles.image} src={item.filename} />
        ) : (
          <Video
            style={styles.image}
            source={{uri: item.filename}}
            useNativeControls
          />
        )}

        <ListItem>
          <Likes item={item} />
        </ListItem>

        <ListItem>
          <Icon name="today" />
          <Text>{new Date(item.created_at).toLocaleString('fi-FI')}</Text>
        </ListItem>
        {/* <Likes item={item} /> */}
        <ListItem>
          <Text>{item.description}</Text>
        </ListItem>
        <ListItem>
          <Icon name="inventory" />
          <Text>Type: {item.media_type}</Text>
        </ListItem>
        <ListItem>
          <Icon name="person" />
          <Text>Owner: {item.username}</Text>
        </ListItem>
        <ListItem>
          <Icon name="image" />
          <Text>Size: {Math.round(item.filesize / 1024)} kB</Text>
        </ListItem>
        <Ratings item={item} />
        {user && user.user_id === item.user_id && (
          <ListItem>
            <Button title="Delete" color="error" onPress={handleDelete} />
          </ListItem>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {height: 400},
});

export default Single;
