import { Avatar, Button, Card, Text } from 'react-native-paper';
import { DateTimePickerModal } from 'react-native-paper-datetimepicker';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList, Modal, Pressable } from 'react-native'
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

const makePost = () => {
    
}

const ServiceScreen = () => {

    const [carpoolData, setCarpoolData] = useState(getCarpool())
    const [title, onChangeTitle] = useState("Title")
    const [departureLocation, onChangeDepartureLocation] = useState("From")
    const [destination, onChangeDestination] = useState("to")
    const [modalVisible, setModalVisible] = useState(false)
    const [flatlistRefresh, flipBit] = useState(true)

    const [visible, setVisible] = React.useState(false);
    const onDateTimePickerDismiss = React.useCallback(() => {
        setVisible(false);
    }, [setVisible]);
    const [date, setDate] = useState(new Date());
    const onDateTimeChange = React.useCallback(( newDate ) => {
        console.log(newDate);
        setVisible(false);
        // date = newDate;
        
        setDate(newDate);
      }, []);
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
        // console.log(flatlistRefresh)
    } 
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
        <Button onPress={addCarpool}>Add a carpool</Button>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <TextInput
                    style={styles.input}
                    onChangeText={onChangeTitle}
                    value={title}
                />
            {/* <View
                style={styles.inputRowcontainer}>
                
                <Text style={styles.inputLabel}>Title:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeTitle}
                    value={title}
                />
            </View> */}

            <View
                style={styles.inputRowcontainer}>
                
                <Text style={styles.inputLabel}>From:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeDepartureLocation}
                    value={departureLocation}
                />
            </View>

            <View
                style={styles.inputRowcontainer}>
                
                <Text style={styles.inputLabel}>To:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeDestination}
                    value={destination}
                />
            </View>

            
            <View
                style={styles.inputRowcontainer}>
                
                <DateTimePickerModal
                    visible={visible}
                    onDismiss={onDateTimePickerDismiss}
                    date={date}
                    onConfirm={onDateTimeChange}
                    label="Pick A Date"
                />

                <Text style={styles.input}>{date.toLocaleString()}</Text>
                <Button onPress={() => setVisible(true)}>Pick date</Button>
            </View>

            

             
            <View
                style={styles.inputRowcontainerNoborder}>
                
                <Button 
                    onPress={() => setModalVisible(!modalVisible)}
                    >
                    Cancel
                </Button>

                <Button 
                    onPress={() => setModalVisible(!modalVisible)}
                    mode={'contained'}
                    buttoncolor='blue'>
                    Post
                        
                </Button>
            </View>
            
            
            </View>
        </View>
        </Modal>

        <Button onPress={() => setModalVisible(true)}>Make post</Button>


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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    inputContainer: {
        width: '80%'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
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
        textAlign: 'center',
    },
    inputTitle: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
      fontWeight: '700',
      fontSize: 16,
    },
    inputRowcontainer: {
        flexDirection: "row",
        marginVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        flexWrap: "wrap",
        alignItems: "center"
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