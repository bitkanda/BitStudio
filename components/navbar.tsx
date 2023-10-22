import React from 'react'
import { View, Text, Platform,TouchableOpacity  } from 'react-native'

export function NavBar() {
  if (Platform.OS === 'web') {
    return null
  }
  return (
    
<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
 <TouchableOpacity onPress={() => {}}>
   <Text style={{fontSize: 25}}>{' < '}</Text>
 </TouchableOpacity>
  <Text>💬 知之乐AI 会话</Text>
  <TouchableOpacity onPress={() => {}}>
    <Text style={{fontSize: 25}}>{' ::: '}</Text>
  </TouchableOpacity>
</View>
    // <View
    //   style={{
    //     alignItems: 'center',
    //   }}
    // >
    //   <Text>💬 AI Studio Chat
    //     {/* {'\n'} */}
    //     </Text>
      
    // </View>
  )
}
 