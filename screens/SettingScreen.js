import React, { useState, useEffect } from "react";
import { auth } from "../api/firebase";
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

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

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.container}>
        {/* add a Text component to display the user email */}
        {user && (
          <Text style={styles.emailText}>Logged in as: {user.email}</Text>
        )}

        <Text style={styles.titleText}>
          Contact Georgia Tech Police Department (GTPD)
        </Text>

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
});
