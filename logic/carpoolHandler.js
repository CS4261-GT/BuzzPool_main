import { Avatar, Button, Card, Text } from 'react-native-paper';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList } from 'react-native'
import { auth, firestore } from '../api/firebase'
// import firestore from 'firebase/firestore';
import Carpool from '../model/Carpool';



const usersCollection = firestore.collection('Users');
const carpoolCollection = firestore.collection('Carpools');


export const addCarpool = (datetime, from, to, GTID, requireDriver) => {  
    
    const carpool = new Carpool(
        datetime,
        from,
        to, 
        GTID,
        requireDriver,
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


export const getCarpool = async() => {
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
            data.requireDriver,
            data.capacity,
            data.userGTIDs,
            data.isTransactionFinished,
            data.isTripFinished);

        return carpool;
    }
};
