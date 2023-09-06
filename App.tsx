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

import ai from './assets/ai.png';
import my from './assets/my.png';

import SQLite from 'react-native-sqlite-storage';

import { PermissionsAndroid } from 'react-native';

import  token  from './token';

const sessionId=0;


//const userName="tom";
//const userId=1;

var currentUser={
  userName:"tom",
  userId:1,
  avatar:my
};

var currentAI={
  userName:"AI",
  userId:2,
  avatar:ai

};
  //设置过期时间。
  const expirationDate = new Date('2023-10-02');


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
  
// 打开或创建数据库
const db = SQLite.openDatabase({
  name: 'chat.db',
  location: 'default',
});

// 创建表格来存储聊天记录，包括avatar列
db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_id INTEGER, avatar TEXT, created_at DATETIME,session_id INTEGER,user_name TEXT)'
  );
});

 
 //设置默认消息 。
 const defaultMessage= 
  {
    _id: "9999999",
    text: '欢迎来到聊天室，请提出您的问题。',
    createdAt: new Date(),
    user: {
      _id: currentAI.userId,
      name: currentAI.userName,
      avatar:currentAI.avatar,
    },
  };

  function getAvatar(userid:number)
  {
   

      if(userid== currentUser.userId)
      {
        console.log("userid== currentUser.userId");
        console.log(userid);
        return currentUser.avatar;
      }

      else if (userid== currentAI.userId)
      {
        console.log("userid== currentAI.userId");
        return currentAI.avatar;
      }

      else 
      {
        console.log("null");
        return null;
      }
     
  }


const loadChatHistory = () => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM messages ORDER BY id DESC',
        [],
        (tx, results) => {
          const messagesData = results.rows.raw();
       
          console.log(messagesData);

          var formattedMessages = messagesData.map((data) => ({
            _id: data.id.toString(),
            text: data.text,
            user: {
              _id: data.user_id,
               name: data.user_name, // 你可以根据需要设置用户名
              avatar:getAvatar(data.user_id), // 从数据库中获取avatar值
               
            },
            createdAt: new Date(data.created_at),
          }));

          
           // 添加默认消息到数组末尾
 
          //console.log("formattedMessages:");
          //console.log(formattedMessages);
          setMessages(formattedMessages);

             // 将 chatgpt 的回复添加到聊天界面
          setMessages((formattedMessages) =>
          GiftedChat.append(formattedMessages, [
            defaultMessage
          ])
        );
      
        }
      );

      
    });

    //
    
  } catch (error) {
    console.error('加载聊天记录失败', error);
  }

   
};



  useEffect(() => {
      // 请求存储权限
  requestStoragePermission();
      // 在组件挂载时加载聊天记录
  loadChatHistory();
 
  }, []);



  const onSend = useCallback(async (newMessages = []) => {

  const currentDate = new Date();

 

  if (currentDate > expirationDate) {
    // 如果当前时间大于指定日期，提示授权过期信息
    Alert.alert('授权过期', '请联系阿汤哥以获取新的授权。');
    return;
  } 


    console.log(newMessages);

    // 保存消息到 SQLite 数据库
    newMessages.forEach(async (message) => {
      try {
        await db.transaction((tx) => {
        
       
          tx.executeSql(
            'INSERT INTO messages (text, user_id,avatar, created_at,session_id,user_name) VALUES (?, ?, ?,?,?,?)',
            [message.text, message.user._id, "",message.createdAt.toString(),sessionId,message.user.name]
          );

          console.log("保存消息");
        });
      } catch (error) {
        console.error('保存消息到数据库失败', error);
      }
    });

    // 将用户发送的消息添加到聊天界面
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    // 获取 chatgpt 的回复
    const userMessage = newMessages[0].text;
    const response = await fetchChatGPTResponse(userMessage);

    var responseMessage= {
      _id: Math.random().toString(),
      text: response,
      createdAt: new Date(),
      user: {
        _id: currentAI.userId,
        name: currentAI.userName,
        avatar: ai,
      },
    };

    // 将 chatgpt 的回复添加到聊天界面
    setMessages((prevMessages) =>
      GiftedChat.append(prevMessages, [
        responseMessage
      ])
    );

    console.log("保存返回消息。");
    try {
      await db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO messages (text, user_id,avatar, created_at,session_id,user_name) VALUES (?, ?, ?,?,?,?)',
          [responseMessage.text, responseMessage.user._id,"", responseMessage.createdAt.toString(),sessionId,currentAI.userName]
        );
      });




    } catch (error) {
      console.error('保存消息到数据库失败', error);
    }
    
  }, []);


  const globalStyles = StyleSheet.create({
    text: {
      color: 'black', // 设置全局文本颜色为黑色
    },
  });

  //const API_KEY="sk-CLmt45QiDOTYSTb4muUcTzQltPMWLkBr4mFJVs94RWEG91Me";
  const fetchChatGPTResponse = async (userMessage) => {
    try {
      const response = await fetch(
        token.API_URL
        //'https://api.chatanywhere.com.cn/v1/chat/completions'
      , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '+token.API_KEY, // 用你自己的 API 密钥替换
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'system message',
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('ChatGPT API 请求失败', error);
      return '抱歉，无法处理您的请求。';
    }
  };

 

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}
       <NavBar />
       <View style={styles.content}>
       <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      showUserAvatar={true}
    //  renderAvatar={renderAvatar}
    // renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
    // 使用 renderComposer 渲染自定义 Composer 组件
    renderComposer={(props) => (
      <Composer
        {...props}
        // 设置文本输入框的样式
        textInputStyle={{
          color: 'black', // 设置文本颜色为黑色
        //  backgroundColor: 'white', // 设置文本框背景颜色
          // 还可以设置其他样式属性
        }}
      />
    )}
      user={{
        _id: currentUser.userId,
        name:currentUser.userName,
        avatar: currentUser.avatar,
      }}
        // 在这里应用全局样式
  // textInputProps={{
  //   style: globalStyles.text,
  // }}
    />
        </View>
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
  
         
        <ChatScreen/>  
      </ScrollView> */}
    </SafeAreaView>
  );
}


export default App;
