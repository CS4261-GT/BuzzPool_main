import { Avatar, Button, Card, Text, Checkbox } from 'react-native-paper';
import { DateTimePickerModal } from 'react-native-paper-datetimepicker';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useRef, useState, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, TextInput, FlatList, Modal } from 'react-native'
import { addUser } from '../logic/userProfileHandler'
import ServiceScreen from './ServiceScreen';



/**
 * This function returns the profile page UI
 * @returns profile page UI
 */
const ProfileScreen = () => {

    const Tab = createBottomTabNavigator();
    const navigation = useNavigation()

    /**
     * This function does a sanity check of the user input information
     * and makes sure it is correct before pushing it to firestore
     */
    const createUser = () => {
        try {
            const pNumber = Number(phoneNumber)
            const GTIDNumber = Number(GTID)
            if (!(firstName.length > 0 && lastName.length > 0 && phoneNumber.length == 10 && GTID.length == 9) || isNaN(pNumber) || isNaN(GTID))
                throw new Error()
            addUser(firstName, lastName, pNumber, GTIDNumber)
            .then(() => navigation.navigate("Navigator"))
        } catch (error) {
            alert("Incomplete or Invalid user information!")
        }
    }

    
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [GTID, setGTID] = useState("")

    return (
        
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
            
        
            <View style={styles.centeredView}>
                <Text
                    style={styles.title}>
                    Create Your Profile
                    </Text>

                <View
                    style={styles.inputRowcontainer}>
                    
                    <Text style={styles.inputLabel}>First Name: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setFirstName}
                        placeholder="Your firstname"
                        placeholderTextColor="grey"
                        value={firstName}
                    />
                </View>

                <View
                    style={styles.inputRowcontainer}>
                    
                    <Text style={styles.inputLabel}>Last Name:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setLastName}
                        placeholder="Your lastname"
                        placeholderTextColor="grey"
                        value={lastName}
                    />
                </View>

                <View
                    style={styles.inputRowcontainer}>
                    
                    <Text style={styles.inputLabel}>Phone Number:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPhoneNumber}
                        placeholder="Your phone number"
                        placeholderTextColor="grey"
                        value={phoneNumber}
                    />
                </View>

                
               

                
                <View
                    style={styles.inputRowcontainer}>
                    
                    <Text style={styles.inputLabel}>Your GTID:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setGTID}
                        placeholder="Your phone number"
                        placeholderTextColor="grey"
                        value={GTID}
                    />
                </View>

                
                
                <Button onPress={createUser} style={styles.button} mode='contained' >Create Profile</Button>
                
            </View>

            

        </KeyboardAvoidingView>
    )
}

export default ProfileScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center",
        flexWrap: "wrap",
        // backgroundColor: "white",
      },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 22,
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    flatListStyle: {
        // flexWrap: "wrap",
        width: "100%",
        paddingHorizontal: 10,
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
    //   backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
      fontWeight: '700',
      fontSize: 16,
    },
    title: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 50,
        textAlign: 'center',
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
        // backgroundColor: 'white',
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
      marginTop: 5,
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