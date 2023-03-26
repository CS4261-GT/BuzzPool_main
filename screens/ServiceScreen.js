import { Avatar, Button, Card, Text, Checkbox, SegmentedButtons } from 'react-native-paper';
import { DateTimePickerModal } from 'react-native-paper-datetimepicker';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList, Modal } from 'react-native'
import { addCarpool, getCarpool } from '../logic/carpoolHandler'


/**
 * This function is called for every item in the flatlist
 * It will create a card for each carpool instance
 * @param {Carpool} item I think it has to be named "item", it represents a carpool instance
 * @returns 
 */
const renderCards = ({item}) => {
    // console.log(item)

    // I think title is not necessary
    const subtitle = "From " + item.departureLocation + "\n" + "To " + item.destination
    if (item)
        return (
            <Card
                style={styles.cardStyle}>
                <Card.Title 
                    title={item.title} 
                    titleStyle={styles.postTitle}
                    subtitleNumberOfLines={2} 
                    subtitle={subtitle} 
                />
                <Card.Content>
                    <Text variant="titleLarge">{item.departureTime}</Text>
                    <Text variant="bodyMedium">car capacity: {item.capacity}</Text>
                    <Text variant="bodyMedium">Remaining seats: {item.capacity}</Text>
                </Card.Content>
                {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                <Card.Actions>
                <Button>Skip</Button>
                <Button>Join</Button>
                </Card.Actions>
            </Card>
        )
    else
        return <></>
} 



const ServiceScreen = () => {

    const [carpoolData, setCarpoolData] = useState(getCarpool())
    const [title, onChangeTitle] = useState("")
    const [departureLocation, onChangeDepartureLocation] = useState("")
    const [destination, onChangeDestination] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [flatlistRefresh, flipBit] = useState(true)
    const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false)
    const onDateTimePickerDismiss = useCallback(() => {
        setDateTimePickerVisible(false);
    }, [setDateTimePickerVisible]);
    const [requesterGTID, setRequesterGTID] = useState("")
    const [isDriver, setIsDriver] = useState(true)
    const [date, setDate] = useState(new Date());
    const onDateTimeChange = useCallback(( newDate ) => {
        // console.log(newDate);
        setDateTimePickerVisible(false);
        setDate(newDate);
      }, []);

    const [value, setValue] = React.useState('');
   

    // useEffect(() => {
    //   const unsubscribe = auth.onAuthStateChanged(user => {
    //     if (user) {
    //       navigation.replace("Home")
    //     }
    //   })
  
    //   return unsubscribe
    // }, [])

    /**
     * This function closes the modal and calls the handler in carpoolHandler.js
     */
    const makePost = () => {
        setModalVisible(!modalVisible)
        addCarpool(
            title,
            date.toLocaleString(), 
            departureLocation,
            destination,
            requesterGTID,
            !isDriver,
        );
    }

    /**
     * This function resets carpool data and force rerendering of the UI
     */
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

        <SegmentedButtons
            value={value}
            onValueChange={setValue}
            style={styles.segmentedButtons}
            buttons={[
            {
                value: 'myTrip',
                label: 'My Trip',
            },
            {
                value: 'rider',
                label: 'Riders',
            },
            {
                value: 'request',
                label: 'Request',
            },
            {
                value: 'contact',
                label: 'Contacts',
            },
            
            ]}
        />
        <Button onPress={() => setModalVisible(true)}>Make post</Button>


        <Button onPress={updateData}>Refresh carpools</Button>
        <FlatList
            data={carpoolData}
            style={styles.flatListStyle}
            contentContainerStyle={{alignItems: "stretch"}}
            renderItem={renderCards}
            keyExtractor={item => item.id}
            extraData={flatlistRefresh}
            >

        </FlatList>

        {/* ---------------Modal will be dispalyed below---------------- */}

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <TextInput
                        style={styles.input}
                        onChangeText={onChangeTitle}
                        placeholder="Post Title"
                        placeholderTextColor="grey"
                        value={title}
                    />

                <View
                    style={styles.inputRowcontainer}>
                    
                    <Text style={styles.inputLabel}>From:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeDepartureLocation}
                        placeholder="departure location"
                        placeholderTextColor="grey"
                        value={departureLocation}
                    />
                </View>

                <View
                    style={styles.inputRowcontainer}>
                    
                    <Text style={styles.inputLabel}>To:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeDestination}
                        placeholder="destination"
                        placeholderTextColor="grey"
                        value={destination}
                    />
                </View>

                
                <View
                    style={styles.inputRowcontainer}>
                    
                    <DateTimePickerModal
                        visible={dateTimePickerVisible}
                        onDismiss={onDateTimePickerDismiss}
                        date={date}
                        onConfirm={onDateTimeChange}
                        label="Pick A Date"
                    />

                    <Text style={styles.input}>{date.toLocaleString()}</Text>
                    <Button onPress={() => setDateTimePickerVisible(true)}>Pick date</Button>
                </View>

                
                <View
                    style={styles.inputRowcontainer}>
                    
                    <Text style={styles.inputLabel}>Your GTID:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setRequesterGTID}
                        placeholder="123456789"
                        placeholderTextColor="grey"
                        value={requesterGTID}
                    />
                </View>

                <View
                    style={styles.inputRowcontainer}>
                    
                    <Text style={styles.inputLabel}>Are you a driver?</Text>
                    <Checkbox
                        status={isDriver ? 'checked' : 'unchecked'}
                        color="green"
                        onPress={() => setIsDriver(!isDriver)}/>
                </View>

            
                
                <View
                    style={styles.inputRowcontainerNoborder}>
                    
                    <Button 
                        onPress={() => setModalVisible(!modalVisible)}
                        >
                        Cancel
                    </Button>

                    <Button 
                        onPress={makePost}
                        mode={'contained'}
                        buttoncolor='blue'>
                        Post
                            
                    </Button>
                </View>
                
                
                </View>
            </View>
        </Modal>

    </KeyboardAvoidingView>
  )
}

export default ServiceScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center",
        flexWrap: "wrap",
      },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    flatListStyle: {
        // flexWrap: "wrap",
        width: "100%",
        paddingHorizontal: 10,
    },
    segmentedButtons: {
        padding: 10,
        margin: 10,
    },
    cardStyle: {
        marginVertical: 10,
        marginHorizontal: 10,
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
    postTitle: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        textAlign: 'center',
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