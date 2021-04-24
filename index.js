/**
 * @format
 */
import * as React from 'react';
import { AppRegistry, LogBox} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Navigation from './Navigation'

import {name as appName} from './app.json';

//global.START_BLE_SCAN = false

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();

export default function Main() {
    return (
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    );
  }

AppRegistry.registerComponent(appName, () => Main);
