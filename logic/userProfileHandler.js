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

    console.log(user)

    return {
      email: user.email,
      GTID: user.GTID,
      fisrtName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      ongoingTripID: user.ongoingTripID,
      };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    var user = new User(
      user.email,
      user.GTID,
      user.firstName,
      user.lastName,
      user.phoneNumber,
      user.ongoingTripID,
      );

    return user;
  }
};



export {}