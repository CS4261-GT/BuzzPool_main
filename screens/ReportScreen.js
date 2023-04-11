import React from 'react';
import { auth } from '../api/firebase';
import { useNavigation } from '@react-navigation/core'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import {
  phonecall,
  text,
} from 'react-native-communications';
import { Button } from 'react-native-paper';


const ReportScreen = () => {

  const navigation = useNavigation()

  const logOut = () => {
    auth.signOut()
      .then(() => {
        alert("User successfully logged out")
        navigation.navigate("Login")
      })
      .catch((error) => alert(error.message))

  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Contact Georgia Tech Police Department (GTPD)
        </Text>
        {/* Call: phonecall(phoneNumber, prompt) */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={
            () => phonecall('4048942500', true)
          }>
          <Text style={styles.buttonTextStyle}>
            Call GTPD
          </Text>
        </TouchableOpacity>

        
        {/* SMS: text(phoneNumber = null, body = null) */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={() =>
            text(
              '4048942500'
            )
          }>
          <Text style={styles.buttonTextStyle}>
            Text GTPD
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={logOut}>
          <Text style={styles.buttonTextStyle}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
  },
  buttonConfirm: {
    backgroundColor: '#0782F9',
    alignItems: 'center',
    marginBottom: 5,
    marginHorizontal: 5,
  },
  buttonStyle: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});