import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/Register';
import Login from './screens/Login';
import ChangePassword from './screens/ChangePassword'
import RequestPasswordChange from './screens/RequestPasswordChange'
import RecoverPassword from './screens/RecoverPassword'
import SecurityCodeVerificationPassword from './screens/SecurityCodeVerificationPassword'
import SecurityCodeVerificationEmail from './screens/SecurityCodeVerificationEmail'
import Settings from './screens/Settings'
import Dashboard from './screens/Dashboard'
import Notifications from './screens/Notifications'
import JoinGroup from './screens/JoinGroup'
import QuizIntroduction from './screens/QuizIntroduction';
import QuizResults from './screens/QuizResults';
import Quiz from './screens/Quiz';
import ChangeEmail from './screens/ChangeEmail'
import ChangeDisplayName from './screens/ChangeDisplayName'
import Ranking from './screens/Ranking'
import CreateGroup from './screens/CreateGroup'
import GroupCreated from './screens/GroupCreated'
import GroupMembers from './screens/GroupMembers'
import GroupsRanking from './screens/GroupsRanking';
import GroupInfo from './screens/GroupInfo';
import ChangeGroupName from './screens/ChangeGroupName';
import Reward from './screens/Reward';
import Tutorial from './screens/Tutorial';

//import BluetoothTraking from './utils/BluetoothTraking'

const Stack = createStackNavigator();
/* BluetoothTraking.startScan(); */
function Navigation() {

  const config = {
    animation: 'timing',
    config: {
      duration: 4
    },
  };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard" screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "#F9F9F9",
        },
      }} >
        <Stack.Screen name="Login" component={Login} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="Register" component={Register} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="Settings" component={Settings} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="RequestPasswordChange" component={RequestPasswordChange} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="RecoverPassword" component={RecoverPassword} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="SecurityCodeVerificationPassword" component={SecurityCodeVerificationPassword} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="SecurityCodeVerificationEmail" component={SecurityCodeVerificationEmail} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="JoinGroup" component={JoinGroup} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="QuizIntroduction" component={QuizIntroduction} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="QuizResults" component={QuizResults} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="Quiz" component={Quiz} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="ChangeEmail" component={ChangeEmail} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="ChangeDisplayName" component={ChangeDisplayName} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="Ranking" component={Ranking} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="GroupCreated" component={GroupCreated} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="GroupMembers" component={GroupMembers} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="GroupsRanking" component={GroupsRanking} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="GroupInfo" component={GroupInfo} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="ChangeGroupName" component={ChangeGroupName} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="Reward" component={Reward} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

        <Stack.Screen name="Tutorial" component={Tutorial} options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;