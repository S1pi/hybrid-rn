import {useUserContext} from '../hooks/ContextHooks';
import {Button, Card} from '@rneui/base';

const Profile = () => {
  const {user, handleLogout} = useUserContext();
  return (
    <Card>
      <Card.Title>{user?.username}</Card.Title>
      <Button onPress={handleLogout} title="Logout" />
    </Card>
  );
};

export default Profile;
