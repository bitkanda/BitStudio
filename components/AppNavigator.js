
import {React,useState,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity,Text,StyleSheet,Modal,View } from 'react-native';
import HomeScreen from './HomeScreen'; 
import DetailsScreen from './DetailsScreen'; 
import NewDetailsScreen from './NewDetailsScreen'; 
import LoginSMSPage from './LoginSMS';
import LoadingScreen from './LoadingScreen';
import { useNavigation } from '@react-navigation/native';
import NewModal from './NewModal';
import Login from './Login';
import BuyScreen from './BuyScreen';
import DeviceInfo from 'react-native-device-info';
import SQLite from 'react-native-sqlite-storage';
import SessionHelp from './SessionHelp';


const appVersion = DeviceInfo.getVersion();
const Stack = createStackNavigator();
 

function AppNavigator({ initialRouteName }) {
 
  const [isModalVisible, setModalVisible] = useState(false);
  const [initialRoute, setInitialRoute] = useState(initialRouteName);//Home,LoginSMS
  console.log('AppNavigator:initialRoute',initialRoute)
    useEffect(()=>{
      
      if(initialRoute==undefined)
      setInitialRoute("没有加载路由");
    console.log('AppNavigator-initialRoute:'+initialRoute);
     
    });


  const newHandleButtonPress = () => {
    setModalVisible(true);
  };

  const closeHandleButtonPress = () => {
    setModalVisible(false);
  };


  return (
    // initialRouteName={initialRoute}
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
     { console.log('渲染NavigationContainer:'+initialRoute)}
      
         <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ title: '', headerLeft: null}} /> 
         <Stack.Screen name="LoginSMS" component={LoginSMSPage} options={{ title: '', headerLeft: null}} /> 
        <Stack.Screen name="Login" component={Login} options={{ title: '',headerLeft: null }} />
           
     <Stack.Screen name="Home" component={HomeScreen} options={{ 
          title: '知之乐AI('+appVersion+')',
          headerLeft: null, // 这里设置为null
          headerRight: () => (
            <TouchableOpacity onPress={newHandleButtonPress}>
              <Text  style={styles.headerButton}>+</Text>
            </TouchableOpacity>
          )
           }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: '💬 知之乐AI' }} />
     <Stack.Screen name="NewDetailsScreen" component={NewDetailsScreen} options={{ title: '💬知之乐AI+' }} />
 
        <Stack.Screen name="buy" component={BuyScreen} options={{ title: '购买' }} />
 
       
      </Stack.Navigator>


      <NewModal isVisible={isModalVisible} onClose={closeHandleButtonPress} />

 
{/* 
        <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={newModal} style={styles.NewButton}>
              <Text  style={styles.NewButtonText}>新会话</Text>
           
            </TouchableOpacity>
            <TouchableOpacity onPress={tranModal} style={styles.NewButton}>
              <Text style={styles.NewButtonText}> 翻译</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>   */}

    </NavigationContainer>
  
  );
}

const styles = StyleSheet.create({

  headerButton: {
    color: 'black',
    fontSize: 20,
    marginRight: 5,
    width:30,
    height:30,
    borderWidth: 1, 
    borderColor: 'black', 
    textAlign:'center', 
    borderRadius: 2,
    fontWeight: 'bold', 
  },

  NewButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
 
  },
  NewButtonText: {
    color: 'black',
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
export default AppNavigator;
