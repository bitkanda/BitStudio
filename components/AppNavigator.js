
import {React,useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity,Text,StyleSheet,Modal,View } from 'react-native';
import HomeScreen from './HomeScreen'; 
import DetailsScreen from './DetailsScreen'; 
import { useNavigation } from '@react-navigation/native';
 import NewModal from './NewModal';

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
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ 
          title: 'AI Studio',
          headerRight: () => (
            <TouchableOpacity onPress={newHandleButtonPress}>
              <Text  style={styles.headerButton}>+</Text>
            </TouchableOpacity>
          )
           }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: '💬 AI Studio Chat' }} />
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
