import { Avatar, Button, Card, Text } from 'react-native-paper';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList } from 'react-native'
import { auth, firestore } from '../api/firebase'
// import firestore from 'firebase/firestore';
import Carpool from '../model/Carpool';



const usersCollection = firestore.collection('Users');





export const addCarpool = () => {  
    const carpoolCollection = firestore.collection('Carpools');
    const carpool = new Carpool(
        departureTime=new Date().toLocaleString(), 
        departureLocation="Tech Square", 
        destination="Culc", 
        gtid="123456789", 
        capacity=5
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
        console.log(carpool);
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
