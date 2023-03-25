import { Avatar, Button, Card, Text } from 'react-native-paper';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList } from 'react-native'
import { auth, firestore } from '../api/firebase'
// import firestore from 'firebase/firestore';
import Carpool from '../model/Carpool';

const DATA = [
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

const usersCollection = firestore.collection('Users');
const carpoolCollection = firestore.collection('Carpools');

const renderCards = ({item}) => {
    return (
        <Card>
            <Card.Title title="Card Title" subtitle="Card Subtitle" />
            <Card.Content>
            <Text variant="titleLarge">{item.title}</Text>
            <Text variant="bodyMedium">Card content</Text>
            </Card.Content>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
            </Card.Actions>
        </Card>
    )
}


const addCarpool = () => {  
    const carpool = new Carpool(new Date().toLocaleString(), "Tech Square", "Culc", "123456789", 5);
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
    // fromFirestore: function(snapshot, options){
    //     const data = snapshot.data(options);
    //     return new City(data.name, data.state, data.country);
    // }
};

const ServiceScreen = () => {

    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')

    // const navigation = useNavigation()

    // useEffect(() => {
    //   const unsubscribe = auth.onAuthStateChanged(user => {
    //     if (user) {
    //       navigation.replace("Home")
    //     }
    //   })
  
    //   return unsubscribe
    // }, [])
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
        <Button onPress={addCarpool}> Add a carpool</Button>
        <FlatList
            data={DATA}
            renderItem={renderCards}
            keyExtractor={item => item.id}
            >

        </FlatList>

        

    </KeyboardAvoidingView>
  )
}

export default ServiceScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    inputContainer: {
        width: '80%'
      },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    button: {
      backgroundColor: '#0782F9',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },
    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#0782F9',
      borderWidth: 2,
    },
    buttonOutlineText: {
      color: '#0782F9',
      fontWeight: '700',
      fontSize: 16,
    },
})