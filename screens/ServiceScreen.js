import { Avatar, Button, Card, Text } from 'react-native-paper';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList } from 'react-native'
import { addCarpool, getCarpool } from '../logic/carpoolHandler'



const renderCards = ({item}) => {
    console.log(item)
    // if (carpool)
        return (
            <Card>
                <Card.Title title={"To " + item.destination} subtitle= {"from " + item.departureLocation} />
                <Card.Content>
                    <Text variant="titleLarge">{item.departureTime}</Text>
                    <Text variant="bodyMedium">car capacity: {item.capacity}</Text>
                    <Text variant="bodyMedium">Remaining seats: {item.capacity}</Text>
                </Card.Content>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Actions>
                <Button>Skip</Button>
                <Button>Join</Button>
                </Card.Actions>
            </Card>
        )
    // else
    //     return <></>
} 

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

const ServiceScreen = () => {

    const [carpoolData, setCarpoolData] = useState(getCarpool())
    const [flatlistRefresh, flipBit] = useState(true)
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

    const updateData = () => {
        getCarpool()
        .then((data) => setCarpoolData(data))
        // .then(()=>console.log(carpoolData))
        
        // console.log(carpoolData)
        flipBit(!flatlistRefresh)
        console.log(flatlistRefresh)
    } 
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
        <Button onPress={addCarpool}>Add a carpool</Button>
        <Button onPress={updateData}>Refresh carpools</Button>
        <FlatList
            data={carpoolData}
            renderItem={renderCards}
            keyExtractor={item => item.id}
            extraData={flatlistRefresh}
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