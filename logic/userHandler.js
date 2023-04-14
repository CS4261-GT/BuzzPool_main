import { Review } from '../model/Review'
import { auth, firestore } from '../api/firebase'
import User from '../model/User';
import { carpoolCollection, carpoolConverter } from './carpoolHandler';

export const usersCollection = firestore.collection('Users');

export const archiveTrip = async (userWithId, carpoolWithId) => {

  const ongoingTrips = userWithId.ongoingTripID.filter(trip => {
    return !(trip == carpoolWithId.id)
  })

  const archivedTrips = [...userWithId.archivedTripID, carpoolWithId.id]
  userWithId.ongoingTripID = ongoingTrips
  userWithId.archiveTrip = archivedTrips
  console.log(archivedTrips)
  usersCollection
  .doc(userWithId.id)
  .withConverter(userConverter)
  .set(userWithId)
  .catch(e => console.error(e.message))
}

/**
 * return all the carpools in a user's ongoing trips
 * @returns {Promise<Carpool[]>} a list of carpool stored in Promise
 */
export const showMyCarpool = async () => {
  var carpoolList = []
  const {userId, userData} = await getLoginUser()
  console.log("in showMyCarpool")
  console.log(userData)
  await carpoolCollection
  .withConverter(carpoolConverter)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      var carpool = doc.data()
      
      const carpoolID = doc.id
      carpool.id = carpoolID
      // console.log(carpool)
      if (userData.ongoingTripID.includes(carpoolID)) {
        carpoolList.push(carpool)
      }
        
    });
    // console.log(carpoolList.length)
  })
  // .then(()=>console.log(carpools))
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });

  console.log("Here " + carpoolList.length)
  // console.log(carpoolList)
  return carpoolList
}

export const getAllUsersInCarpool = async (userIDs) => {
  var userArr = []
  
  await usersCollection
  .withConverter(userConverter)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (userIDs.includes(doc.id))
        userArr.push(doc.data())
        // console.log("gotten a user!")
        // console.log(doc.data())
    })
  })
  .catch((error) => {
      console.log('Error getting documents: ', error)
  })
  console.log("trying to get all users")
  console.log(userArr)
  return userArr
}

export const getLoginUser = async () => {
  var returnUser = {};
  console.log("attemp to get user")
  await usersCollection.where('email', '==', auth.currentUser.email)
  .withConverter(userConverter)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      returnUser['userId'] = doc.id
      returnUser['userData'] = doc.data()
      // console.log("in user handler")
      // console.log(returnUser)
    })
  })
  .catch((error) => {
      console.log('Error getting documents: ', error)
  })
  return returnUser

}

// export var myUser = async () => {await getLoginUser()}




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
      archivedTripID: user.archivedTripID,
      };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    console.log("From firebase")
    console.log(data)

    var user = new User(
      data.email,
      data.GTID,
      data.firstName,
      data.lastName,
      data.phoneNumber,
      data.ongoingTripID,
      data.archivedTripID,
      );

    return user;
  }
};



export {}