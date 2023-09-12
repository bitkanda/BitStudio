import {React,useState,useCallback} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SessionHelp from './SessionHelp';
import SQLite from 'react-native-sqlite-storage';
import { useFocusEffect } from '@react-navigation/native';

// 打开或创建数据库
const db = SQLite.openDatabase({
    name: 'chat.db',
    location: 'default',
  });

  // 创建表格来存储聊天记录，包括avatar列
db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_id INTEGER, created_at DATETIME,session_id TEXT,user_name TEXT)'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, text TEXT, created_at DATETIME, user_name TEXT, user_id INTEGER)'
    );
  });

  


const styles = StyleSheet.create({
    item: {
        color: 'black', fontSize: 18
     
    },
    label: {
      fontSize: 18,
      color:'black'
    },
   
    grayText: {
      color: 'gray',
    },
  });



function HomeList() {

  const [data, setData] = useState([]);
 //var sessionData = [];  

  const fetchAllSessions=(sessions)=> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM sessions order by id desc',
          [],
          (_, result) => {
            
            for (let i = 0; i < result.rows.length; i++) {
              var item=result.rows.item(i);
              sessions.push(item);
               
              console.log("明细："+item.text);
              //setData(item);
            }
            //setData(result.rows);
            resolve(sessions);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

const LoadListData=(sessions)=>
{
  //SessionHelp.data=[];
  //fetchAllSessions(SessionHelp.data)
  fetchAllSessions(sessions)
  .then((sessions) => {
    console.log('Sessions load success!');
   
  })
  .catch((error) => {
    console.error('Error fetching sessions:', error);
  });
}

  // 在屏幕获得焦点时执行刷新数据的逻辑
  useFocusEffect(
    useCallback(() => {
      // 这里可以执行刷新数据的操作，例如重新获取数据
      //setData([{id:-1,text:"test"}]);
      setData(SessionHelp.data);
      console.log("执行刷新");
      // 返回一个清除函数，可选
      return () => {
        console.log("执行清除");
        // 在离开页面时执行清除操作
      };
    }, [/*route.params.session_id*/]) // 依赖于 session_id，当它发生变化时刷新数据
  );


  SessionHelp.data=[];
  LoadListData(SessionHelp.data);

//var data =await fetchAllSessions()
//data.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const navigation = useNavigation();

  
  const handleItemPress = (itemText) => {
    navigation.navigate('Details', { itemText });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { text: item.text,sessionId:item.session_id })} // 传递文本到Details页
      style={{
        padding: 10,
        backgroundColor: '#fff', // 背景颜色
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc', // 分隔线颜色
      }}
    >
      <Text style={{ color: 'black', fontSize: 18 }}>💬 {item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  </View>
  );
}



export default HomeList;
