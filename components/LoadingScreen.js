import {React ,useEffect}from 'react';
import { View, Text, Button } from 'react-native';
import SessionHelp from './SessionHelp';
import { useNavigation } from '@react-navigation/native'; 

var currentNavigation=undefined;

const checkLoginExpiration = () => {

    SessionHelp.readUser('LoadingScreen',(islogin)=>{

      if(islogin)
      {
        console.log('LoadingScreen:SessionHelp.readUser:'+SessionHelp.user.expires);
        try
        {
            currentNavigation.navigate("Home");
        }
      catch(e)
      {
        console.log('checkLoginExpiration',e);
      }
      } 
    else
    {
      var expires='';
      if(SessionHelp.user)
      expires=SessionHelp.user.expires;
      console.log('LoadingScreen:SessionHelp.readUser:'+expires);

      try
      {
          currentNavigation.navigate("LoginSMS");
      }
    catch(e)
    {
      console.log('checkLoginExpiration',e);
    }
    }

    });

  };

const LoadingScreen = ({ navigation }) => {
    currentNavigation=navigation;
//console.log('LoadingScreen',navigation);

   // const navigation = useNavigation();
    useEffect(() => {
console.log('LoadingScreen',SessionHelp.data);

checkLoginExpiration();
    });
   

  return (
    <View>
       
      
    </View>
  );
};

export default LoadingScreen;
