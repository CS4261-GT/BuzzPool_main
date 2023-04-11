import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { AsyncStorage } from "react-native";
import { StyleSheet, TextInput, View, YellowBox, Button } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQZXcrStyOlnuf2oU1MPm-CVVnQIPGWZU",
  authDomain: "buzzpool-test.firebaseapp.com",
  projectId: "buzzpool-test",
  storageBucket: "buzzpool-test.appspot.com",
  messagingSenderId: "259892781917",
  appId: "1:259892781917:web:f8259e3f85c6a86dafbeb4",
  measurementId: "G-21VSFHWTTT",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

YellowBox.ignoreWarnings(["Setting a timer for a long period of time"]);

const db = firebase.firestore();

export const ChatScreen = ({ route }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState(null); // Added chatRoom state variable

  const { combinedString } = route.params;

  const handleChatRoomPress = () => {
    // Perform any actions or API calls related to joining chat room here
    // ...Your code here...
    setChatRoom(combinedString);
    console.log("Joining chat room:", combinedString);
  };

  useEffect(() => {
    readUser();
    const unsubscribe = chatRoom // Only listen for chat room changes if chatRoom is set
      ? db
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

  async function readUser() {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }

  async function handleSend(messages) {
    const writes = messages.map((m) =>
      db
        .collection("chats")
        .doc(chatRoom) // Use chatRoom as the document ID for chat room
        .collection("messages") // Subcollection for messages under chat room
        .add(m)
    );
    await Promise.all(writes);
  }

  if (!chatRoom) {
    return (
      <View style={styles.container}>
        <Button onPress={handleChatRoomPress} title="Join Chat Room" />
      </View>
    );
  }
  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{
        _id: user._id,
        name: user.name,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default ChatScreen;
