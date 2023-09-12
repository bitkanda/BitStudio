import React from 'react';
import { View, Text, Button } from 'react-native';
import HomeList  from "./HomeList"

const HomeScreen = ({ navigation }) => {
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
