import {React,useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity,Text,StyleSheet,Modal,View, Alert } from 'react-native';
import HomeScreen from './HomeScreen'; 
import DetailsScreen from './DetailsScreen'; 
import { useNavigation } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
function NewModal({ isVisible, onClose }){

    
  //const [isModalVisible, setModalVisible] = useState(_isModalVisible);
//   const newHandleButtonPress = () => {
//     setModalVisible(true);
//   };
 const navigation = useNavigation();

  
  const tranModal = () => {

    onClose(); 
    Alert.alert('提示', '即将开放，敬请期待');
  };


  const newModal = () => {
    onClose(); 
    
    const newGuid =uuidv4();
    console.log(newGuid);
    navigation.navigate('Details', { Text: "新会话" ,sessionId:newGuid });
  };

  
    return(
        <Modal  visible={isVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={newModal} style={styles.NewButton}>
              <Text  style={styles.NewButtonText}>新会话</Text>
           
            </TouchableOpacity>
            <TouchableOpacity onPress={tranModal} style={styles.NewButton}>
              <Text style={styles.NewButtonText}> 翻译</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.NewButton}>
              <Text style={styles.NewButtonText}> 关闭</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>  

    );
}


const styles = StyleSheet.create({
 
  
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

export default NewModal;

 