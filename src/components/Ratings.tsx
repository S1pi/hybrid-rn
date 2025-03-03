import {MediaItemWithOwner, Rating} from 'hybrid-types/DBTypes';
import {useEffect, useState} from 'react';
import StarRating, {StarRatingDisplay} from 'react-native-star-rating-widget';
import {useRating} from '../hooks/apiHooks';
import {Button, Card, Text} from '@rneui/base';
import {useUserContext} from '../hooks/ContextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ratings = ({item}: {item: MediaItemWithOwner}) => {
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState<number>(0);
  const {postRating, getRatingByMediaId, getRatingListByMediaId} = useRating();
  const user = useUserContext();

  const getRating = async () => {
    try {
      const averageRating = await getRatingByMediaId(item.media_id);
      setRating(averageRating.average);
    } catch (e) {
      console.log("Couldn't get average rating", (e as Error).message);
    }
  };

  const getUserRating = async () => {
    try {
      const ratingList = await getRatingListByMediaId(item.media_id);
      const userRating = ratingList.find(
        (rating: Rating) => rating.user_id === user.user?.user_id,
      );
      console.log('getUserRating; userRating', userRating);
      setUserRating(userRating?.rating_value ?? 0);
    } catch (e) {
      console.log("Couldn't get user rating", (e as Error).message);
    }
  };

  const handleRatingChange = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }

    console.log('User Rated: ', userRating);
    await postRating(item.media_id, userRating, token);
    getRating();
  };

  useEffect(() => {
    getRating();
    getUserRating();
  }, [item]);

  return (
    <>
      <Card>
        <Text>Current Rating: </Text>
        <StarRatingDisplay rating={rating} />
      </Card>
      <Card containerStyle={{marginBottom: 32}}>
        <Text>Review This Media: </Text>
        <StarRating
          rating={userRating}
          onChange={setUserRating}
          enableHalfStar={false}
        />
        <Button onPress={handleRatingChange} style={{marginTop: 8}}>
          Submit Rating
        </Button>
      </Card>
    </>
  );
};

export default Ratings;
