import {FlatList, Text, View} from 'react-native';
import {useMedia} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useUpdateContext} from '../hooks/ContextHooks';

const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {mediaArray, loading} = useMedia();
  const {triggerUpdate} = useUpdateContext();

  console.log(mediaArray);

  return (
    <View>
      <Text>My Media</Text>
      <FlatList
        data={mediaArray}
        renderItem={({item}) => (
          <MediaListItem item={item} navigation={navigation} />
        )}
        onRefresh={triggerUpdate}
        refreshing={loading}
      />
    </View>
  );
};

export default Home;
