import { Review } from '../model/Review'
import { auth, firestore } from '../api/firebase'
import User from '../model/User';


const usersCollection = firestore.collection('Users');



/**
 * This function pushes user info to firestore 
 * if user information is complete
 * @param {string} fname 
 * @param {string} lname 
 * @param {number} phoneNumber 
 * @param {number} GTID 
 */
export const addUser = (fname, lname, phoneNumber, GTID) => {
    // console.log("function called")
    usersCollection
        .add({
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
var userConverter = {
  toFirestore: function (user) {
    // data fields for reference

    // firstName: fname,
    //         lastName: lname,
    //         phoneNumber: phoneNumber,
    //         GTID: GTID,
    //         ongoingTripID: []
    return {
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