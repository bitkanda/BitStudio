import {React,useState,useEffect,useCallback }from 'react';
import { View, Text, Button,SafeAreaView,StyleSheet,NativeEventEmitter } from 'react-native';
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
import axios from 'axios';
import { NativeModules } from 'react-native';
const ChatGPTApi = NativeModules.ChatGPTApiModule;


const ChatGPTModuleEmitter = new NativeEventEmitter(ChatGPTApi);
//当前最新的gtp回复的消息框对象。
var currentResponseMessage=null;


//import RNFetchBlob from 'rn-fetch-blob';
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



const NewDetailsScreen = ({ route  }) => {

 
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
  const [responseMsg, setResponseMsg] = useState('');
  //const [MyContent, setMyContent] = useState('');
  //当前会话的内容。
  //const [currentMsg, setcurrentMsg] = useState('');
  var currentMsg='';
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
 
         console.log("formattedMessages:",formattedMessages);
       
         //  setMessages(formattedMessages);
         SessionHelp.messages=formattedMessages;
             // 将 chatgpt 的回复添加到聊天界面
         setMessages((e) =>
         GiftedChat.append(formattedMessages, [
           defaultMessage
         ])
      );
      //添加新元素
          // setMessages(previousMessages =>{
          //                   GiftedChat.append(formattedMessages, [
          //               defaultMessage
          //             ]);
          //               return [...formattedMessages];
          //             });
              //     setMessages((e) =>
              //   {

              //    GiftedChat.append(formattedMessages, [formattedMessages,
              //      defaultMessage
              //    ]);
              //    return formattedMessages;
              //   }
              //  );

            

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

    //绑定chatgpt接口事件。
    const subscription = ChatGPTModuleEmitter.addListener('onResponseData', event => {
      const { responseData } = event;
      var content="";
      //console.log('onResponseData:',responseData);
      var isMessage=false;
    
      //输出服务器返回数据。
      if (responseData.trim() !== ''&&responseData.trim().startsWith('data:')) {
        try {
          if(responseData.trim()=="data: [DONE]")
          {
            console.log('回答结束:',currentMsg);
         
            var responseMessage= {
              _id: Math.random().toString(),
              text:currentMsg,//测试 
             // setText:setMyContent,
              createdAt: new Date(),
              user: {
                _id: currentAI.userId,
                name: currentAI.userName,
                avatar: ai,
              },
            };
            //结束的时候才保存消息。
            SessionHelp.saveMessage([responseMessage],sessionId);

          }
          else
          {
          const modifiedResponseData = responseData.substring(5); 
          //console.log('modifiedResponseData:',modifiedResponseData);
          const responseDataJson = JSON.parse(modifiedResponseData);
          //console.log('responseDataJson',responseDataJson)
          const choices= responseDataJson.choices[0];
          const finish_reason=choices.finish_reason;
          if(finish_reason==null)
          {
            content=choices.delta.content;
            isMessage=true;
          }
          //console.log('content:',content);
          // responseDataJson 是转换后的 JSON 对象


        }
        } catch (error) {
          console.error('无法解析 responseData 为 JSON 对象:', error);
        }
      } else {
        //console.log('responseData 是空字符');
      }

      if(isMessage&&content!=undefined&&content!=null)
      {
            currentMsg=currentMsg + content;   
          //setcurrentMsg(e=>e+content);

             // 将 chatgpt 的回复添加到聊天界面 
            // currentResponseMessage.text=currentMsg;
             //currentResponseMessage._id=Math.random().toString();

             var responseMessage= {
              _id: Math.random().toString(),
              text:currentMsg,//测试 
             // setText:setMyContent,
              createdAt: new Date(),
              user: {
                _id: currentAI.userId,
                name: currentAI.userName,
                avatar: ai,
              },
            };

          //  SessionHelp.messages=formattedMessages;
              
              setMessages(previousMessages =>{
                var r=[responseMessage, ...previousMessages.slice(1)];
                SessionHelp.messages=r;//[responseMessage,...SessionHelp.messages.slice(1)];
                return  r; //  [responseMessage, ...previousMessages.slice(1)]
              });
              //console.log('previousMessages.slice(1)',messages);
              // setMessages(previousMessages =>{
              //   return [responseMessage, ...previousMessages.slice(1)];
              // });
            // messages[1].text=currentMsg;

            // const updatedMessages = GiftedChat.append(messages, messages[1]);
            
          // setMessages((prevMessages) =>
          // {
          //   const updatedMessages = GiftedChat.append(prevMessages, messages[1]);
          //  // GiftedChat.append(prevMessages, undefined)
          //    return   [updatedMessages]  ;
          //  } );

      }


      // messages.forEach(async (message) => {
      // message.text=currentMsg;

      // });
      //更新对话框数据。
      //  setMessages(messages);

      //更新会话中的文本。
      //currentResponseMessage.text=currentMsg;
       
     // setMyContent(currentMsg);
    });

      // 请求存储权限
  requestStoragePermission();
      // 在组件挂载时加载聊天记录
  loadChatHistory(sessionId);
 
  console.log('setMessages',messages);

  //添加测试代码
   // 自动倒计时消息
  //  let count = 10;

  //  const interval = setInterval(() => {
  //    if (count > 0) {
  //      const autoReplyMessage = {
  //        _id: Math.round(Math.random() * 10000), // 随机生成一个唯一的 ID
  //        text: `倒计时：${count}`,
  //        createdAt: new Date(),
  //        user: {
  //          _id: 2,
  //          name: 'Bot'
  //        }
  //      };
  //      setMessages(previousMessages => [autoReplyMessage, ...previousMessages.slice(1)]);
  //      count--;
  //    } else {
  //      clearInterval(interval);
  //    }
  //  }, 1000); // 每秒更新一次消息
  //结束测试 。
  return () => {
    subscription.remove();
    //clearInterval(interval)

  };

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
  //获取会话ID在数据库是否存在。
  var id=await getSessionIdFromDatabase(sessionId);
  console.log("检查id是否存在:");
  console.log(id);
  if(id==0)
  {
    //创建会话。
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

    //currentResponseMessage=newMessages[0];

    //console.log('onsend',SessionHelp.messages);
    // 将用户发送的消息添加到聊天界面
    setMessages((prevMessages) =>{
    var r= GiftedChat.append(prevMessages, newMessages);
    return r;
   } );
   SessionHelp.messages=[...newMessages, ...SessionHelp.messages];

    // 获取 chatgpt 的回复
    currentMsg='';
    //setcurrentMsg('');
    const response = await fetchChatGPTResponse(userMessage);

    console.log("API:",response);

    //const [MyContent, setMyContent] = useState(response);

    var responseMessage= {
      _id: Math.random().toString(),
      text:response,//测试 
     // setText:setMyContent,
      createdAt: new Date(),
      user: {
        _id: currentAI.userId,
        name: currentAI.userName,
        avatar: ai,
      },
    };

    var isAdd=true;
    if(isAdd)
    {
    // 将 chatgpt 的回复添加到聊天界面
    SessionHelp.messages=[... SessionHelp.messages,responseMessage];
    setMessages((prevMessages) =>{
    var r=   GiftedChat.append(prevMessages, [
        responseMessage
      ]);
   
      return r;
    });

    // console.log("保存返回消息。");
    // try {
    //   await db.transaction((tx) => {
    //     tx.executeSql(
    //       'INSERT INTO messages (text, user_id, created_at,session_id,user_name) VALUES (?, ?, ?,?,?)',
    //       [responseMessage.text, responseMessage.user._id, responseMessage.createdAt.toString(),sessionId,currentAI.userName]
    //     );
    //   });
    // } catch (error) {
    //   console.error('保存消息到数据库失败', error);
    // }
  }
    



  }, []);


  const globalStyles = StyleSheet.create({
    text: {
      color: 'black', // 设置全局文本颜色为黑色
    },
  });

  const fetchChatGPTResponse = async (userMessage) => {
    
    var sendMsg=[ {
      role: 'system',
      content: 'system message',
    }];
    
  

    //添加历史记录，让机器人记住前面的聊天内容。
    var r=  SessionHelp.messages.reverse();
    r.forEach(e=>{
    // 默认消息不发送。
      if(e._id==defaultMessage._id)
      return;
      var role='';
      if(e.user.name==currentAI.userName)
      role="assistant";
      else
      role="user";
      const i={
        role:role,
        content:e.text
      };
      sendMsg.push(i);
    });

    //当前问题
    // const i=  {
    //   role:'user',
    //   content: userMessage
    // };
    // sendMsg.push(i);
    console.log('sendMsg',sendMsg);

    try{
    var data={
      model: 'gpt-3.5-turbo',
      stream:true,
      messages: sendMsg,
    };

    var header={
      'Content-Type': 'application/json',
      Authorization: 'Bearer '+token.API_KEY, // 用你自己的 API 密钥替换
    };
     
       
       ChatGPTApi.fetchData( token.API_URL,JSON.stringify(data),token.API_KEY)
       .then(e =>{
        console.log('fetchData finall:',e);
        //Alert.alert('请求错误', e.message);
       })
      .catch(error => {
        console.error('fetchData error',error);
        Alert.alert('请求错误', error.message);
      });
    
      // const response = await fetch(
      //   token.API_URL
      // , {
      //   method: 'POST',
      //   headers: header,
      //   body: JSON.stringify(data),
      // });
      // const response = await axios.post(token.API_URL, data, {
      //   headers: header,
  
      // });
    
      //let result = '';
     // console.log('response.data',response.data);
      // response.data.on('data', (chunk) => {
      //   result += chunk.toString(); // 将每个数据块转换为字符串并拼接结果
      // });
  
      // response.data.on('end', () => {
      //   console.log(result); // 打印最终结果
      // });

      // const reader = response.data.pipe(Readable.from('utf8'));

      // let result = '';
      // for await (const chunk of reader) {
      //   result += chunk;
      //   console.log('chunk',chunk);
      // }

      // console.log('result',result);
      // response.data.forEach(message => {
      //   console.log(message);
      // });
   

      return '...';
    } catch (error) {
      console.error('ChatGPT API 请求失败', error);
      return '抱歉，无法处理您的请求。';
    }
  };

  
  
  return (
    <SafeAreaView style={styles.container}>

       {/* <NavBar /> */}
       <View style={styles.content}>
       {/* <Text style={{ color: 'black', fontSize: 16   }}>{MyContent}</Text> */}
       <GiftedChat
      
      messages={messages}
      placeholder='请输入您的问题...'
      renderTime={(props) => (
        ''
        // <Text style={
        //   { color: props.currentMessage.user.name=="AI"?'#999':'#FFFFFF', 
        //   fontSize:10, 
        //   marginLeft:10,
        //   marginTop:-5,
        //   marginRight:10,
        //   textAlign: 'left'
        //    }}>
        //   {
        //  '提示:23 完成:48 总数:110'
        //   }
        // </Text>
      )}
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
  );
};

export default NewDetailsScreen;
