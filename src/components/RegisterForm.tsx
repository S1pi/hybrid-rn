import {Button, Card} from '@rneui/base';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {RegisterCredentials} from '../types/LocalTypes';
import {Input} from '@rneui/themed';
import {useUser} from '../hooks/apiHooks';
import {Alert} from 'react-native';

const RegisterForm = ({
  setDisplayRegister,
}: {
  setDisplayRegister: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {getUserNameAvailable, postRegister} = useUser();
  const initValues: {
    username: string;
    password: string;
    confirmPassword?: string;
    email: string;
  } = {username: '', password: '', confirmPassword: '', email: ''};

  const doRegister = async (inputs: {
    username: string;
    password: string;
    confirmPassword?: string;
    email: string;
  }) => {
    try {
      delete inputs.confirmPassword;
      const registerResult = await postRegister(inputs as RegisterCredentials);
      console.log('Testi: ', registerResult);
      Alert.alert('Registration successful', 'You can now login');
      setDisplayRegister(false);
    } catch (error) {
      console.log((error as Error).message);
      Alert.alert('Registration failed', (error as Error).message);
    }
  };

  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  return (
    <Card>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Username is required',
          },
          minLength: {value: 3, message: 'Minimum length is 3'},
          maxLength: {value: 32, message: 'Maximum length is 32'},
          validate: async (value) => {
            try {
              const {available} = await getUserNameAvailable(value);
              console.log('username available?', value, available);
              return available ? available : 'Username taken';
            } catch (error) {
              console.log((error as Error).message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username?.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          minLength: {value: 8, message: 'Minimum length is 8'},
          required: {value: true, message: 'Password is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
            value={value}
            errorMessage={errors.password?.message}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          validate: (value) => {
            return value === getValues().password
              ? true
              : 'Passwords do not match';
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Confirm Password"
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
            value={value}
            errorMessage={errors.password?.message}
          />
        )}
        name="confirmPassword"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'Email is required'},
          pattern: {
            // simple email regex pattern, do better?
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'not a valid email',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
        name="email"
      />

      <Button title="Register" onPress={handleSubmit(doRegister)} />
    </Card>
  );
};

export default RegisterForm;
