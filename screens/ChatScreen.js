import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { AsyncStorage } from "react-native";
import { StyleSheet, TextInput, View, Button, KeyboardAvoidingView } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { auth, firestore } from "../api/firebase";
import { getLoginUser } from "../logic/userHandler";



// YellowBox.ignoreWarnings(["Setting a timer for a long period of time"]);


const ChatScreen = ({ route }) => {
  const { chatIdString, userdata } = route.params;
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState(chatIdString); // Added chatRoom state variable

  const handleChatRoomPress = () => {
    // Perform any actions or API calls related to joining chat room here
    // ...Your code here...
    setChatRoom(chatIdString);
    console.log("Joining chat room:", chatIdString);
  };
  // console.log("current user:")


  useEffect(() => {

    const unsubscribe = chatRoom // Only listen for chat room changes if chatRoom is set
      ? firestore
        .collection("chats")
        .doc(chatRoom)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
          const messagesFirestore = querySnapshot
            .docChanges()
            .filter(({ type }) => type === "added")
            .map(({ doc }) => {
              const message = doc.data();
              return { ...message, createdAt: message.createdAt.toDate() };
            })
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          appendMessages(messagesFirestore);
        })
      : null;
    return () => unsubscribe && unsubscribe(); // Unsubscribe if chatRoom is unset
  }, [chatRoom]);

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  // async function readUser() {

  //   const user = await AsyncStorage.getItem("user");
  //   console.log(user)
  //   if (user) {
  //     setUser(JSON.parse(user));
  //   }
  // }

  async function handleSend(messages) {
    const writes = messages.map((m) =>
      firestore
        .collection("chats")
        .doc(chatRoom) // Use chatRoom as the document ID for chat room
        .collection("messages") // Subcollection for messages under chat room
        .add(m)
    );
    await Promise.all(writes);
  }

  if (!chatRoom)
  {
    return (
      <View style={styles.container}>
        <Button onPress={handleChatRoomPress} title="Join Chat Room" />
      </View>
    );
  }
  return (
    <View style={styles.container} behavior="padding">
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{
          _id: userdata._id,
          name: userdata.firstName,
        }}
      />
    </View>

  );
};

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    alignContent: "center",
    // flexWrap: "wrap",
    height: "90%",
    marginVertical: 15,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});
