import React from 'react';
import { View, Text, Button,Alert,BackHandler } from 'react-native';
import HomeList  from "./HomeList"
import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/native';
const HomeScreen = ({ navigation }) => {
  
  const handleBackPress=() => {
    // 弹出提示
    Alert.alert(
      '提示',
      '确定要退出应用吗？',
      [
        {
          text: '取消',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: () => {
            
            BackHandler.exitApp(); // 退出应用
          },
        },
      ],
      { cancelable: false }
    );

    // 拦截返回
    return true;
    }

  useFocusEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  });


  return (
    <View>
       
      {/* <Text>Home Screen</Text> */}
      <HomeList/>

      {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      /> */}
    </View>
  );
};

export default HomeScreen;
