import { Avatar, Button, Card, Text } from 'react-native-paper';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList } from 'react-native'
import { auth, firestore } from '../api/firebase'
// import firestore from 'firebase/firestore';
import Carpool from '../model/Carpool';
import { userConverter, usersCollection, getLoginUser } from './userHandler';




export const carpoolCollection = firestore.collection('Carpools');

/**
 * This function writes a carpool instance to firebase firestore
 * @param {string} title title of the post
 * @param {string} datetime datetime = Date.toLocaleString(), this is the departure time
 * @param {string} from departure location
 * @param {string} to destination
 * @param {number} GTID requester's GTID
 * @param {boolean} requireDriver true if a driver is still needed for the carpool
 */
export const createCarpool = (title, datetime, from, to, requireDriver, capacity, GTID) => {

  const carpool = new Carpool(
    title,
    datetime,
    from,
    to,
    requireDriver,
    capacity,
    [GTID],
  );

  carpoolCollection
    .withConverter(carpoolConverter)
    .add(carpool)
    .then(() => {
      console.log('New carpool added!');
      alert("New carpool added!")
    })
    .catch(error => console.log(error.message));
  // console.log(carpool);

}

/**
 * This class returns all the available carpool instances from firestore
 * @returns Promise<Carpool[]>: all avaialble carpool instances
 */
export const getCarpool = async () => {
  var carpools = [];
  await carpoolCollection
    .withConverter(carpoolConverter)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        var carpool = doc.data();
        carpool['id'] = doc.id;
        carpools.push(carpool);
      });
    })
    // .then(()=>console.log(carpools))
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return carpools
}

/**
 * hide the carpool from user's feed
 * @param {string} carpoolId 
 */
export const skipCarpool = (carpoolData, carpoolId) => {
  // console.log(carpoolId)
  // console.log(carpoolData.length)
  const newCarpoolArray = carpoolData.filter((value) => {
    return value.id != carpoolId
  })
  // console.log(newCarpoolArray.length)
  
  console.log("Carpool skipped")
  return newCarpoolArray
}

/**
 * add the carpool to user's ongoing carpool
 * 1) add carpool id to user's ongoingCarpool and push user data to firestore
 * 2) remove the card from feed
 * 3) update carpool's data and push carpool data to firestore
 * @param {Carpool} carpool 
 * @param {boolean} isDriver
 */
export const joinCarpool = async (carpool, isDriver) => {

  await getLoginUser()
  .then(({userId, userData}) => {
    console.log(userData)
    console.log(carpool)
    // add carpoolId to user
    if (userData.addTripId(carpool.id)) {
      // console.log(user)


      // update user data in firestore
      usersCollection.doc(userId)
      .withConverter(userConverter)
      .set(userData)

      // add user to the carpool instance
      if (carpool.addUser(userData.GTID, isDriver)) {
        // update carpool data in firestore
        console.log("trying to update firestore carpool")
        carpoolCollection.doc(carpool.id)
        .withConverter(carpoolConverter)
        .set(carpool)

        alert("Successfully joined the carpool!")
        
        
      } else {
        alert("Carpool is full or this carpool already has a driver!")
      }
      

    }
    else
      alert("Error in joining the carpool")
  })
  .catch(error => console.log(error.message))
}


/**
 * This object uses the firebase interface of datatype conversion
 * This converts a carpool object to a firestore compatible object upon write
 * and converts a firestore compatible object to a carpool object upon read
 */
export var carpoolConverter = {
  toFirestore: function (carpool) {
    // data fields for reference

    // this.departureTime = departureTime
    // this.departureLocation = departureLocation
    // this.destination = destination
    // this.capacity = capacity
    // this.requireDriver = true
    // this.userGTIDs = [gtid]
    // this.isTransactionFinished = false
    // this.isTripFinished = false
    // console.log(carpool);

    console.log("Carpool to firebase")
    console.log(carpool)
    return {
      title: carpool.title,
      departureTime: carpool.departureTime,
      departureLocation: carpool.departureLocation,
      destination: carpool.destination,
      requireDriver: carpool.requireDriver,
      capacity: carpool.capacity,
      userGTIDs: carpool.userGTIDs,
      isTransactionFinished: carpool.isTransactionFinished,
      isTripFinished: carpool.isTripFinished,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    // title, 
    // departureTime, 
    // departureLocation, 
    // destination, 
    // requireDriver = true, 
    // capacity = 5, 
    // userGTIDs = [],
    // isTransactionFinished = false, 
    // isTripFinished = false

    console.log("Carpool from firebase")
    console.log(data)

    var carpool = new Carpool(
      data.title,
      data.departureTime,
      data.departureLocation,
      data.destination,
      data.requireDriver,
      data.capacity,
      data.userGTIDs,
      data.isTransactionFinished,
      data.isTripFinished);

    return carpool;
  }
};
