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
import { archiveTrip, getLoginUser, showMyCarpool } from "../logic/userHandler";
import Carpool from "../model/Carpool";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';


export const MytripScreen = () => {
  const navigation = useNavigation();

  const [refreshing, setrefreshing] = useState(false);
  const [carpoolData, setCarpoolData] = useState([]);

  const [value, setValue] = useState("myTrip");
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})

  useEffect(() => {
    setLoading(!loading)
    showMyCarpool().then((data) => setCarpoolData(data));
  }, []);


  /**
   * This function resets carpool data and force rerendering of the UI
   */
  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      showMyCarpool()
        .then((data) => {
          setCarpoolData(data)
          setrefreshing(false)
        });

    }, 500);
  };

  const handleMoreInfoPress = (carpoolWithId) => {
    // Pass carpool id as the chatroom id
    // console.log(id)
    getLoginUser()
      .then(({ userId, userData }) => {
        userData['_id'] = userId
        return userData
      })
      .then((userData) => {
        // console.log("user data to be passed to single trip screen")
        // console.log(userData)
        navigation.setOptions({title: carpoolWithId.title})
        navigation.navigate("SingleTripScreen", { carpoolWithId: carpoolWithId, userData: userData, from: "MyTripScreen" })
        // navigation.navigate("ChatScreen", { chatIdString: id, userdata: userdata })
      })
      .catch(error => console.log(error.message))

  };

  // const handleMoreInfoPress = (id) => {
  //   // Pass carpool id as the chatroom id
  //   console.log(id)
  //   getLoginUser()
  //     .then(({ userId, userData }) => {
  //       return { _id: userId, name: userData.firstName }

  //     })
  //     .then((userdata) => {
  //       console.log(userdata)
  //       navigation.navigate("ChatScreen", { chatIdString: id, userdata: userdata })
  //     })
  //     .catch(error => console.log(error.message))

  // };

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


  const Separator = () => <View style={styles.itemSeparator} />;


  const swipeFromLeftOpen = (carpoolWithId) => {
    // alert('Swipe from left');
    
    getLoginUser()
      .then(({ userId, userData }) => {
        userData['_id'] = userId
        return userData
      })
      .then((userData) => {
        archiveTrip(userData, carpoolWithId)
        .then(() => {
          setLoading(!loading)
        })
      })
      .catch(error => console.log(error.message))
    
  }

  const swipeFromRightOpen = () => {
    alert('Swipe from right');
  }

  /**
   * This function is called for every item in the flatlist
   * It will create a card for each carpool instance
   * @param {CarpoolWithId} item I think it has to be named "item", it represents a carpool instance
   * @returns
   */
  const renderCards = ({ item }) => {
    // console.log(typeof(item))
    const remainingSeats = item.capacity - item.userGTIDs.length;
    // I think title is not necessary
    const subtitle =
      "From: " + item.departureLocation + "\n" + "To: " + item.destination;
    // console.log("Document ID:", item);

    // console.log(item)
    return (
      <Swipeable
        renderLeftActions={LeftSwipeActions}
        onSwipeableLeftOpen={() => swipeFromLeftOpen(item)}
        renderRightActions={RightSwipeActions}
        onSwipeableRightOpen={swipeFromRightOpen}
      >
        <Card style={styles.cardStyle}>
           <Card.Title
            title={item.title}
            titleStyle={styles.postTitle}
            subtitleNumberOfLines={2}
            subtitle={subtitle}
          />
          
          <Card.Content>
            <Text variant="bodyLarge">{item.departureTime.toLocaleString()}</Text>
            <Text variant="bodyMedium">car capacity: {item.capacity}</Text>
            <Text variant="bodyMedium">Remaining seats: {remainingSeats}</Text>
            <Text variant="bodyLarge" style={{fontWeight:"700"}}>{item.tripStatus}</Text>
          </Card.Content>
          {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}

          <Card.Actions>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => { handleMoreInfoPress(item) }
              }
            >

              <Icon name="ellipsis-v" size={25} color="black" />
            </TouchableOpacity>
          </Card.Actions>
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
      </Swipeable>
    )
  }

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
