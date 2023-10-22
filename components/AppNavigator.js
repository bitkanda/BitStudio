
import {React,useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity,Text,StyleSheet,Modal,View } from 'react-native';
import HomeScreen from './HomeScreen'; 
import DetailsScreen from './DetailsScreen'; 
import { useNavigation } from '@react-navigation/native';
import NewModal from './NewModal';
import Login from './Login';
import DeviceInfo from 'react-native-device-info';
const appVersion = DeviceInfo.getVersion();
const Stack = createStackNavigator();
 

function AppNavigator() {

  const [isModalVisible, setModalVisible] = useState(false);

  const newHandleButtonPress = () => {
    setModalVisible(true);
  };

  const closeHandleButtonPress = () => {
    setModalVisible(false);
  };

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ title: '' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ 
          title: '知之乐AI('+appVersion+')',
          headerRight: () => (
            <TouchableOpacity onPress={newHandleButtonPress}>
              <Text  style={styles.headerButton}>+</Text>
            </TouchableOpacity>
          )
           }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: '💬 知之乐AI' }} />
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
