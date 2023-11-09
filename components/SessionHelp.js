import React, { useState } from 'react';
import SQLite from 'react-native-sqlite-storage';
class SessionHelp {
  constructor()
  {


  }

  static dataState() {
    const [data, setData] = useState([]); 
    return {
      data,
      setData,  
    };
  }
   
  // sessions
    static data = [];  
  
    static user={id:0};
    //当前的messages.
    static messages=[];
            // 打开或创建数据库
     static db = SQLite.openDatabase({
              name: 'chat.db',
              location: 'default',
            });

    static checklogin (remark,user,setInitialRoute) {
      console.log(remark+'-checklogin',user);
     
    
    if (user) {
      const currentTime = new Date().toISOString();
      if (user.expires < currentTime) {
        // 用户信息已过期
        if(setInitialRoute)
         setInitialRoute(false);
        console.log(remark+"-用户信息已过期******");
      } else {
        // 用户信息未过期
        console.log(remark+"-用户信息未过期******");
        if(setInitialRoute)
         setInitialRoute(true);
     
      }
    } else {
        // 没有 用户
        if(setInitialRoute)
        setInitialRoute(false);
        console.log(remark+"-没有 用户");
    }
     
    }

    static  readUser(remark,setInitialRoute){
      console.log(remark+'-readUser');
 
      // 从1.7版本开始，需要初始化用户表。
     SessionHelp.db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, authToken TEXT, expires TEXT, phoneNumber TEXT, createdAt TEXT)',
          [],
          (tx, result) => {
            console.log('创建用户表成功。');
          },
          (tx, error) => {
            console.log('创建用户表失败:', error);
          }
        );
         // 读取用户信息
        tx.executeSql(
          'SELECT * FROM users ORDER BY id DESC LIMIT 1',
          [],
          (tx, result) => {
            const user = result.rows.item(0);
            if(user)
            SessionHelp.user=user;

            SessionHelp.checklogin(remark,user,setInitialRoute);
          },
          (tx, error) => {
            console.log('读取用户信息失败:', error);
          }
        );
      });
      
      }
      
      static saveMessage(newMessages,sessionId)
      {
        newMessages.forEach(async (message) => {
          try {
            await SessionHelp.db.transaction((tx) => {
    
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
      }
      
  static sigout()  {
    console.log('sigout');
    console.log(SessionHelp.user);
    const userId = SessionHelp.user.id;
    console.log('update userId:'+userId);
    const currentUTC = new Date();
    currentUTC.setUTCSeconds(currentUTC.getUTCSeconds() - 1);
    const currentTime = currentUTC.toISOString();
 
    SessionHelp.db.transaction((tx) => {
    tx.executeSql('UPDATE users SET expires = ? WHERE id = ?', [currentTime,userId], (txObj, resultSet) => {
      console.log('UPDATE rows:', resultSet.rowsAffected);
    }, (error) => {
      console.log('UPDATE error:', error);
    });
  });
  SessionHelp.user.expires=currentTime;

    
  };

  }
 


export default SessionHelp;
 