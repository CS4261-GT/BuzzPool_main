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
import { getLoginUser, showMyCarpool } from "../logic/userHandler";
import Carpool from "../model/Carpool";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const dummy = [
  {firstName: "Joe"}, 
  {firstName: "Sriram"},
]

export const SingleTripScreen = ({ route }) => {
  const navigation = useNavigation();

  // const [refreshing, setrefreshing] = useState(false);
  const [passengerData, setpassengerData] = useState(dummy);

  const [value, setValue] = useState("myTrip");

  const { carpoolWithId, userData } = route.params


  console.log("userData in single trip screen")
  console.log(userData)

  const handleChatPress = () => {
    navigation.navigate("ChatScreen", { chatIdString: carpoolWithId.id, userdata: userData })
     
  };


  /**
   * This function is called for every item in the flatlist
   * It will create a card for each passenger
   * @param {PassengerWithId} item I think it has to be named "item", it represents a carpool instance
   * @returns
   */
  const renderCards = ({ item }) => {
   
    return (
      <Card style={styles.cardStyle}>
        {/* <Card.Title
          title={item.title}
          titleStyle={styles.postTitle}
          subtitleNumberOfLines={2}
          subtitle={subtitle}
        /> */}
        <Card.Content>
          <Text variant="bodyLarge">{item.firstName}</Text>
          {/* <Text variant="bodyMedium">car capacity: {item.capacity}</Text>
          <Text variant="bodyMedium">Remaining seats: {remainingSeats}</Text> */}
        </Card.Content>
        {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}

        {/* <Card.Actions>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() =>
                handleChatPress(item.id)
              }
            >

              <Icon name="comments-o" size={25} color="black" />
            </TouchableOpacity>
        </Card.Actions> */}
        {/* <View
          // style={styles.buttonContainer}
          > */}
        {/* <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() =>
                handleChatPress(item.id)
              }
            >

              <Icon name="comments-o" size={25} color="black" />
            </TouchableOpacity> */}


        {/* </View> */}




      </Card>
    )
  }

  const remainingSeats = carpoolWithId.capacity - carpoolWithId.userGTIDs.length;
    // I think title is not necessary
    const subtitle =
      "From " + carpoolWithId.departureLocation + "\n" + "To " + carpoolWithId.destination;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Card style={styles.cardStyle}>
        <Card.Title
          title={carpoolWithId.title}
          titleStyle={styles.postTitle}
          subtitleNumberOfLines={2}
          subtitle={subtitle}
        />
        <Card.Content>
          <Text variant="bodyLarge">{carpoolWithId.departureTime}</Text>
          <Text variant="bodyMedium">car capacity: {carpoolWithId.capacity}</Text>
          <Text variant="bodyMedium">Remaining seats: {remainingSeats}</Text>
        </Card.Content>

        <Card.Actions>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleChatPress}
            >

              <Icon name="comments-o" size={25} color="black" />
            </TouchableOpacity>
        </Card.Actions>
  


      </Card>

      <Text style={styles.postTitle}>
        Passengers
      </Text>

      <FlatList
        data={passengerData}
        style={styles.flatListStyle}
        contentContainerStyle={{ alignItems: "stretch" }}
        renderItem={renderCards}
        keyExtractor={(item) => item.id}
      // ItemSeparatorComponent={() => <Separator />}
      ></FlatList>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexWrap: "wrap",
    marginTop: 15,
  },
  itemSeparator: {
    flex: 1,
    marginVertical: 10,
    height: 1,
    backgroundColor: 'grey',
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
    width: "90%",
    // marginVertical: 10,
    borderColor: "grey",
    // paddingVertical: 10,
    margin: 20,
    
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
