import {
  MediaItemWithOwner,
  User,
  UserWithNoPassword,
} from 'hybrid-types/DBTypes';

export type Credentials = Pick<User, 'username' | 'password'>;
export type RegisterCredentials = Pick<User, 'username' | 'password' | 'email'>;

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type RatingAverage = {
  average: number;
};

export type NavigatorType = {
  // tab screen
  'My Media': undefined;
  'My Profile': undefined;
  Upload: undefined;

  // stack screen
  Tabs: undefined;
  Single: {item: MediaItemWithOwner};
  'My Files': undefined;
  'Login and Registeration': undefined;
};
