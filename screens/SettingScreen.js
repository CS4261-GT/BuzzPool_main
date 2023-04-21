import React, { useState, useEffect } from "react";
import { auth, firestore } from "../api/firebase";
import { useNavigation } from "@react-navigation/core";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { phonecall, text } from "react-native-communications";
import { Button } from "react-native-paper";
import { getDataUsingPost } from "../api/nativeNotify";

const SettingScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  //Profile Update
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [GTID, setGTID] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((curr) => {
      if (curr) {
        setCurrentUser(curr);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = firestore.collection("Users").onSnapshot((snapshot) => {
      const userList = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        userList.push({
          id: doc.id,
          GTID: userData.GTID,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          ongoingTripID: userData.ongoingTripID,
          report: userData.report,
        });
      });
      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const matchingUser = users.find((user) => user.email === currentUser.email);

    if (matchingUser) {
      console.log("Found user!");
      const firstName = matchingUser.firstName;
      const lastName = matchingUser.lastName;
      const phoneNumber = matchingUser.phoneNumber;
      const email = matchingUser.email;
      const userid = matchingUser.GTID;
      setFirst(firstName);
      setLast(lastName);
      setPhone(phoneNumber);
      setEmail(email);
      setGTID(userid);
    
    } else {
      console.log("Not found!");
    }
  });

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        alert("User successfully logged out");
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  const reportScreen = () => {
    navigation.navigate("Reports");
  };

  const terms = () => {
    //
  };

  const updateProfile = () => {
    navigation.navigate("UpdateProfile");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>

      <View style={styles.container}>
        {/* add a Text component to display the user email */}
        {currentUser && (
          <>
          <View style={styles.userContainer}>
          <Text style={styles.userText}>Logged in as: {(first + " " + last)}</Text>
          <Text style={styles.userText}>Email: {email}</Text>
          <Text style={styles.userText}>Phone: {phone}</Text>
          <Text style={styles.userText}>GTID: {GTID}</Text>
          </View>
          </>

        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonStyle}
            onPress={() => phonecall("4048942500", true)}
          >
            <Text style={styles.buttonTextStyle}>Call GTPD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonStyle}
            onPress={() => text("4048942500")}
          >
            <Text style={styles.buttonTextStyle}>Text GTPD</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.reportButtonStyle}
          onPress={reportScreen}
        >
          <Text style={styles.buttonTextStyle}>View Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.reportButtonStyle}
          onPress={updateProfile}
        >
          <Text style={styles.buttonTextStyle}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.reportButtonStyle}
          onPress={terms}
        >
          <Text style={styles.buttonTextStyle}>Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.logOutButtonStyle}
          onPress={logOut}
        >
          <Text style={styles.buttonTextStyle}>Log Out</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={getDataUsingPost}>
          <Text style={styles.buttonTextStyle}>
            send notification
          </Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    textAlign: "center",
  },
  buttonConfirm: {
    backgroundColor: "#0782F9",
    alignItems: "center",
    marginBottom: 5,
    marginHorizontal: 5,
  },
  buttonStyle: {
    backgroundColor: "#0782F9",
    width: "50%",
    padding: 20,
    borderRadius: 10,
    marginTop: 40,
    alignItems: "center",
    marginHorizontal: 2
  },
  logOutButtonStyle: {
    backgroundColor: "#000000",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    marginTop: 50,
    alignItems: "center",
    marginHorizontal: 2,
    color: "white",
  },
  reportButtonStyle: {
    backgroundColor: "#0096FF",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    marginHorizontal: 2,
    color: "white",
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  emailText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  userContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
});
