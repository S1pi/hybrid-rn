import {Button, Card, Text} from '@rneui/base';
import React from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {Controller, useForm} from 'react-hook-form';
import {Credentials} from '../types/LocalTypes';
import {Input} from '@rneui/themed';
import {Alert} from 'react-native';

const LoginForm = () => {
  const {handleLogin} = useUserContext();
  const initValues = {username: '', password: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doLogin = async (inputs: Credentials) => {
    handleLogin(inputs);
    Alert.alert('Login successful', 'You are now logged in');
  };

  return (
    <Card>
      <Controller
        control={control}
        rules={{required: {value: true, message: 'Username is required'}}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
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
      <Button title="Login" onPress={handleSubmit(doLogin)} />
    </Card>
  );
};

export default LoginForm;
