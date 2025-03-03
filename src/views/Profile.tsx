import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useUserContext} from '../hooks/ContextHooks';
import {Button, Card, Icon, ListItem, Text} from '@rneui/base';

const Profile = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {user, handleLogout} = useUserContext();
  return (
    <Card>
      <Card.Title>{user?.username}</Card.Title>
      <ListItem>
        <Icon name="email" />
        <Text>{user?.username}</Text>
      </ListItem>
      <ListItem style={{paddingBottom: 4}}>
        <Icon name="today" />
        <Text>
          Member since:{' '}
          {user && new Date(user.created_at).toLocaleDateString('fi')}
        </Text>
      </ListItem>
      <Button
        onPress={handleLogout}
        title="Logout"
        style={{paddingBottom: 12}}
      />
      <Button onPress={() => navigation.navigate('My Files')} title="MyFiles" />
    </Card>
  );
};

export default Profile;
