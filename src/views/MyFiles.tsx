import {Text} from '@rneui/base';
import {FlatList, View} from 'react-native';
import MediaListItem from '../components/MediaListItem';
import {useMedia} from '../hooks/apiHooks';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useUserContext} from '../hooks/ContextHooks';

const MyFiles = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {user} = useUserContext();
  const {mediaArray} = useMedia(user?.user_id);

  return (
    <View>
      <Text>My Media</Text>
      {mediaArray.length === 0 ? (
        <Text>No media found</Text>
      ) : (
        <FlatList
          data={mediaArray}
          renderItem={({item}) => (
            <MediaListItem item={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
};

export default MyFiles;
