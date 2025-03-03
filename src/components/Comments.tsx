import {Button, Card, Input, ListItem, Text} from '@rneui/base';
import {TextInput, View} from 'react-native';
import {useUserContext} from '../hooks/ContextHooks';
import {useComment} from '../hooks/apiHooks';
import {useCommentsStore} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, set, useForm} from 'react-hook-form';
import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useEffect, useRef} from 'react';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const inputRef = useRef<TextInput>(null);
  const user = useUserContext();
  const {comments, setComments} = useCommentsStore();
  const {postComment, getCommentsByMediaId} = useComment();

  const initValues = {comment_text: ''};
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doComment = async (input: {comment_text: string}) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }

    await postComment(input.comment_text, item.media_id, token);
    getComments();
    reset();
  };

  const getComments = async () => {
    try {
      const comments = await getCommentsByMediaId(item.media_id);
      setComments(comments);
    } catch (e) {
      setComments([]);
      console.log('getComments error', (e as Error).message);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <View>
      <Text>Comments</Text>
      {user && (
        <>
          <Controller
            control={control}
            rules={{
              maxLength: 80,
              required: {value: true, message: 'Comment is required'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Comment"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="comment_text"
          />
          <Button title="Comment" onPress={handleSubmit(doComment)} />
        </>
      )}
      {comments.length > 0 && (
        <Card>
          {comments.map((comment) => (
            <ListItem key={comment.comment_id}>
              <Text>
                {comment.username}(
                {new Date(comment.created_at || '').toLocaleDateString('fi-FI')}
                ): {comment.comment_text}
              </Text>
            </ListItem>
          ))}
        </Card>
      )}
    </View>
  );
};

export default Comments;
