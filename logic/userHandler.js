import { Review } from '../model/Review'
import { auth, firestore } from '../api/firebase'
import User from '../model/User';
import { carpoolConverter, userConverter } from '../constants/converters';
import { subscreen, tripStatus, carpoolCollection, usersCollection } from '../constants/constants';
import { convertToCarpool } from './carpoolHandler';


/**
 * move an archived trip from the user's archive to their ongoing trip collection
 * @param {object} userWithId 
 * @param {object} carpoolWithId 
 * @returns 
 */
export const archiveTrip = async (userWithId, carpoolWithId) => {
  // console.log("attempt to archive trip")
  if (carpoolWithId.tripStatus != tripStatus.Finished) {
    alert("You can only archive finished trips!")
    return
  }
  const ongoingTrips = userWithId.ongoingTripID.filter(trip => {
    // console.log(trip == carpoolWithId.id)
    return !(trip == carpoolWithId.id)
  })

  // console.log(...userWithId.archivedTripID)
  const archivedTrips = [...userWithId.archivedTripID, carpoolWithId.id]
  userWithId.ongoingTripID = ongoingTrips
  userWithId.archivedTripID = archivedTrips

  usersCollection
  .doc(userWithId._id)
  .withConverter(userConverter)
  .set(userWithId)
  .catch(e => console.error(e.message))

}

/**
 * unarchive a trip from a user's trip archive to the ongoing trip
 * @param {object} userWithId 
 * @param {object} carpoolWithId 
 */
export const unarchiveTrip = async (userWithId, carpoolWithId) => {
  // console.log("attempt to unarchive trip")
  const archivedTrips = userWithId.archivedTripID.filter(trip => {
    // console.log(trip == carpoolWithId.id)
    return !(trip == carpoolWithId.id)
  })

  // console.log(...userWithId.archivedTripID)
  const ongoingTrips = [...userWithId.ongoingTripID, carpoolWithId.id]
  userWithId.ongoingTripID = ongoingTrips
  userWithId.archivedTripID = archivedTrips

  usersCollection
  .doc(userWithId._id)
  .withConverter(userConverter)
  .set(userWithId)
  .catch(e => console.error(e.message))

}

/**
 * exit a carpool that hasn't started
 * @param {object} userWithId 
 * @param {object} carpoolWithId 
 * @returns 
 */
export const leaveTrip = async (userWithId, carpoolWithId) => {
  console.log("attempt to leave trip")
  if (carpoolWithId.tripStatus != tripStatus.NotStarted) {
    alert("You can only leave unstarted trips!")
    return
  }
  const ongoingTrips = userWithId.ongoingTripID.filter(trip => {
    // console.log(trip == carpoolWithId.id)
    return !(trip == carpoolWithId.id)
  })

  // console.log(...userWithId.archivedTripID)

  userWithId.ongoingTripID = ongoingTrips

  await usersCollection
  .doc(userWithId._id)
  .withConverter(userConverter)
  .set(userWithId)
  .catch(e => console.error(e.message))

  if (carpoolWithId.driverGTID == userWithId.GTID && !carpoolWithId.requireDriver) {
    carpoolWithId.driverGTID = -1
    carpoolWithId.requireDriver = true
  }
  const userIDs = carpoolWithId.userIDs.filter(userID => {
    return !(userID == userWithId._id)
  })
  const userGITDs = carpoolWithId.userGTIDs.filter(userGTID => {
    return !(userGTID == userWithId.GTID)
  })
  carpoolWithId.userIDs = userIDs
  carpoolWithId.userGTIDs = userGITDs
  await carpoolCollection
  .doc(carpoolWithId.id)
  .withConverter(carpoolConverter)
  .set(carpoolWithId)
  .catch(e => console.error(e.message))
    

  // carpool remove user

}

/**
 * return all the carpools in a user's ongoing/archived trips
 * @returns {Promise<Carpool[]>} a list of carpool stored in Promise
 */
export const showMyCarpool = async (keyword) => {
  var carpoolList = []
  const {userId, userData} = await getLoginUser()


  const userCarpool = keyword == subscreen.ongoingTrips ? userData.ongoingTripID : userData.archivedTripID
  await carpoolCollection
  .withConverter(carpoolConverter)
  // .orderBy("departureTime", "asec")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      var carpool = doc.data()
      
      const carpoolID = doc.id
      carpool.id = carpoolID
      // console.log(carpool)

      if (userCarpool.includes(carpoolID)) {
        carpoolList.push(carpool)
      }
        
    });
    // console.log(carpoolList.length)
  })
  // .then(()=>console.log(carpools))
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });

  // console.log("Here " + carpoolList.length)
  // console.log(carpoolList)
  return carpoolList
}

/**
 * return all the user objects in a carpool
 * @param {array[string]} userIDs 
 * @returns 
 */
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
  // console.log("trying to get all users")
  // console.log(userArr)
  return userArr
}

/**
 * 
 * @returns the instance of a logged in user
 */
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
 * add the carpool to user's ongoing carpool
 * 1) add carpool id to user's ongoingCarpool and push user data to firestore
 * 2) remove the card from feed
 * 3) update carpool's data and push carpool data to firestore
 * @param {CarpoolWithId} carpoolWithId
 * @param {boolean} isDriver
 * @return {boolean} true if joining the carpool is successful
 */
export const joinCarpool = async (carpoolWithId, isDriver) => {
  // console.log(auth.currentUser)
  // console.log("trying to join a carpool")
  // console.log("inside joinCarpool")
  // console.log(carpool)
  var tripSuccess;
  console.log("in join carpool")
  console.log(carpoolWithId)
  await getLoginUser()
    .then(({ userId, userData }) => {
      // console.log(userData)
      const carpool = convertToCarpool(carpoolWithId)
      if (userData.addTripId(carpoolWithId.id) && carpool.addUser(userData.GTID, userId, isDriver)) {
        console.log(userData)

        // update user data in firestore
        usersCollection.doc(userId)
          .withConverter(userConverter)
          .set(userData)
          .catch(e => console.error(e.message))

        // update carpool data in firestore
        console.log("trying to update firestore carpool")
        carpoolCollection.doc(carpoolWithId.id)
          .withConverter(carpoolConverter)
          .set(carpool)

        alert("Successfully joined the carpool!")
        tripSuccess = carpool
      }
      else {
        alert("Error in joining the carpool")
      }
        
    })
    .catch(error => console.error(error.message))
  console.log(tripSuccess)
  return tripSuccess
}



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

