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
  getAllCarpools,
  updateCarpool,
} from "../logic/carpoolHandler";
import { auth } from "../api/firebase";
import { getLoginUser, getAllUsersInCarpool } from "../logic/userHandler";
import Carpool from "../model/Carpool";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const dummy = [
  { firstName: "Joe" },
  { firstName: "Sriram" },
  {},
  {},
  {},
]

export const SingleTripScreen = ({ route }) => {
  const navigation = useNavigation();

  // const [refreshing, setrefreshing] = useState(false);
  const [passengerData, setpassengerData] = useState([]);
  const [driver, setDriver] = useState("No driver available")
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  


  const [value, setValue] = useState("myTrip");

  const { carpoolWithId, userData } = route.params
  const usersIDs = carpoolWithId['userIDs']
  console.log(carpoolWithId)
  useEffect(() => {
    setLoading(!loading)
    getAllUsersInCarpool(usersIDs).then((data) => {

      const newData = data.filter((user) => {
        if (user.GTID != carpoolWithId.driverGTID)
        {
          // console.log("This is a passenger")
          // console.log(user)
          return true
        }
        else
        {
          setDriver(user)
          return false
        }
      })
      setpassengerData(newData)
    });
  }, []);

  const [requestedUserInfo, setRequestedUserInfo] = useState({
    firstName: "",
    lastName: "",
    GTID: "",
    phoneNumber: ""
  })



  console.log("userData in single trip screen")
  console.log(userData)

  const handleChatPress = () => {
    navigation.navigate("ChatScreen", { chatIdString: carpoolWithId.id, userdata: userData })

  };

  const startCarpool = async () => {
    carpoolWithId.tripStatus = "Started"
    await updateCarpool(carpoolWithId)
    setLoading(!loading)
  }

  const finishCarpool = async () => {
    carpoolWithId.tripStatus = "Finished"
    await updateCarpool(carpoolWithId)
    setLoading(!loading)
  }

  const getUserInfo = (user) => {
    console.log("requested info")
    console.log(user)
    setRequestedUserInfo(user)
    setModalVisible(!modalVisible)
  }


  /**
   * This function is called for every item in the flatlist
   * It will create a card for each passenger
   * @param {PassengerWithId} item I think it has to be named "item", it represents a carpool instance
   * @returns
   */
  const renderCards = ({ item }) => {
    console.log(item)
    return (

      <Card
        style={styles.cardStyle}
        onPress={() => getUserInfo(item)}
      >
        <Card.Content>
          <Text variant="bodyLarge">{item.firstName}</Text>
        </Card.Content>
      </Card>



    )
  }

  const remainingSeats = carpoolWithId.capacity - carpoolWithId.userGTIDs.length;
  // I think title is not necessary
  const subtitle =
    "From " + carpoolWithId.departureLocation + "\n" + "To " + carpoolWithId.destination;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={styles.postTitle}
            >
            {requestedUserInfo.firstName} {requestedUserInfo.lastName}
            </Text>
            

            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>GTID: {requestedUserInfo.GTID}</Text>
              {/* <TextInput
                style={styles.input}
                onChangeText={onChangeDepartureLocation}
                placeholder="departure location"
                placeholderTextColor="grey"
                value={departureLocation}
              /> */}
            </View>

            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>Phone Number: {requestedUserInfo.phoneNumber}</Text>
              {/* <TextInput
                style={styles.input}
                onChangeText={onChangeDestination}
                placeholder="destination"
                placeholderTextColor="grey"
                value={destination}
              /> */}
            </View>

            {/* <View style={styles.inputRowcontainer}>
              <DateTimePickerModal
                visible={dateTimePickerVisible}
                onDismiss={onDateTimePickerDismiss}
                date={date}
                onConfirm={onDateTimeChange}
                label="Pick A Date"
                color="black"
              // style={{color:"black"}}
              />

              <Text style={styles.input}>{date.toLocaleString()}</Text>
              <Button
                onPress={() => setDateTimePickerVisible(true)}
                textColor="black"

              >
                Pick date
              </Button>
            </View> */}

            {/* <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>Your GTID:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setRequesterGTID}
                placeholder="123456789"
                placeholderTextColor="grey"
                value={requesterGTID}
              />
            </View> */}

            {/* <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>Are you a driver?</Text>
              <Checkbox
                status={isDriver ? "checked" : "unchecked"}
                color="green"
                onPress={() => setIsDriver(!isDriver)}
              />
            </View> */}

            <View style={styles.inputRowcontainerNoborder}>
              {/* <Button
                onPress={() => setModalVisible(!modalVisible)}
                mode="contained"
                style={styles.buttonCancel}
              >
                Cancel
              </Button> */}

              <Button
                onPress={() => setModalVisible(!modalVisible)}
                mode="contained"
                style={styles.buttonConfirm}
              >
                OK
              </Button>
            </View>
          </View>
        </View>
      </Modal>


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
          <Text variant="bodyLarge" style={{ fontWeight: "700" }}>{carpoolWithId.tripStatus}</Text>
        </Card.Content>

        <Card.Actions>

          <Button
            style={styles.buttonCancel}
            mode="contained"
            onPress={finishCarpool}
          >
            Finish
          </Button>
          <Button
            style={styles.buttonConfirm}
            mode="contained"
            onPress={startCarpool}
          >
            Start
          </Button>
          {/* <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleChatPress}
            >

              <Icon name="comments-o" size={25} color="black" />
            </TouchableOpacity> */}
        </Card.Actions>



      </Card>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleChatPress}
      >


      </TouchableOpacity>

      <Text style={styles.postTitle}>
        Driver
      </Text>


      <Card
        style={styles.cardStyle}
        onPress={() => getUserInfo(driver)}
      >
        <Card.Content>
          <Text variant="bodyLarge">{driver.firstName}</Text>
        </Card.Content>

      </Card>





      <Text style={styles.postTitle}>
        Passengers
      </Text>

      <FlatList
        data={passengerData}
        style={styles.flatListStyle}
        contentContainerStyle={{ alignItems: "stretch", justifyContent: "center", alignContent: "center" }}
        renderItem={renderCards}
        keyExtractor={(item) => { return item.id }}
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
    // borderWidth: 1,
    // borderCurve: "circular",
    // borderRadius: 1
    // margin: 10,
    // justifyContent: "center",
    // marginStart: 10,
    padding: 20,
    paddingVertical: 10,
    width: "100%",
    // paddingHorizontal: 10,
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
    marginTop: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
    // paddingVertical: 10,
    paddingBottom: 10,
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
    // borderWidth: 1,
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
    // flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 40,
    padding: 10,
    marginHorizontal: 10,
  },
  buttonConfirm: {
    backgroundColor: "#1fdf99",
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
