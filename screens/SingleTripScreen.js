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
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { updateCarpool } from "../logic/carpoolHandler";
import { auth, firestore } from "../api/firebase";
import { getLoginUser, getAllUsersInCarpool } from "../logic/userHandler";
import Carpool from "../model/Carpool";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/FontAwesome";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { subscreen, tripStatus } from "../constants/constants";

export const SingleTripScreen = ({ route }) => {
  const navigation = useNavigation();

  // const [refreshing, setrefreshing] = useState(false);
  const [passengerData, setpassengerData] = useState([]);
  const [driver, setDriver] = useState("No driver available");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [startTripVisible, setstartTripVisible] = useState(false);

  const [reportUser, setReportUser] = useState(false);
  const [message, setMessage] = useState("");

  const [carpoolTitle, setCarpoolTitle] = useState("");
  const [reportedEmail, setReportedEmail] = useState("");
  const [reportedFirst, setReportedFirst] = useState("");
  const [reportedLast, setReportedLast] = useState("");
  const [reportedGTID, setReportedGTID] = useState("");

  const [value, setValue] = useState("myTrip");

  const { carpoolWithId, userData, from } = route.params;
  const tripStatusVisible = from == "MyTripScreen" + subscreen.ongoingTrips;
  console.log(from);
  const usersIDs = carpoolWithId.userIDs;
  console.log(carpoolWithId);
  useEffect(() => {
    setLoading(!loading);
    getAllUsersInCarpool(usersIDs).then((data) => {
      const newData = data.filter((user) => {
        if (user.GTID != carpoolWithId.driverGTID) {
          console.log("This is a passenger");
          console.log(user);
          return true;
        } else {
          setDriver(user);
          console.log("driver:");
          console.log(user);
          setLoading(!loading);
          return false;
        }
      });
      // console.log("passenger data")
      // console.log(newData)
      setpassengerData(newData);
    });
  }, []);
  console.log(driver);

  const [requestedUserInfo, setRequestedUserInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    GTID: "",
    phoneNumber: "",
  });

  const sendReportMessage = async () => {
    try {
      // Add document to Firestore
      await firestore.collection("Reports").add({
        email: reportedEmail, // Replace with the actual data you want to store
        first: reportedFirst,
        last: reportedLast,
        GTID: reportedGTID,
        message: message,
        carpoolTitle: carpoolTitle,
      });

      setReportedEmail("");
      setReportedFirst("");
      setReportedLast("");
      setReportedGTID("");
      setMessage("");
      console.log("Document added successfully!");
      alert("Thank you for your report");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // console.log("userData in single trip screen")
  // console.log(userData)

  const handleChatPress = () => {
    navigation.navigate("ChatScreen", {
      chatIdString: carpoolWithId.id,
      userdata: userData,
    });
  };

  const startCarpool = async () => {
    carpoolWithId.tripStatus = tripStatus.Started;
    await updateCarpool(carpoolWithId);
    setLoading(!loading);
  };

  const finishCarpool = async () => {
    if (carpoolWithId.tripStatus != tripStatus.Started) {
      alert("You can only finish a carpool after it is started!");
      return;
    }
    carpoolWithId.tripStatus = tripStatus.Finished;
    await updateCarpool(carpoolWithId);
    setLoading(!loading);
  };

  const getUserInfo = (user) => {
    console.log("requested info");
    console.log(user);
    setRequestedUserInfo(user);
    setModalVisible(!modalVisible);
  };

  const report = () => {
    setReportUser(true);
  };

  const handleChangeText = (text) => {
    setMessage(text);
  };

  /**
   * This function is called for every item in the flatlist
   * It will create a card for each passenger
   * @param {PassengerWithId} item I think it has to be named "item", it represents a carpool instance
   * @returns
   */
  const renderCards = ({ item }) => {
    console.log(item);
    return (
      <Card style={styles.cardStyle} onPress={() => getUserInfo(item)}>
        <Card.Content>
          <Text variant="bodyLarge">{item.firstName}</Text>
        </Card.Content>
      </Card>
    );
  };

  const remainingSeats =
    carpoolWithId.capacity - carpoolWithId.userGTIDs.length;
  // I think title is not necessary
  const subtitle =
    "From " +
    carpoolWithId.departureLocation +
    "\n" +
    "To " +
    carpoolWithId.destination;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
          setReportUser("False");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.postTitle}>
              {requestedUserInfo.firstName} {requestedUserInfo.lastName}
            </Text>

            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>
                GTID: {requestedUserInfo.GTID}
              </Text>
            </View>

            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>
                Phone Number: {requestedUserInfo.phoneNumber}
              </Text>
            </View>

            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>
                Email: {requestedUserInfo.email}
              </Text>
            </View>

            <View style={styles.inputRowcontainerNoborder}>
              <Button
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setReportUser(false);
                  setMessage("");
                }}
                mode="contained"
                style={styles.buttonConfirm}
              >
                OK
              </Button>

              {tripStatusVisible && (
                <Button
                  onPress={() => {
                    report();
                    setReportedEmail(requestedUserInfo.email);
                    setReportedFirst(requestedUserInfo.firstName);
                    setReportedLast(requestedUserInfo.lastName);
                    setReportedGTID(requestedUserInfo.GTID);
                    setCarpoolTitle(carpoolWithId.title);
                  }}
                  mode="contained"
                  style={styles.buttonReport}
                >
                  Report
                </Button>
              )}
            </View>

            {reportUser &&(
              <>
                <KeyboardAvoidingView>
                  <View style={styles.reportMessage}>
                    <TextInput
                      style={[styles.message, { height: 100, width: 200 }]} // Set height and width here
                      placeholder="Message"
                      value={message}
                      onChangeText={handleChangeText}
                      maxLength={100} // Maximum length of 100 characters
                      multiline // Allow multiple lines of input
                      numberOfLines={3} // Display 3 lines of input initially
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                  <Button
                    onPress={() => {
                      sendReportMessage();
                      setModalVisible(!modalVisible);
                      setReportUser(false);
                    }}
                    mode="contained"
                    style={styles.buttonReport}
                  >
                    Send Message
                  </Button>
                </KeyboardAvoidingView>
              </>
            )}
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
          <Text variant="bodyLarge">
            {carpoolWithId.departureTime.toLocaleString()}
          </Text>
          <Text variant="bodyMedium">
            car capacity: {carpoolWithId.capacity}
          </Text>
          <Text variant="bodyMedium">Remaining seats: {remainingSeats}</Text>
          <Text variant="bodyLarge" style={{ fontWeight: "700" }}>
            {carpoolWithId.tripStatus}
          </Text>
        </Card.Content>

        <Card.Actions>
          {tripStatusVisible && (
            <Button
              style={styles.buttonCancel}
              mode="contained"
              onPress={finishCarpool}
            >
              Finish
            </Button>
          )}

          {tripStatusVisible && (
            <Button
              style={styles.buttonConfirm}
              mode="contained"
              onPress={() => {
                if (carpoolWithId.tripStatus != tripStatus.NotStarted) {
                  alert("You cannot start a carpool when it is finished!");
                  return;
                }
                setstartTripVisible(true);
              }}
            >
              Start
            </Button>
          )}
        </Card.Actions>
      </Card>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleChatPress}
      ></TouchableOpacity>

      <Text style={styles.postTitle}>Driver</Text>

      <Card style={styles.cardStyle} onPress={() => getUserInfo(driver)}>
        <Card.Content>
          <Text variant="bodyLarge">{driver.firstName}</Text>
        </Card.Content>
      </Card>

      <Text style={styles.postTitle}>Passengers</Text>

      <FlatList
        data={passengerData}
        style={styles.flatListStyle}
        contentContainerStyle={{
          alignItems: "stretch",
          justifyContent: "center",
          alignContent: "center",
        }}
        renderItem={renderCards}
        keyExtractor={(item) => {
          return item.GTID;
        }}
        // ItemSeparatorComponent={() => <Separator />}
      ></FlatList>

      <Modal
        animationType="slide"
        transparent={true}
        visible={startTripVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setstartTripVisible(!startTripVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Warning</Text>

            <View style={styles.inputRowcontainerNoborder}>
              <Text style={styles.modalText}>
                You cannot leave the carpool once you start it! Do you want to
                proceed?
              </Text>
            </View>

            <View style={styles.inputRowcontainerNoborder}>
              <Button
                onPress={() => setstartTripVisible(!startTripVisible)}
                mode="contained"
                style={styles.buttonCancel}
              >
                Cancel
              </Button>

              <Button
                onPress={() => {
                  setstartTripVisible(false);
                  startCarpool();
                }}
                mode="contained"
                style={styles.buttonConfirm}
              >
                Yes
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "grey",
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
  title: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    fontWeight: "500",
    fontSize: 20,
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
  buttonReport: {
    backgroundColor: "#FF0000",
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
  reportMessage: {
    marginVertical: 10,
  },
  message: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlignVertical: "top", // Align text at the top of the input field
  },
});
