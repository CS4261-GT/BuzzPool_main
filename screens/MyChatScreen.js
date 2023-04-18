import {
  Avatar,
  Card,
  Text,
  Checkbox,
  SegmentedButtons,
  Button,
} from "react-native-paper";
import { DateTimePickerModal } from "react-native-paper-datetimepicker";
import { NavigationHelpersContext } from "@react-navigation/core";
import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { auth } from "../api/firebase";
import { getLoginUser, showMyCarpool } from "../logic/userHandler";
import Carpool from "../model/Carpool";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { subscreen } from "../constants/constants";
import { EmptyChatScrren } from "./EmptyScreen";

export const MyChatScreen = ({ route }) => {
  const navigation = useNavigation();

  const [refreshing, setrefreshing] = useState(false);
  const [carpoolData, setCarpoolData] = useState([]);
  // const [loading, setLoading] = useState(false)
  const [singleRefresh, setSingleRefresh] = useState(false)

  /**
   * This function resets carpool data and force rerendering of the UI
   */
  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      showMyCarpool(subscreen.ongoingTrips)
        .then((data) => {
          setCarpoolData(data)
          setrefreshing(false)
        });

    }, 100);
  };

  if (!singleRefresh) {
    onRefresh()
    setSingleRefresh(true)
  }
  

  useEffect(() => {
    // setLoading(!loading)
    showMyCarpool().then((data) => setCarpoolData(data));
  }, []);

  

  const handleMoreInfoPress = (carpoolWithId) => {
    // Pass carpool id as the chatroom id
    // console.log(id)
    getLoginUser()
      .then(({ userId, userData }) => {
        userData['_id'] = userId
        return userData
      })
      .then((userData) => {
        console.log("user data to be passed to single trip screen")
        console.log(userData)
        navigation.setOptions({title: carpoolWithId.title})
        //navigation.navigate("SingleTripScreen", { carpoolWithId: carpoolWithId, userData: userData })
        navigation.navigate("ChatScreen", { chatIdString: carpoolWithId, userdata: userData })
      })
      .catch(error => console.log(error.message))

  };

  /*

  const LeftSwipeActions = () => {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#f1c40f', justifyContent: 'center' }}
      >
        <Text
          style={{
            color: '#40394a',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          Archive
        </Text>
      </View>
    );
  }


  const RightSwipeActions = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#dc143c',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <Text
          style={{
            color: '#1b1a17',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          Delete
        </Text>
      </View>
    );
  }

  */


  const Separator = () => <View style={styles.itemSeparator} />;


  const swipeFromLeftOpen = () => {
    alert('Swipe from left');
  }

  const swipeFromRightOpen = () => {
    alert('Swipe from right');
  }

  /**
   * This function is called for every item in the flatlist
   * It will create a card for each carpool instance
   * @param {Carpool} item I think it has to be named "item", it represents a carpool instance
   * @returns
   */
  const renderCards = ({ item }) => {
    const subtitle =
      "From: " + item.departureLocation + "\n" + "To: " + item.destination;
    console.log("Document ID:", item);
    if (item)
      return (
        <Card style={styles.cardStyle}>
          <Card.Title
            title={item.title}
            titleStyle={styles.postTitle}
            subtitleNumberOfLines={2}
            subtitle={subtitle}
          />
          {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
          <Card.Actions></Card.Actions>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() =>
              handleMoreInfoPress(item.id)
            }
          >
            
            <Icon name="comments-o" size={35} color="black" />
          </TouchableOpacity>
        </Card>
      );
    else return <></>;
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={carpoolData}
        style={styles.flatListStyle}
        contentContainerStyle={{ alignItems: "stretch" }}
        renderItem={renderCards}
        keyExtractor={(item) => {return item.id}}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => <Separator />}
      ></FlatList>

      {!carpoolData.length && <EmptyChatScrren/>}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexWrap: "wrap",
    marginTop: 15,
  },
  itemSeparator: {
    // borderWidth:
    flex: 1,
    marginVertical: 20,
    height: 1,
    // backgroundColor: 'grey',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  flatListStyle: {
    // flexWrap: "wrap",
    paddingVertical: 10,
    width: "100%",
    minHeight: 150,
    paddingHorizontal: 10,
    marginVertical: 30,
  },
  segmentedButtons: {
    padding: 10,
    margin: 10,
  },
  segButton: {
    backgroundColor: "blue",
  },

  cardStyle: {
    marginVertical: 1,
    // borderColor: "grey",
    // paddingVertical: 10,
    // margin: 20,
    marginHorizontal: 10,
  },
  inputContainer: {
    width: "80%",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  inputTitle: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    fontWeight: "700",
    fontSize: 16,
  },
  postTitle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  inputRowcontainer: {
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    flexWrap: "wrap",
    alignItems: "center",
  },
  inputRowcontainerNoborder: {
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 5,
    flexWrap: "wrap",
    alignItems: "center",
  },
  inputLabel: {
    flex: 1,
  },
  dateTimeDisplay: {
    flex: 1,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },

  buttonContainer: {
    width: "100%",
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 40,
    padding: 10,
    marginHorizontal: 10,
  },
  buttonConfirm: {
    backgroundColor: "#f0e68c",
    alignItems: "center",
    marginBottom: 5,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: "red",
    // borderColor: '#000000',
    // color:"#000000",
    alignItems: "center",
    marginBottom: 5,
    marginHorizontal: 5,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});
