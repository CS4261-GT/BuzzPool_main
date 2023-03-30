import { Review } from '../model/Review'
import { auth, firestore } from '../api/firebase'
import User from '../model/User';


export const usersCollection = firestore.collection('Users');





/**
 * This function pushes user info to firestore 
 * if user information is complete
 * @param {string} fname 
 * @param {string} lname 
 * @param {number} phoneNumber 
 * @param {number} GTID 
 */
export const addUser = async (fname, lname, phoneNumber, GTID) => {
    // console.log("function called")
    usersCollection
        .add({
            email: auth.currentUser.email,
            firstName: fname,
            lastName: lname,
            phoneNumber: phoneNumber,
            GTID: GTID,
            ongoingTripID: []
        })
        .then(() => {
            console.log('New user added!')
            alert("New user added!")

        })
        .catch( error => console.log(error.message));
}

/**
 * This object uses the firebase interface of datatype conversion
 * This converts a user object to a firestore compatible object upon write
 * and converts a firestore compatible object to a user object upon read
 */
export var userConverter = {
  toFirestore: function (user) {

    console.log("To firebase")
    console.log(user)

    return {
      email: user.email,
      GTID: user.GTID,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      ongoingTripID: user.ongoingTripID,
      };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    console.log("From firebase")
    console.log(data)

    var user = new User(
      data.GTID,
      data.firstName,
      data.lastName,
      data.phoneNumber,
      data.ongoingTripID,
      );

    return user;
  }
};



export {}