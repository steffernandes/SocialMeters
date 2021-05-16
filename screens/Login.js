import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import currentUserData from '../utils/userData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppButton from '../components/Button';
import Title from '../components/Title';
import {useNetInfo} from '@react-native-community/netinfo';
import {CommonActions} from '@react-navigation/native';
import NoConnection from './NoConnection';

const Login = ({navigation}) => {
  const [email, onEmailChange] = React.useState('');
  const [password, onPasswordChange] = React.useState('');
  const [emailIsFocused, setEmailIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [PasswordIsFocused, setPasswordIsFocused] = useState(false);
  const [errorsList, setErrorsList] = React.useState([]);

  let updateErrors = [...errorsList];

  const netInfo = useNetInfo();

  useEffect(() => {
    const retrieveData = async () => {
      let data = await AsyncStorage.getItem('user_data');
      if (data) {
        navigation.push('Dashboard');
      }
    };
    retrieveData();
  }, []);

  const login = () => {
    postData('https://covidapptf.herokuapp.com/users/login', {
      email: email,
      password: password,
    });
  };

  const postData = (url, data) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          if (!data.success) {
            if (updateErrors.length > 0) {
              updateErrors.length = 0;
            }
            for (let i = 0; i < data.errors.length; i++) {
              updateErrors.push(data.errors[i].msg);
            }
            setErrorsList(updateErrors);
          } else {
            getUserData(
              `https://covidapptf.herokuapp.com/users/${data.user._id}`,
              data.user.token,
            );
            currentUserData.setUserData(data.user);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Dashboard'}],
              }),
            );
          }
        }
      })
      .catch(function (error) {
        console.log(
          'There has been a problem with the fetch operation: ' +
            error.message,
        );
        throw error;
      });
  };

  const getUserData = (url, token) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          if (!data.success) {
            alert('Erro a encontrar os dados do utilizador');
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <SafeAreaView>
            <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />

            <Title>Login</Title>
            {errorsList.length > 0 ? (
              <View style={styles.errorsContainer}>
                {errorsList.map((error, index) => (
                  <Text
                    key={index}
                    style={{color: '#F95A2C', fontFamily: 'Roboto-Medium'}}>
                    {error}{' '}
                  </Text>
                ))}
              </View>
            ) : (
              <View style={{paddingBottom: '32%'}}></View>
            )}

            <View style={[styles.input, emailIsFocused && styles.isFocused]}>
              <Image
                style={styles.image}
                source={
                  emailIsFocused
                    ? require('../assets/img/mail-focused.png')
                    : require('../assets/img/mail.png')
                }
              />
              <TextInput
                keyboardType="email-address"
                style={{flex: 1}}
                onFocus={() => {
                  setEmailIsFocused(true);
                }}
                onBlur={() => {
                  setEmailIsFocused(false);
                }}
                onChangeText={email => onEmailChange(email)}
                defaultValue={email}
                placeholder="Email"
              />
            </View>

            <View style={[styles.input, PasswordIsFocused && styles.isFocused]}>
              <Image
                style={styles.image}
                source={
                  PasswordIsFocused
                    ? require('../assets/img/password-focused.png')
                    : require('../assets/img/password.png')
                }
              />
              <TextInput
                style={{flex: 1}}
                secureTextEntry={showPassword}
                onFocus={() => {
                  setPasswordIsFocused(true);
                }}
                onBlur={() => {
                  setPasswordIsFocused(false);
                }}
                onChangeText={password => onPasswordChange(password)}
                defaultValue={password}
                placeholder="Password"
              />

              <TouchableWithoutFeedback
                onPress={() => setShowPassword(!showPassword)}>
                <Image
                  style={styles.image}
                  source={
                    showPassword
                      ? require('../assets/img/show-password.png')
                      : require('../assets/img/hide-password.png')
                  }
                />
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.center}>
              <Text style={{marginVertical: 8}}>
                Ainda não tens uma conta? 
                <Text
                  onPress={() => navigation.navigate('Register')}
                  style={{color: '#00C6AE'}}>
                  Registra-te
                </Text>
              </Text>
              <Text
                style={{color: '#00C6AE'}}
                onPress={() => navigation.navigate('RequestPasswordChange')}> 
                Esqueci-me da palavra-passe
              </Text>
            </View>

            <View style={styles.center}>
              <AppButton onPress={login} title="Entrar" />
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#F9F9F9',
    color: '#0D1B1E',
  },

  container: {
    padding: 32,
  },

  errorsContainer: {
    borderRadius: 12,
    marginVertical: 32,
    padding: 16,
    backgroundColor: '#F3F3F3',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },

  image: {
    padding: 12,
    margin: 8,
    height: 8,
    width: 8,
    resizeMode: 'contain',
    alignItems: 'center',
  },

  input: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    color: '#0D1B1E',
    marginVertical: 12,
  },

  isFocused: {
    borderColor: '#00C6AE',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#0D1B1E',
  },
});

export default Login;
