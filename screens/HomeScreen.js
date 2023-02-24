import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, TextInput, Button } from 'react-native'
import { auth } from '../firebase'
import DatePicker from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';

const HomeScreen = () => {

  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState(new Date());

  const navigation = useNavigation()

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  const handlePageChange = () => {
    navigation.replace("Event")
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();

    //console.log(fDate)
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }

  const handleCreateEvent = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const calendar = await Calendar.getDefaultCalendarAsync();
      await Calendar.createEventAsync(calendar.id, {
        title: eventName,
        startDate: date,
        endDate: date,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.container}>
        <Text>Email: {auth.currentUser?.email}</Text>    

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Event Name"
            value={eventName}
            onChangeText={text => setEventName(text)}
            style={styles.input}
            autoFocus
          />
         </View>

        <Text>Choose Event Date: </Text>

        {
          <DatePicker
            testID = 'datepicker'
            value = {date}
            mode = 'date'
            display = 'default'
            onChange = {onChange}
          />
        }
        
        <TouchableOpacity
          onPress={handleCreateEvent} //fix this
          style={styles.button}
        >
        <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%',
    marginTop: 25
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
   button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 25,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})