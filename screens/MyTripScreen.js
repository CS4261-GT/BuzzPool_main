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
import {
  carpoolCollection,
  carpoolConverter,
  createCarpool,
  getCarpool,
} from "../logic/carpoolHandler";
import { auth } from "../api/firebase";
import { showMyCarpool } from "../logic/userHandler";
import Carpool from "../model/Carpool";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome'

export const MytripScreen = () => {
  const navigation = useNavigation();

  const [carpoolData, setCarpoolData] = useState();
  const [flatlistRefresh, flipBit] = useState(true);

  const [value, setValue] = useState("myTrip");

  useEffect(() => {
    showMyCarpool().then((data) => setCarpoolData(data));
  }, []);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       navigation.replace("Home")
  //     }
  //   })

  //   return unsubscribe
  // }, [])

  const handleChatPress = (departureLocation, departureTime) => {
    // Pass the departureLocation value to the Chat screen
    console.log(departureLocation);
    console.log(departureTime);
    const combinedString = departureLocation + " " + departureTime;
    navigation.navigate("ChatScreen", { combinedString: combinedString });
  };

  /**
   * This function is called for every item in the flatlist
   * It will create a card for each carpool instance
   * @param {Carpool} item I think it has to be named "item", it represents a carpool instance
   * @returns
   */
  const renderCards = ({ item }) => {
    // console.log(typeof(item))
    const remainingSeats = item.capacity - item.userGTIDs.length;
    // I think title is not necessary
    const subtitle =
      "From " + item.departureLocation + "\n" + "To " + item.destination;
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
          <Card.Content>
            <Text variant="bodyLarge">{item.departureTime}</Text>
            <Text variant="bodyMedium">car capacity: {item.capacity}</Text>
            <Text variant="bodyMedium">Remaining seats: {remainingSeats}</Text>
          </Card.Content>
          {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
          <Card.Actions></Card.Actions>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() =>
              handleChatPress(item.departureLocation, item.departureTime)
            }
          >
            
            <Icon name="comments-o" size={25} color="black" />
          </TouchableOpacity>
        </Card>
      );
    else return <></>;
  };

  /**
   * This function resets carpool data and force rerendering of the UI
   */
  const updateData = () => {
    showMyCarpool().then((data) => setCarpoolData(data));
    // .then(()=>console.log(carpoolData))

    // console.log(carpoolData)
    flipBit(!flatlistRefresh);
    // if (auth.currentUser)
    // console.log(auth.currentUser)
    // console.log(flatlistRefresh)
  };

  const theme = {
    colors: {
      primary: "#3498db",
      accent: "#f1c40f",
      backgroundColor: "red",
      surface: "red",
    },
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Button
        onPress={updateData}
        mode="contained"
        style={styles.buttonConfirm}
      >
        Refresh carpools
      </Button>
      <FlatList
        data={carpoolData}
        style={styles.flatListStyle}
        contentContainerStyle={{ alignItems: "stretch" }}
        renderItem={renderCards}
        keyExtractor={(item) => item.id}
        extraData={flatlistRefresh}
      ></FlatList>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexWrap: "wrap",
    marginTop: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  flatListStyle: {
    // flexWrap: "wrap",
    width: "100%",
    paddingHorizontal: 10,
  },
  segmentedButtons: {
    padding: 10,
    margin: 10,
  },
  segButton: {
    backgroundColor: "blue",
  },

  cardStyle: {
    marginVertical: 10,
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
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  buttonConfirm: {
    backgroundColor: "#0782F9",
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
