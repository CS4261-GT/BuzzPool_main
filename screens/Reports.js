import React, { useState, useEffect } from "react";
import { auth, firestore } from "../api/firebase";
import { useNavigation } from "@react-navigation/core";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]); // create a state for reports

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
          ongoingTripID: userData.ongoingTripID,
          report: userData.report, // add the reports field to the user object
        });
      });
      setUsers(userList);
      setLoading(false);
    });

    // Unsubscribe from Firestore listener when component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const matchingUser = users.find((user) => user.email === currentUser.email);

    if (matchingUser) {
      console.log("Found user!");
      const userReports = matchingUser.report;
      setReports(userReports); // set the reports state to the user's reports array
    } else {
      console.log("Not found!");
    }
  });

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.container}>
        <View>
          <Text style={styles.emailText}>Reports will be shown here:</Text>
          {reports &&
            reports.map((report, index) => (
              <View key={index} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportHeaderText}>
                    Report #{index + 1}
                  </Text>
                </View>
                <Text style={styles.reportBody}>{report}</Text>
              </View>
            ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Reports;

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
  emailText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  refreshButton: {
    backgroundColor: "#FBE106",
    borderRadius: 5,
    marginTop: 20,
  },
  refreshButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  reportCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    padding: 16,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reportHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  reportBody: {
    fontSize: 14,
    color: "#444",
  },
});
