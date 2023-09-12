/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavBar } from './components/navbar'
import ChatScreen from './ChatScreen';
import {
  GiftedChat,
  IMessage,
  Send,
  SendProps,
  SystemMessage,
  InputToolbar,
  Composer
} from 'react-native-gifted-chat'
import  { useCallback, useReducer,useState,useEffect } from 'react'
import { Alert, Linking, Platform } from 'react-native'

import { PermissionsAndroid } from 'react-native';

import AppNavigator from './components/AppNavigator'; // 导入 AppNavigator 组件


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      // backgroundColor: Colors.black
     },
    content: { 
      // backgroundColor: '#f5f5f5', 
      flex: 1 
    },
  })

  const [messages, setMessages] = useState([]);

  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
  
      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('存储权限已授予');
      } else {
        console.log('存储权限被拒绝');
      }
    } catch (err) {
      console.warn(err);
    }
  }
   
 

  return (
          <AppNavigator/>
    
  );
}


export default App;
