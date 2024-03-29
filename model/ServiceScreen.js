// import {
//   Avatar,
//   Card,
//   Text,
//   Checkbox,
//   SegmentedButtons,
//   Button,
// } from "react-native-paper";
// import { DateTimePickerModal } from "react-native-paper-datetimepicker";
// import {
//   NavigationHelpersContext,
//   useNavigation,
// } from "@react-navigation/core";
// import React, { useRef, useState, useCallback } from "react";
// import {
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   KeyboardAvoidingView,
//   TextInput,
//   FlatList,
//   Modal,
// } from "react-native";
// import { createCarpool, getAllCarpools } from "../logic/carpoolHandler";
// import { auth } from "../api/firebase";
// import { usersCollection, userConverter } from "../logic/userHandler";

// const ServiceScreen = () => {
//   const [carpoolData, setCarpoolData] = useState();
//   const [title, onChangeTitle] = useState("");
//   const [departureLocation, onChangeDepartureLocation] = useState("");
//   const [destination, onChangeDestination] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [flatlistRefresh, flipBit] = useState(true);
//   const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
//   const onDateTimePickerDismiss = useCallback(() => {
//     setDateTimePickerVisible(false);
//   }, [setDateTimePickerVisible]);
//   const [requesterGTID, setRequesterGTID] = useState("");
//   const [isDriver, setIsDriver] = useState(true);
//   const [date, setDate] = useState(new Date());
//   const onDateTimeChange = useCallback((newDate) => {
//     // console.log(newDate);
//     setDateTimePickerVisible(false);
//     setDate(newDate);
//   }, []);

//   const [value, setValue] = useState("myTrip");

//   // useEffect(() => {
//   //   const unsubscribe = auth.onAuthStateChanged(user => {
//   //     if (user) {
//   //       navigation.replace("Home")
//   //     }
//   //   })

//   //   return unsubscribe
//   // }, [])

//   /**
//    * hide the carpool from user's feed
//    * @param {string} carpoolId
//    */
//   const skipCarpool = (carpoolId) => {
//     // console.log(carpoolId)
//     // console.log(carpoolData.length)
//     const newCarpoolArray = carpoolData.filter((value) => {
//       return value.id != carpoolId;
//     });
//     // console.log(newCarpoolArray.length)
//     setCarpoolData(newCarpoolArray);
//     flipBit(!flatlistRefresh);
//     console.log("pressed");
//   };

//   /**
//    * add the carpool to user's ongoing carpool
//    * 1) add carpool id to user's ongoingCarpool
//    * 2) remove the card from feed
//    * @param {string} email
//    * @param {string} carpoolId
//    */
//   const joinCarpool = (carpoolId) => {
//     // find the user from firebase, call User.addTripId(carpoolId)
//     const email = auth.currentUser.email;
//     console.log(email, carpoolId);
//     // console.log(usersCollection)
//     usersCollection
//       .where("email", "==", email)
//       .withConverter(userConverter)
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           // doc.data() is never undefined for query doc snapshots
//           const user = doc.data();
//           const docId = doc.id;
//           // console.log(user)
//           if (user.addTripId(carpoolId)) {
//             // console.log(user)
//             usersCollection.doc(docId).withConverter(userConverter).set(user);

//             alert("Successfully joined the carpool!");
//           }

//           // else
//           //   alert("Error in joining the carpool")
//           skipCarpool(carpoolId);
//         });
//       })
//       .catch((error) => {
//         console.log("Error getting documents: ", error);
//       });
//   };

//   /**
//    * This function is called for every item in the flatlist
//    * It will create a card for each carpool instance
//    * @param {Carpool} item I think it has to be named "item", it represents a carpool instance
//    * @returns
//    */
//   const renderCards = ({ item }) => {
//     // console.log(typeof(item))
//     const remainingSeats = item.capacity - item.userGTIDs.length;
//     // I think title is not necessary
//     const subtitle =
//       "From " + item.departureLocation + "\n" + "To " + item.destination;
//     if (item)
//       return (
//         <Card style={styles.cardStyle}>
//           <Card.Title
//             title={item.title}
//             titleStyle={styles.postTitle}
//             subtitleNumberOfLines={2}
//             subtitle={subtitle}
//           />
//           <Card.Content>
//             <Text variant="bodyLarge">{item.departureTime}</Text>
//             <Text variant="bodyMedium">car capacity: {item.capacity}</Text>
//             <Text variant="bodyMedium">Remaining seats: {remainingSeats}</Text>
//           </Card.Content>
//           {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
//           <Card.Actions>
//             <Button
//               style={styles.buttonCancel}
//               mode="contained"
//               onPress={() => skipCarpool(item.id)}
//             >
//               Skip
//             </Button>
//             <Button
//               style={styles.buttonConfirm}
//               mode="contained"
//               onPress={() => joinCarpool(item.id)}
//             >
//               Join
//             </Button>
//           </Card.Actions>
//         </Card>
//       );
//     else return <></>;
//   };

//   /**
//    * This function closes the modal and calls the handler in carpoolHandler.js
//    * after checking that the required fields are all filled up
//    */
//   const makePost = () => {
//     setModalVisible(!modalVisible);
//     try {
//       const GTIDNumber = Number(requesterGTID);
//       if (
//         title.length == 0 ||
//         date == null ||
//         date == undefined ||
//         departureLocation.length == 0 ||
//         destination.length == 0 ||
//         requesterGTID.length != 9 ||
//         isNaN(GTIDNumber)
//       )
//         throw new Error();

//       createCarpool(
//         title,
//         date.toLocaleString(),
//         departureLocation,
//         destination,
//         GTIDNumber,
//         !isDriver
//       );
//     } catch (error) {
//       alert("Incomplete or invalid input!");
//     }
//   };

//   /**
//    * This function resets carpool data and force rerendering of the UI
//    */
//   const updateData = () => {
//     getAllCarpools().then((data) => setCarpoolData(data));
//     // .then(()=>console.log(carpoolData))

//     // console.log(carpoolData)
//     flipBit(!flatlistRefresh);
//     if (auth.currentUser) console.log(auth.currentUser);
//     // console.log(flatlistRefresh)
//   };

//   const theme = {
//     colors: {
//       primary: "#3498db",
//       accent: "#f1c40f",
//       backgroundColor: "red",
//       surface: "red",
//     },
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior="padding">
//       <SegmentedButtons
//         value={value}
//         onValueChange={setValue}
//         style={styles.segmentedButtons}
//         theme={theme}
//         buttons={[
//           {
//             value: "myTrip",
//             label: "My Trip",
//             // TODO: need two themes for the button, one for the unchecked state and another for the checked state
//             // checkedColor: 'black',
//             // showSelectedCheck:'true'
//           },
//           {
//             value: "rider",
//             label: "Riders",
//             // showSelectedCheck:'true'
//           },
//           {
//             value: "request",
//             label: "Request",
//             // showSelectedCheck:'true'
//           },
//           {
//             value: "contact",
//             label: "Contacts",
//             // showSelectedCheck:'true'
//           },
//         ]}
//       />
//       <Button
//         onPress={() => setModalVisible(true)}
//         mode="contained"
//         style={styles.buttonConfirm}
//       >
//         Make post
//       </Button>

//       <Button
//         onPress={updateData}
//         mode="contained"
//         style={styles.buttonConfirm}
//       >
//         Refresh carpools
//       </Button>
//       <FlatList
//         data={carpoolData}
//         style={styles.flatListStyle}
//         contentContainerStyle={{ alignItems: "stretch" }}
//         renderItem={renderCards}
//         keyExtractor={(item) => item.id}
//         extraData={flatlistRefresh}
//       ></FlatList>

//       {/* ---------------Modal will be dispalyed below---------------- */}

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           // Alert.alert('Modal has been closed.');
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <TextInput
//               style={styles.input}
//               onChangeText={onChangeTitle}
//               placeholder="Post Title"
//               placeholderTextColor="grey"
//               value={title}
//             />

//             <View style={styles.inputRowcontainer}>
//               <Text style={styles.inputLabel}>From:</Text>
//               <TextInput
//                 style={styles.input}
//                 onChangeText={onChangeDepartureLocation}
//                 placeholder="departure location"
//                 placeholderTextColor="grey"
//                 value={departureLocation}
//               />
//             </View>

//             <View style={styles.inputRowcontainer}>
//               <Text style={styles.inputLabel}>To:</Text>
//               <TextInput
//                 style={styles.input}
//                 onChangeText={onChangeDestination}
//                 placeholder="destination"
//                 placeholderTextColor="grey"
//                 value={destination}
//               />
//             </View>

//             <View style={styles.inputRowcontainer}>
//               <DateTimePickerModal
//                 visible={dateTimePickerVisible}
//                 onDismiss={onDateTimePickerDismiss}
//                 date={date}
//                 onConfirm={onDateTimeChange}
//                 label="Pick A Date"
//               />

//               <Text style={styles.input}>{date.toLocaleString()}</Text>
//               <Button onPress={() => setDateTimePickerVisible(true)}>
//                 Pick date
//               </Button>
//             </View>

//             <View style={styles.inputRowcontainer}>
//               <Text style={styles.inputLabel}>Your GTID:</Text>
//               <TextInput
//                 style={styles.input}
//                 onChangeText={setRequesterGTID}
//                 placeholder="123456789"
//                 placeholderTextColor="grey"
//                 value={requesterGTID}
//               />
//             </View>

//             <View style={styles.inputRowcontainer}>
//               <Text style={styles.inputLabel}>Are you a driver?</Text>
//               <Checkbox
//                 status={isDriver ? "checked" : "unchecked"}
//                 color="green"
//                 onPress={() => setIsDriver(!isDriver)}
//               />
//             </View>

//             <View style={styles.inputRowcontainerNoborder}>
//               <Button
//                 onPress={() => setModalVisible(!modalVisible)}
//                 mode="contained"
//                 style={styles.buttonCancel}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 onPress={makePost}
//                 mode="contained"
//                 style={styles.buttonConfirm}
//               >
//                 Post
//               </Button>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// };

// export default ServiceScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     alignContent: "center",
//     flexWrap: "wrap",
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22,
//   },
//   flatListStyle: {
//     // flexWrap: "wrap",
//     width: "100%",
//     paddingHorizontal: 10,
//   },
//   segmentedButtons: {
//     padding: 10,
//     margin: 10,
//   },
//   segButton: {
//     backgroundColor: "blue",
//   },

//   cardStyle: {
//     marginVertical: 10,
//     marginHorizontal: 10,
//   },
//   inputContainer: {
//     width: "80%",
//   },

//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   inputTitle: {
//     backgroundColor: "white",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginTop: 5,
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   postTitle: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginTop: 5,
//     textAlign: "center",
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   inputRowcontainer: {
//     flexDirection: "row",
//     marginVertical: 5,
//     paddingHorizontal: 5,
//     borderWidth: 1,
//     flexWrap: "wrap",
//     alignItems: "center",
//   },
//   inputRowcontainerNoborder: {
//     flexDirection: "row",
//     marginVertical: 5,
//     paddingHorizontal: 5,
//     flexWrap: "wrap",
//     alignItems: "center",
//   },
//   inputLabel: {
//     flex: 1,
//   },
//   dateTimeDisplay: {
//     flex: 1,
//   },
//   input: {
//     backgroundColor: "white",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginTop: 5,
//   },

//   buttonContainer: {
//     width: "60%",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 40,
//   },
//   buttonConfirm: {
//     backgroundColor: "#0782F9",
//     alignItems: "center",
//     marginBottom: 5,
//     marginHorizontal: 5,
//   },
//   buttonCancel: {
//     backgroundColor: "red",
//     // borderColor: '#000000',
//     // color:"#000000",
//     alignItems: "center",
//     marginBottom: 5,
//     marginHorizontal: 5,
//   },
//   buttonOutline: {
//     backgroundColor: "white",
//     marginTop: 5,
//     borderColor: "#0782F9",
//     borderWidth: 2,
//   },
//   buttonOutlineText: {
//     color: "#0782F9",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });
