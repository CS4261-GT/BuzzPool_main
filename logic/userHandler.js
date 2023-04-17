import { Review } from '../model/Review'
import { auth, firestore } from '../api/firebase'
import User from '../model/User';
import { carpoolConverter, userConverter, carpoolCollection, usersCollection } from '../constants/converters';



export const archiveTrip = async (userWithId, carpoolWithId) => {
  console.log("attempt to archive trip")
  const ongoingTrips = userWithId.ongoingTripID.filter(trip => {
    // console.log(trip == carpoolWithId.id)
    return !(trip == carpoolWithId.id)
  })

  // console.log(...userWithId.archivedTripID)
  const archivedTrips = [...userWithId.archivedTripID, carpoolWithId.id]
  userWithId.ongoingTripID = ongoingTrips
  userWithId.archivedTripID = archivedTrips
  // console.log("archived trips:")
  // console.log(archivedTrips)

  // console.log("updated user:")
  // console.log(userWithId)

  usersCollection
  .doc(userWithId._id)
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
  // console.log("in showMyCarpool")
  // console.log(userData)
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
  console.log("These are the user IDs for the carpool")
  console.log(userIDs)
  await usersCollection
  .withConverter(userConverter)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log('user to be compared')
      console.log(doc.id)
      if (userIDs.includes(doc.id)) {
        userArr.push(doc.data())
        console.log("gotten a user!")
        console.log(doc.data())
      }
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
            ongoingTripID: [],
            archivedTripID: [],
        })
        .then(() => {
            console.log('New user added!')
            alert("New user added!")

        })
        .catch( error => console.log(error.message));
}

