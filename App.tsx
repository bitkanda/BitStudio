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
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import {
  NativeModules,
} from 'react-native';
const { RNApkInstaller,PushNotification } = NativeModules;

import { TouchableOpacity } from 'react-native';
import UpdateModal  from './components/UpdateModal';
 
//import PushNotification from 'react-native-push-notification';
//import { Notifications } from 'react-native-notifications';

//var updateurl="http://192.168.1.102:5009/update/index";
var updateurl="http://scmtop.com/update/index";
const savePath = `${RNFS.ExternalDirectoryPath}/${DeviceInfo.getApplicationName()}.apk`;



const channelId="default";
const updateNotificationId = 1;//Math.floor(Math.random() * 1000);
function App(): JSX.Element {

  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [latestVersionInfo, setLatestVersionInfo] = useState({versionName:"",url:"",time:""});


  const newHandleButtonPress = () => {
    setUpdateModalVisible(true);
  };

  const closeHandleButtonPress = () => {
    console.log("closeHandleButtonPress");
    setUpdateModalVisible(false);
  };

  //const [progress, setProgress] = useState(88);
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

     // 添加按钮样式
  downloadButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  })





  //const [messages, setMessages] = useState([]);

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
  
  const checkUpdateResponse = async (ApiUrl:String) => {
    try {
      
     
      var url=ApiUrl+"?os="+Platform.OS;
      console.log("checkUpdate url:"+url);
      const response = await fetch(
        url
      , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log("checkUpdateResponse:返回");
      console.log(data);
      return data;
    } catch (error) {
      console.error('获取最新的版本信息失败:'+error.message);
      //throw new Error('抱歉，无法获取最新的版本信息。');
      return checkupdateResult('获取最新的版本信息失败:'+error.message);
    }
  };

 const checkupdateResult=(ErrorMsg:String)=>{
  return { isError:true,errorMsg:ErrorMsg,data:{}};
 }

 const getLatestVersionInfoResult=(ErrorMsg:String,d:any)=>{
  return { isError:(ErrorMsg==""?false:true),errorMsg:ErrorMsg,data:d};
 }

  const getLatestVersionInfo = async (ApiUrl: string) => {
    try {
      // 获取版本信息

      const data = await checkUpdateResponse(ApiUrl);
      if (data && data.isError)
      {
          return getLatestVersionInfoResult(data.errorMsg,{});
      }

      if (data && data.release && data.release.length > 0) {
        // 根据时间排序版本信息
        const sortedReleases = data.release.sort((a, b) => {
          const timeA = new Date(a.time).getTime();
          const timeB = new Date(b.time).getTime();
          return timeB - timeA;
        });
  
        // 返回最新版本的信息
        return  getLatestVersionInfoResult("",sortedReleases[0]);
      } else {
        return getLatestVersionInfoResult('版本信息不完整或为空。',{});
      }
    } catch (error) {
      console.error('获取最新版本信息失败' + error.message); 
      return getLatestVersionInfoResult('抱歉，无法获取最新版本信息。',{});
    }
  };

  
 
  const handleDownload = () => {
    requestStoragePermission();
  
  };

  

// 获取当前应用程序的版本信息
const getCurrentAppVersion = () => {
  return DeviceInfo.getVersion();
};

// 比较版本信息并执行下载操作
const checkAndUpdateVersion = async (ApiUrl: string, handleDownload: () => void) => {
  try {
    // 获取最新版本信息
    const latestVersionResult = await getLatestVersionInfo(ApiUrl);
    if(latestVersionResult&&latestVersionResult.isError)
    {
      Alert.alert(latestVersionResult.errorMsg);
      return;
    }

    const latestVersion =latestVersionResult.data;
    if (latestVersion && latestVersion.versionName) {
      // 获取当前应用程序的版本信息
      const currentVersion = getCurrentAppVersion();

      // 将最新版本的versionName字符串解析为数字数组
      const latestVersionParts = latestVersion.versionName.split('.').map(Number);
      const currentVersionParts = currentVersion.split('.').map(Number);

      // 逐个比较每个版本号部分
      let isNewerVersion = false;
      for (let i = 0; i < Math.min(latestVersionParts.length, currentVersionParts.length); i++) {
        if (latestVersionParts[i] > currentVersionParts[i]) {
          isNewerVersion = true;
          break;
        } else if (latestVersionParts[i] < currentVersionParts[i]) {
          break;
        }
      }

      if (isNewerVersion) {
        // 提出提示框，让用户自行选择升级。
        setUpdateModalVisible(true);
        setLatestVersionInfo(latestVersion);
      } else {
        console.log('当前应用程序已是最新版本。');
      }
    } else {
      console.error('无法获取最新版本信息。');
    }
  } catch (error) {
    console.error('检查和更新版本时出现错误：', error);
  }
};




const checkAndUpdateVersionEvent=async ()=>{
 await checkAndUpdateVersion(updateurl,handleDownload);


};

  useEffect( () => {
    console.log("useEffect");
   //requestStoragePermission();


   
   checkAndUpdateVersion(updateurl,handleDownload).then((versionInfo)=>{
    console.log(versionInfo);

    const appVersion = DeviceInfo.getVersion();
   
    console.log('App Version:', appVersion);

   }).catch((error) => {
    // 处理错误
    console.error('获取最新版本信息失败', error);
  });
   //downloadFile();
    // 调用显示通知的方法
   // PushNotification.showProgressNotification();
     

  }, []);



  //  // 发送通知
  //  PushNotification.localNotification({
  //   id:updateNotificationId,
  //   channelId: channelId, // 使用之前创建的通知渠道
  //   title: '正在下载',
  //   message: `下载进度: ${progress}%`,
  //   // 自定义通知布局，包括进度条
  //   bigText: `下载进度: ${progress}%`,
  //   largeIcon: 'ic_launcher',
  //   smallIcon: 'ic_notification',
  //   progress: { max: 100, current: progress, indeterminate: false },
  // });
  



  return (
          // <AppNavigator/>
          <View style={styles.container}>
{/*   
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={checkAndUpdateVersionEvent} // 按钮点击时调用 handleDownload 方法
          >
            <Text style={styles.buttonText}>下载更新</Text>
          </TouchableOpacity>   */}
          <UpdateModal isVisible={isUpdateModalVisible} onClose={closeHandleButtonPress} lastVersion={latestVersionInfo} />
          <AppNavigator />
        </View>
  );
}


export default App;
