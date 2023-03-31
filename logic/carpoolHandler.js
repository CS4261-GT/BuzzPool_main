import { Avatar, Button, Card, Text } from 'react-native-paper';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList } from 'react-native'
import { auth, firestore } from '../api/firebase'
// import firestore from 'firebase/firestore';
import Carpool from '../model/Carpool';




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
