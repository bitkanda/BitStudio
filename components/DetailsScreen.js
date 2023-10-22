import {React,useState,useEffect,useCallback }from 'react';
import { View, Text, Button,SafeAreaView,StyleSheet } from 'react-native';
import { NavBar } from './navbar'
import {
  GiftedChat,
  IMessage,
  Send,
  SendProps,
  SystemMessage,
  InputToolbar,
  Composer
} from 'react-native-gifted-chat'
import { Alert } from 'react-native'

import ai from '../assets/ai.png';
import my from '../assets/my.png';

import SQLite from 'react-native-sqlite-storage';

import { PermissionsAndroid } from 'react-native';

import  token  from '../token';
import SessionHelp from './SessionHelp';

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
  const expirationDate = new Date('2024-05-02');



const DetailsScreen = ({ route  }) => {

 
  const { sessionId } = route.params;



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

// // 创建表格来存储聊天记录，包括avatar列
// db.transaction((tx) => {
//   tx.executeSql(
//     'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_id INTEGER, created_at DATETIME,session_id TEXT,user_name TEXT)'
//   );
//   tx.executeSql(
//     'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, text TEXT, created_at DATETIME, user_name TEXT, user_id INTEGER)'
//   );
// });

 
 //设置默认消息 。
 const defaultMessage= 
  {
    _id: "9999999",
    text: '您好，我是知之乐AI，请提出您的问题。',
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
        //console.log("userid== currentUser.userId");
        //console.log(userid);
        return currentUser.avatar;
      }

      else if (userid== currentAI.userId)
      {
        //console.log("userid== currentAI.userId");
        return currentAI.avatar;
      }

      else 
      {
        //console.log("null");
        return null;
      }
     
  }


const loadChatHistory = (sessionId) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM messages where session_id="'+sessionId+'" ORDER BY id DESC',
        [],
        (tx, results) => {
          const messagesData = results.rows.raw();
       
          //console.log(messagesData);

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
    console.log("聊天详情,session_id:"+sessionId);
   
      // 请求存储权限
  requestStoragePermission();
      // 在组件挂载时加载聊天记录
  loadChatHistory(sessionId);
 
  }, []);

  function getSessionIdFromDatabase(sessionId) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT id FROM sessions WHERE session_id = ?',
          [sessionId],
          (_, { rows }) => {
            if (rows.length > 0) {
              const sessionId = rows.item(0).id;
              resolve(sessionId);
            } else {
              resolve(0); // 如果未找到匹配的 sessionId，则返回 null
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  function insertSession(sessionId, text, created_at, user_name, user_id) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO sessions (session_id, text, created_at, user_name, user_id) VALUES (?, ?, ?, ?, ?)',
          [sessionId, text, created_at, user_name, user_id],
          (_, result) => {
            const sessionId = result.insertId; // 获取刚插入的记录的 id
            resolve(sessionId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  const onSend = useCallback(async (newMessages = []) => {

  const currentDate = new Date();
  if (currentDate > expirationDate) {
    // 如果当前时间大于指定日期，提示授权过期信息
    Alert.alert('授权过期', '请联系阿汤哥以获取新的授权。');
    return;
  } 
  const userMessage = newMessages[0].text;
  var id=await getSessionIdFromDatabase(sessionId);
  console.log("检查id是否存在:");
  console.log(id);
  if(id==0)
  {
    var newid= await insertSession(sessionId,userMessage,newMessages[0].createdAt.toString(),
    newMessages[0].user.name,newMessages[0].user._id);
    console.log("插入：");
    console.log(newid);
    var item={created_at: newMessages[0].createdAt.toString(), id: newid,
     session_id: sessionId, text: userMessage, 
     user_id: newMessages[0].user._id, user_name: newMessages[0].user.name};
     SessionHelp.data.unshift(item);
     //SessionHelp.data.push(item);
    console.log(SessionHelp.data);
  }

   // console.log(newMessages);
    // 保存消息到 SQLite 数据库
    newMessages.forEach(async (message) => {
      try {
        await db.transaction((tx) => {

          tx.executeSql(
            'INSERT INTO messages (text, user_id, created_at,session_id,user_name) VALUES (?, ?, ?,?,?)',
            [message.text, message.user._id,message.createdAt.toString(),sessionId,message.user.name]
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
          'INSERT INTO messages (text, user_id, created_at,session_id,user_name) VALUES (?, ?, ?,?,?)',
          [responseMessage.text, responseMessage.user._id, responseMessage.createdAt.toString(),sessionId,currentAI.userName]
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

  const fetchChatGPTResponse = async (userMessage) => {
    try {
      const response = await fetch(
        token.API_URL
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

       {/* <NavBar /> */}
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
    />
        </View>
    </SafeAreaView>
    // <View>
    //   <Text>Details Screen</Text>
    //   <Button
    //     title="Go back to Home"
    //     onPress={() => navigation.navigate('Home')}
    //   />
    // </View>
  );
};

export default DetailsScreen;
