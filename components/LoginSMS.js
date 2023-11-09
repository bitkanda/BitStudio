import React, { useState ,useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text,StyleSheet,Image ,Switch, Alert   } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

import SQLite from 'react-native-sqlite-storage';
import SessionHelp from './SessionHelp';

//import CheckBox from '@react-native-community/checkbox';
const LoginSMSPage = () => {
  const isTest=true;//测试模式。
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [sendSms, setsendSms] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [countdown, setCountdown] = useState(0);
  const sendSmsByAPI=async()=>{
    try {
      const response = await fetch(`http://zhizhile.net/api/user/GetSmsCode?phoneNumber=${phone}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // params: {
      //   phoneNumber: phone,
      // },
    });
    const data = await response.json();
    console.log(data);
      if (data.success) {
        return true;
      } else {
        Alert.alert("提示", data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      Alert.alert("提示", "验证码发送失败");
      return false;
    }
  };

  const handleSendSms =async () => {
    if(!isEnabled)
    {
      Alert.alert("提示","同意条款");
      return;
    }

     // 判断手机号是否是中国大陆手机号
  const chinaMainlandPrefixes = ["13", "14", "15", "16", "17", "18", "19"];
  const prefix = phone ? phone.substring(0, 2) : '';
  if (!chinaMainlandPrefixes.includes(prefix)) {
    Alert.alert("提示", "手机号不合法");
    return;
  }

    if (countdown === 0) {

      var s=await sendSmsByAPI();
      if(s)
      {
        // 发送验证码逻辑
        setCountdown(60);
      }

    }
  };




  useEffect(() => {
    //var user=SessionHelp.user;
   // checklogin();
 
    let intervalId;
    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }
    else
    {
      //没有手机号，默认一个。
      if(phone=='')
      {
        setPhone(SessionHelp.user.phoneNumber);
      }
    }
   
    return () => clearInterval(intervalId);
  }, [countdown]);


  // 打开或创建数据库
const db = SQLite.openDatabase({
  name: 'chat.db',
  location: 'default',
});

const saveUserInfo= (data)=>{
    // 建表
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, authToken TEXT, expires TEXT, phoneNumber TEXT, createdAt TEXT)',
        [],
        (tx, result) => {
          // 保存用户信息
          const currentTime = new Date().toISOString();
          tx.executeSql(
            'INSERT INTO users (authToken, expires, phoneNumber, createdAt) VALUES (?, ?, ?, ?)',
            [data.authToken, data.expires, phone, currentTime],
            (tx, result) => {
              console.log('用户信息保存成功');
            },
            (tx, error) => {
              console.log('保存用户信息失败:', error);
            }
          );
        },
        (tx, error) => {
          console.log('建表失败:', error);
        }
      );
    });
};
  const handleLogin =async () => {

     
    if(!isEnabled&&!isTest)
    {
      Alert.alert("提示","同意条款");
      return;
    }

    //补充用户名.
    // 判断手机号是否是中国大陆手机号
    const chinaMainlandPrefixes = ["13", "14", "15", "16", "17", "18", "19"];
    const prefix = phone ? phone.substring(0, 2) : '';
    if (!isTest&&!chinaMainlandPrefixes.includes(prefix)) {
      Alert.alert("提示", "手机号不合法");
      return;
    }

    try {
      var data=undefined;
      if(isTest)
      {
        data={
          authToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxMzgyNDEyODMwNiIsIm5iZiI6MTY5ODQ4NTM1OSwiZXhwIjoxNzAzNjY5MzU5LCJpYXQiOjE2OTg0ODUzNTl9.00743zcv-j2iZ33DFFEN-VWqhCzMQqOpBi_OQBNJVXc",
          createdAt:"2023-10-28T09:29:12.348Z",
          expires:"2023-12-27 09:29:27",
          id:6,
          phoneNumber:"13824128306",
          success:true,
          message:""
      };
      }
      else
      {
            const response = await fetch(`http://zhizhile.net/api/user/LoginSms?phoneNumber=${phone}&smsCode=${password}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
      
           data = await response.json();
      }
      if (data.success) {
        saveUserInfo(data);
        navigation.navigate('Home');
      } else {
        Alert.alert("提示", data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("提示", "登录失败");
    }

  };

 const onSelect=(index, value)=>{
    this.setState({
    text: `Selected index: ${index} , value: ${value}`
    })
}




  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        图标
      </Text> */}
       <View style={{  padding: 50, alignItems: 'center' }}>
      <Image source={require('../assets/logo.png')} style={{ width: 75, height: 75 }} />
      
  
      
    </View>
 
      <TextInput
        style={{ 
          height: 40,  borderWidth: 0, marginBottom: 10 ,color:'black',
          borderBottomColor: 'gray', // 底部边框颜色
          borderBottomWidth: 1 // 底部边框宽度
        }}
        placeholder="请输入手机号"
        placeholderTextColor="gray" 
        value={phone}
        onChangeText={text => setPhone(text)}
      />
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          style={{ 
            flex: 1, height: 40, borderColor: 'gray' ,color:'black',
            borderBottomColor: 'gray', // 底部边框颜色
            borderBottomWidth: 1 // 底部边框宽度
          }}
          placeholder="请输入验证码"
          placeholderTextColor="gray" 
          secureTextEntry={!sendSms}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        
        <TouchableOpacity
          onPress={handleSendSms}
          style={{ padding: 10 }}
        >
            <Text style={{ color: 'black' }}>
            {countdown === 0 ? '获取验证码' : `${countdown}秒`}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: '#007BFF', padding: 10, alignItems: 'center', borderRadius: 5 }}
      >
        <Text style={{ color: 'white', fontSize: 16   }}>登录</Text>
      </TouchableOpacity>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        {/* <CheckBox value={agreeTerms} onValueChange={value => setAgreeTerms(value)} /> */}
        <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
        <Text style={{ marginLeft: 10 ,color:'black' }}>同意条款</Text>
      </View>
 


      <View style={styles.container}>
{/* 
      <Text style={styles.title}>账号登录</Text> */}

      {/* 其他组件 */}
    </View>
      {/* <Text style={{ marginTop: 10, color: 'blue', textDecorationLine: 'underline' }}>手机验证码登录</Text> */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textDecorationLine: 'none',
  },
});

export default LoginSMSPage;
