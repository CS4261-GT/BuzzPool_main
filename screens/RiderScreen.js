import {
  Avatar,
  Card,
  Text,
  Checkbox,
  SegmentedButtons,
  Button,
} from "react-native-paper";
import { DateTimePickerModal } from "react-native-paper-datetimepicker";
import {
  NavigationHelpersContext,
  useNavigation,
} from "@react-navigation/core";
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
  convertToCarpool,
  createCarpool,
  getAllCarpools,
  joinCarpool,
  skipCarpool,
} from "../logic/carpoolHandler";
import { auth } from "../api/firebase";
import {
  usersCollection,
  userConverter,
  getLoginUser,
} from "../logic/userHandler";
import * as Calendar from 'expo-calendar';


export const RiderScreen = () => {

  const [refreshing, setrefreshing] = useState(false);
  const [carpoolData, setCarpoolData] = useState();
  const [title, onChangeTitle] = useState("");
  const [departureLocation, onChangeDepartureLocation] = useState("");
  const [destination, onChangeDestination] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [joinTripModalVisible, setjoinTripModalVisible] = useState(false);

  const [reload, setReload] = useState(true);
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const onDateTimePickerDismiss = useCallback(() => {
    setDateTimePickerVisible(false);
  }, [setDateTimePickerVisible]);

  const [isDriver, setIsDriver] = useState(true);
  const [date, setDate] = useState(new Date());
  const [carpool, setCarpool] = useState({})
  const onDateTimeChange = useCallback((newDate) => {
    // console.log(newDate);
    setDateTimePickerVisible(false);
    setDate(newDate);
  }, []);

  // const [value, setValue] = useState("myTrip");

  useEffect(() => {
    setReload(!reload)
    getAllCarpools().then((data) => {
      setCarpoolData(data);
    });
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted')
      {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        // console.log('Here are all your calendars:');
        // console.log({ calendars });
      }
    })();
  }, []);

  async function getDefaultCalendar() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    // console.log(defaultCalendar)
    return defaultCalendar;
  }

  async function createCalendar() {
    const defaultCalendar =
      Platform.OS === 'ios'
        ? await getDefaultCalendar()
        : { isLocalAccount: true, name: 'Expo Calendar' };
    console.log(defaultCalendar.id)
    setDate(carpool.departureTime)
    console.log(date)
    Calendar.createEventAsync(defaultCalendar.id, {
      alarms: [{ relativeOffset: -10 }, { relativeOffset: -30 }],
      location: departureLocation,
      source: defaultCalendar.source,
      allowsModifications: true,
      title: 'Buzzpool: ' + title,
      creationDate: date,
      startDate: date,
      endDate: date,

    })
      .then(() => alert("A calendar event is created on your phone!"))
    // console.log(`Your new calendar ID is: ${newCalendarID}`);
  }


  /**
   * This function resets carpool data and force rerendering of the UI
   */
  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      getAllCarpools()
        .then((data) => {
          setCarpoolData(data)
          setrefreshing(false)
        });

    }, 500);
  };


  /**
   * Rerender the RiderScreen UI by removing the skipped carpool
   * @param {string} carpoolId
   */
  const skipCarpoolUI = (carpoolId) => {
    const newCarpoolArray = skipCarpool(carpoolData, carpoolId);
    setCarpoolData(newCarpoolArray);
  };

  /**
   * Rerender the RiderScreen UI by removing the joined carpool
   * This alsos add data to MyTripScreen UI
   */
  const joinCarpoolUI = async () => {
    const carpoolObject = convertToCarpool(carpool)
    console.log("in joinCarpoolUI")
    console.log(carpool)
    setjoinTripModalVisible(!joinTripModalVisible)
    const tripJoinSuccess = await joinCarpool(carpool, isDriver)
    if (tripJoinSuccess)
      createCalendar()
    // skipCarpoolUI(carpoolData, carpool.id);
  };

  

  /**
   * This function is called for every item in the flatlist
   * It will create a card for each carpool instance
   * @param {CarpoolWithId} item I think it has to be named "item", it represents a carpool instance
   * @returns
   */
  const renderCards = ({ item }) => {
    const remainingSeats = item.capacity - item.userGTIDs.length;
    // I think title is not necessary
    const subtitle =
      "From " + item.departureLocation + "\n" + "To " + item.destination;
    // console.log(item)
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
          <Card.Actions>
            <Button
              style={styles.buttonCancel}
              mode="contained"
              onPress={() => skipCarpoolUI(item.id)}
            >
              Skip
            </Button>
            <Button
              style={styles.buttonConfirm}
              mode="contained"
              onPress={() => {
                setCarpool(item)
                console.log(carpool)
                setjoinTripModalVisible(!joinTripModalVisible)
                
              }}
            >
              Join
            </Button>
          </Card.Actions>
        </Card>
      );
    else return <></>;
  };

  /**
   * This function closes the modal and calls the handler in carpoolHandler.js
   * after checking that the required fields are all filled up
   */
  const makePost = () => {
    setModalVisible(!modalVisible);
    try
    {
      getLoginUser()
        .then(async({ userId, userData }) => {
          console.log(userId, userData)
          const GTIDNumber = userData.GTID
          if (
            title.length == 0 ||
            date == null ||
            date == undefined ||
            departureLocation.length == 0 ||
            destination.length == 0 ||
            isNaN(GTIDNumber)
          )
            throw new Error("invalid post data");

          createCarpool(
            title,
            date.toLocaleString(),
            departureLocation,
            destination,
            !isDriver,
            5,
            GTIDNumber,
            userId,
          ).then(newCarpool => {
            setCarpool(newCarpool)
            createCalendar()
          })

        })
        .catch(e => console.error(e.message))

    } catch (error)
    {
      alert("Incomplete or invalid input!");
    }
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* <SegmentedButtons
        value={value}
        onValueChange={setValue}
        style={styles.segmentedButtons}
        theme={theme}
        buttons={[
          {
            value: 'myTrip',
            label: 'My Trip',
            // TODO: need two themes for the button, one for the unchecked state and another for the checked state
            // checkedColor: 'black',
            // showSelectedCheck:'true'
          },
          {
            value: 'rider',
            label: 'Riders',
            // showSelectedCheck:'true'
          },
          {
            value: 'request',
            label: 'Request',
            // showSelectedCheck:'true'
          },
          {
            value: 'contact',
            label: 'Contacts',
            // showSelectedCheck:'true'
          },

        ]} */}
      {/* <Button onPress={() => } mode='contained' style={styles.buttonConfirm}>Get User</Button> */}
      <Button
        onPress={() => setModalVisible(true)}
        mode="contained"
        style={styles.buttonConfirm}
      >
        Make post
      </Button>

      <FlatList
        data={carpoolData}
        style={styles.flatListStyle}
        contentContainerStyle={{ alignItems: "stretch" }}
        renderItem={renderCards}
        keyExtractor={(item) => { return item.id }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      ></FlatList>

      <Modal
        animationType="slide"
        transparent={true}
        visible={joinTripModalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setjoinTripModalVisible(!joinTripModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>


            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>Driving?</Text>
              <Checkbox
                status={isDriver ? "checked" : "unchecked"}
                color="green"
                onPress={() => setIsDriver(!isDriver)}
              />
            </View>

            <View style={styles.inputRowcontainerNoborder}>
              <Button
                onPress={() => setjoinTripModalVisible(!joinTripModalVisible)}
                mode="contained"
                style={styles.buttonCancel}
              >
                Cancel
              </Button>

              <Button
                onPress={() => joinCarpoolUI(carpool)}
                mode="contained"
                style={styles.buttonConfirm}
              >
                Yes
              </Button>
            </View>
          </View>
        </View>
      </Modal>


      {/* ---------------Modal will be dispalyed below---------------- */}

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
            <TextInput
              style={styles.input}
              onChangeText={onChangeTitle}
              placeholder="Post Title"
              placeholderTextColor="grey"
              value={title}
            />

            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>From:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeDepartureLocation}
                placeholder="departure location"
                placeholderTextColor="grey"
                value={departureLocation}
              />
            </View>

            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>To:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeDestination}
                placeholder="destination"
                placeholderTextColor="grey"
                value={destination}
              />
            </View>

            <View style={styles.inputRowcontainer}>
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
            </View>

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

            <View style={styles.inputRowcontainer}>
              <Text style={styles.inputLabel}>Are you a driver?</Text>
              <Checkbox
                status={isDriver ? "checked" : "unchecked"}
                color="green"
                onPress={() => setIsDriver(!isDriver)}
              />
            </View>

            <View style={styles.inputRowcontainerNoborder}>
              <Button
                onPress={() => setModalVisible(!modalVisible)}
                mode="contained"
                style={styles.buttonCancel}
              >
                Cancel
              </Button>

              <Button
                onPress={makePost}
                mode="contained"
                style={styles.buttonConfirm}
              >
                Post
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
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
    padding: 10,
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
});
