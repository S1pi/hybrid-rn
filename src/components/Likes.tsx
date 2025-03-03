import {Like, MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useEffect, useReducer} from 'react';
import {useLike} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text} from '@rneui/base';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'SET_LIKE' | 'SET_COUNT';
  like?: Like | null;
  count?: number;
};

const initialLikeState: LikeState = {
  count: 0,
  userLike: null,
};

const LikeReducer = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'SET_LIKE':
      return {...state, userLike: action.like ?? null};
    case 'SET_COUNT':
      return {...state, count: action.count ?? 0};
    default:
      return state;
  }
};

const Likes = ({item}: {item: MediaItemWithOwner}) => {
  const [likeState, dispatchLike] = useReducer(LikeReducer, initialLikeState);
  const {postLike, deleteLike, getCountByMediaId, getUserLike} = useLike();

  const getLikes = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!item || !token) {
      return;
    }

    try {
      const userLike = await getUserLike(item.media_id, token);
      console.log('getLikes; userLike', userLike);

      dispatchLike({type: 'SET_LIKE', like: userLike});
    } catch (e) {
      dispatchLike({type: 'SET_LIKE', like: null});
      console.log("Couldn't get user like", (e as Error).message);
    }
  };

  const getLikeCount = async () => {
    try {
      const countResponse = await getCountByMediaId(item.media_id);
      console.log('getLikeCount; countResponse', countResponse);
      dispatchLike({type: 'SET_COUNT', count: countResponse.count});
    } catch (e) {
      console.error("Couldn't get like count", (e as Error).message);
    }
  };

  useEffect(() => {
    getLikes();
    getLikeCount();
  }, [item]);

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !item) {
        return;
      }

      if (likeState.userLike) {
        await deleteLike(likeState.userLike.like_id, token);

        dispatchLike({type: 'SET_LIKE', like: null});
        dispatchLike({type: 'SET_COUNT', count: likeState.count - 1});
      } else {
        await postLike(item.media_id, token);
        getLikes();
        getLikeCount();
      }
    } catch (e) {
      console.log('handleLike; error', (e as Error).message);
    }
  };

  return (
    <>
      <Text style={{paddingRight: 10}}>Likes: {likeState.count}</Text>
      <Button onPress={handleLike}>
        {likeState.userLike ? 'Unlike' : 'Like'}
      </Button>
    </>
  );
};

export default Likes;
