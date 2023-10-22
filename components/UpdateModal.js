import {React,useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity,Text,StyleSheet,Modal,View, Alert } from 'react-native';
import HomeScreen from './HomeScreen'; 
import DetailsScreen from './DetailsScreen'; 
import { useNavigation } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import DeviceInfo from 'react-native-device-info';
import {
  NativeModules,
} from 'react-native';
import RNFS from 'react-native-fs';
const { RNApkInstaller,PushNotification } = NativeModules;


function UpdateModal({ isVisible, onClose,lastVersion }){

  const handleDownload = () => {
    //requestStoragePermission();
    console.log(lastVersion);
    downloadFile(lastVersion.url);
  };

  const channelId="default";
  const updateNotificationId = 1;//Math.floor(Math.random() * 1000);
  const savePath = `${RNFS.ExternalDirectoryPath}/${DeviceInfo.getApplicationName()}.apk`;

  const downloadFile = (downloadUrl) => {

    const appVersion = DeviceInfo.getVersion();
   
    console.log('App Version:', appVersion);
  //sendToNotificationCentreWithPicture
    // 配置通知通道


    try
    {
      PushNotification.createChannel(
        {
          channelId: channelId, // 通知通道的唯一标识符
          channelName: '下载进度通知', // 通知通道的名称
          channelDescription: '用于显示下载进度的通知', // 通知通道的描述
          playSound: false, // 是否播放声音
          vibrate: false, // 是否震动
        },
        (created:any) => console.log(`通知通道已创建: ${created}`) // 回调函数用于显示通知通道创建状态
      );
    }
    catch(error)
    {
      console.log("createChannel",error.message);
      Alert.alert("createChannel",error.message);
    }

// 调用更新进度的方法
//aPushNotification.updateProgress(50); // 传递当前进度

// 调用隐藏通知的方法

    let lastProgress = 0;
    const progressInterval = 1500; // 设置回调的最小时间间隔为1秒
    
    const downloadProgress = (res :any) => {
      const currentProgress = Math.floor
      ((res.bytesWritten / res.contentLength) * 100);
    //  console.log(`Downloaded 下载中: ${currentProgress}%`);
      //setProgress(currentProgress);
      if (currentProgress - lastProgress >= 1) { // 限制回调的频率
        lastProgress = currentProgress;
      


        //PushNotification.cancelLocalNotifications({ id: notificationId });
        var progress={ max: 100, progress: currentProgress, indeterminate: false };
        //console.log(progress);
        try
        {
        PushNotification.localNotification({
          id: updateNotificationId,
          channelId: channelId,
          title: '正在下载更新程序',
          message: `下载进度: ${currentProgress}%`,
          showProgress: true, // 是否显示进度条
          progress: progress,
           // 禁用震动
          vibrate: false,
          //importance: 1,
          playSound: false,
        }) ;
      }   
      catch(error)
      {
        Alert.alert("createChannel",error.message);
      }
         
    }
  


    };
 /*
 const downloadProgress=(downloadProgress:any)=>{
        const percentage = ((downloadProgress.bytesWritten / downloadProgress.contentLength) * 100).toFixed(2); // 保留两位小数
         console.log(`Downloaded ${percentage}%`);
 };
  */
    const downloadOptions = {
      fromUrl: downloadUrl,
      toFile: savePath,
      progress:downloadProgress
      ,
    };
  
    const downloadTask = RNFS.downloadFile(downloadOptions);
    downloadTask.promise
      .then((response) => {
        console.log('Download completed:', response);
        console.log(savePath);

        var progress={ max: 100, progress: 100.0, indeterminate: false };
        try{
     

        PushNotification.localNotification({
          id: updateNotificationId,
          channelId: channelId,
          title: '正在下载更新程序',
          message: `下载完成`,
          progress: progress,
          playSound:false
        });

            //  //下载完了，不显示通知。
            //  PushNotification.hideNotification({
            //   id: updateNotificationId,
            //   channelId: channelId
            // });
    

      }
      catch(error)
      {
        Alert.alert("createChannel",error.message);
      }
      try{
      const install=  RNApkInstaller.installApk(savePath, 
        (successMessage:any) => {
          Alert.alert('成功消息', successMessage);
        },
        (errorMessage:any) => {
          Alert.alert('错误消息', errorMessage);
        });
      } 
      catch(error)
      {
        Alert.alert("createChannel",error.message);
      }
        console.log("完成！");
  
      }).catch((error) => {
        // 在此处捕获下载时的异常
        console.error("下载异常:", error);
        // 添加适当的错误处理逻辑，例如显示错误消息或执行其他操作
      }) ;
  };
 
  //关闭
  const closeModal = () => {
    onClose(); 
  };


  const updateStart = () => {
    onClose(); 
    handleDownload();
    
  };
  
    return(
        <Modal  visible={isVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={styles.VersionButtonText}> 最新版本：{lastVersion.versionName}</Text>
          <Text style={styles.VersionButtonText}> {lastVersion.time}</Text>
            <TouchableOpacity onPress={updateStart} style={styles.NewButton}>
              <Text style={styles.NewButtonText}> 立即升级</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} style={styles.NoButton}>
              <Text style={styles.NewButtonText}> 延后升级</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>  

    );
}


const styles = StyleSheet.create({
 
  
    NewButton: {
      backgroundColor: '#007BFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      margin: 10,
   
    },

    NoButton: {
      backgroundColor: 'gray',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      margin: 10,
   
    },

    NewButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },

    VersionButtonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      elevation: 5,
      width: 300, // 调整宽度为更大的值
    },
  
  });

export default UpdateModal;

 