import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: '欢迎来到聊天室，请提出您的问题。',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: '机器人',
          avatar: 'https://placeimg.com/100/100/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    // 在这里添加逻辑来处理问题和回答
  }, []);

  return (
    <View>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1, // 用户ID，可以是随机生成的或者与用户相关的唯一标识
        }}
      />
      {/* {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />} */}
    </View>
  );
};

export default ChatScreen;
