import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Single from '../views/Single';
import {Icon} from '@rneui/base';
import {useUserContext} from '../hooks/ContextHooks';
import Login from '../views/Login';
import MyFiles from '../views/MyFiles';
import Upload from '../views/Upload';
import {NavigatorType} from '../types/LocalTypes';

const Tab = createBottomTabNavigator<NavigatorType>();
const Stack = createNativeStackNavigator<NavigatorType>();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';
          if (route.name === 'My Media') {
            iconName = focused ? 'home-filled' : 'home';
          } else if (route.name === 'My Profile') {
            iconName = focused ? 'person-outline' : 'person-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="My Media"
        component={Home}
        // options={{headerShown: false}}
      />
      <Tab.Screen name="Upload" component={Upload} />
      <Tab.Screen name="My Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {user} = useUserContext();

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen name="My Files" component={MyFiles} />
        </>
      ) : (
        <Stack.Screen name="Login and Registeration" component={Login} />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
