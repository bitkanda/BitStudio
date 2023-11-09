import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text,StyleSheet,Image ,Switch, Alert   } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
//import CheckBox from '@react-native-community/checkbox';
const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleLogin = () => {

    if(!isEnabled)
    {
      Alert.alert("提示","同意条款");
      return;
    }

    // 调用登录接口
    // TODO: 在此处编写登录逻辑
    navigation.navigate('Home');
  };

  const handleLoginSms = () => {
    navigation.navigate('LoginSMS');
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
          placeholder="密码"
          placeholderTextColor="gray" 
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ padding: 10 }}
        >
          <Text>{showPassword ? '🙈' : '👁️'}</Text>
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
      <Text style={styles.title} onPress={handleLoginSms}>手机验证码登录</Text>
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

export default LoginPage;
