import React, { useState, useEffect } from "react";
import { auth, firestore } from "../api/firebase";
import { useNavigation } from "@react-navigation/core";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
} from "react-native";

const UpdateProfile = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  //Profile Update
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");

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
          report: userData.report,
          phoneNumber: userData.phoneNumber
        });
      });
      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = () => {

    const matchingUser = users.find((user) => user.email === currentUser.email);


    if (!first || !last || !phone) {
        alert("All fields are required.");
        return;
    } else {
        if (matchingUser) {
            firestore.collection("Users").doc(matchingUser.id).update({
              firstName: first,
              lastName: last,
              phoneNumber: phone,
            })
              .then(() => {
                alert("Profile updated successfully!");
              })
              .catch((error) => {
                  alert("Couldn't update profile!");
                console.error("Error updating profile: ", error);
              });
          }
    }


  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.container}>
        <View>
          <Text style={styles.emailText}>Update Profile</Text>
          <TextInput
            placeholder="First name"
            value={first}
            onChangeText={(text) => setFirst(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Last name"
            value={last}
            onChangeText={(text) => setLast(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone number"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
        </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfile;

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#0096FF',
    padding: 10,
    borderRadius: 5,
  },
});
