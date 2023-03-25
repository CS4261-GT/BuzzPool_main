import { Avatar, Button, Card, Text } from 'react-native-paper';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList } from 'react-native'
import { auth, firestore } from '../api/firebase'
// import firestore from 'firebase/firestore';
import Carpool from '../model/Carpool';



const usersCollection = firestore.collection('Users');
const carpoolCollection = firestore.collection('Carpools');


export const addCarpool = () => {  
    
    const carpool = new Carpool(
        new Date().toLocaleString(), 
        "Tech Square", 
        "Culc", 
        "123456789", 
        5
    );
    
    carpoolCollection
        .withConverter(carpoolConverter)
        .add(carpool)
        .then(() => {
            console.log('New carpool added!');
        })
        .catch( error => console.log(error.message));
    // console.log(carpool);
    
}

export var DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
];
export const getCarpool = () => {
    var carpools = [];
    carpoolCollection
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
        .then(()=>console.log(carpools))
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    DATA = carpools;
    return carpools
}

var carpoolConverter = {
    toFirestore: function(carpool) {
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
            departureTime: carpool.departureTime,
            departureLocation: carpool.departureLocation,
            destination: carpool.destination,
            userGTIDs: carpool.userGTIDs,
            capacity: carpool.capacity,
            requireDriver: carpool.requireDriver,
            isTransactionFinished: carpool.isTransactionFinished,
            isTripFinished: carpool.isTripFinished,
            };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        
        var carpool = new Carpool(
            data.departureTime,
            data.departureLocation,
            data.destination,
            data.capacity,
            data.requireDriver,
            data.userGTIDs,
            data.isTransactionFinished,
            data.isTripFinished);

        return carpool;
    }
};
