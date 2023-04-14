import Carpool from '../model/Carpool';
import { getLoginUser } from './userHandler';
import { carpoolConverter, userConverter, carpoolCollection, usersCollection } from '../constants/converters';




/**
 * This function writes a carpool instance to firebase firestore
 * @param {string} title title of the post
 * @param {string} datetime datetime = Date.toLocaleString(), this is the departure time
 * @param {string} from departure location
 * @param {string} to destination
 * @param {boolean} requireDriver true if a driver is still needed for the carpool
 * @param {number} capacity capacity of the car
 * @param {number} GTID requester's GTID

 */
export const createCarpool = async(title, datetime, from, to, requireDriver, capacity, GTID, userID) => {

  const carpool = new Carpool(
    title,
    datetime,
    from,
    to,
    requireDriver,
    capacity,
    [GTID],
    !requireDriver ? GTID : "",
    [userID],
  );



  carpoolCollection
    .withConverter(carpoolConverter)
    .add(carpool)
    .then((docRef) => {
      console.log('New carpool added!');
      alert("New carpool added!")
      // console.log(docRef) 
      docRef.get()
      .then(carpoolWithId => {
        carpoolWithId['id'] = docRef.id
        console.log("this is the new carpool")
        console.log(carpoolWithId)
        addInitialCarpoolCreator(carpoolWithId, !requireDriver)
      })

    })
    .catch(error => console.log(error.message));
  // console.log(carpool);
  return carpool
}

/**
 * This class returns all the available carpool instances from firestore
 * @returns {Promise<Carpool[]>} all avaialble carpool instances
 */
export const getAllCarpools = async () => {
  var carpools = [];
  await carpoolCollection
    .withConverter(carpoolConverter)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        var carpool = doc.data();
        carpool['id'] = doc.id;
        carpools.push(carpool);
        // consolel
      });
    })
    // .then(()=>console.log(carpools))
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return carpools
}


export const updateCarpool = async (carpoolWithId) => {
  carpoolCollection
  .doc(carpoolWithId.id)
  .withConverter(carpoolConverter)
  .set(carpoolWithId)
  .catch(e => console.error(e.message))
}

// /**
//  * This class returns a selected carpool
//  * @returns {Promise<Carpool>} carpool
//  */
// export const getCarpoolById = async () => {
//   var carpools = [];
//   await carpoolCollection
//     .where()
//     .withConverter(carpoolConverter)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         // console.log(doc.id, " => ", doc.data());
//         var carpool = doc.data();
//         carpool['id'] = doc.id;
//         carpools.push(carpool);
//         // consolel
//       });
//     })
//     // .then(()=>console.log(carpools))
//     .catch((error) => {
//       console.log("Error getting documents: ", error);
//     });

//   return carpools
// }


/**
 * hide the carpool from user's feed
 * @param {string} carpoolId 
 */
export const skipCarpool = (carpoolData, carpoolId) => {
  // console.log(carpoolId)
  // console.log(carpoolData.length)
  const newCarpoolArray = carpoolData.filter((value) => {
    return value.id != carpoolId
  })
  // console.log(newCarpoolArray.length)

  console.log("Carpool skipped")
  return newCarpoolArray
}

/**
 * Add trip to carpool creator
 * @param {CarpoolWithId} carpool 
 */
export const addInitialCarpoolCreator = (carpool) => {
  // console.log(auth.currentUser)
  // console.log("trying to join a carpool")
  // console.log("inside joinCarpool")
  // console.log(carpool)
  getLoginUser()
    .then(({ userId, userData }) => {
      // console.log(userData)

      // add carpoolId to user
      if (userData.addTripId(carpool.id))
      {
        console.log("about to add carpool to carpool creator")
        console.log(userData)

        // update user data in firestore
        usersCollection.doc(userId)
          .withConverter(userConverter)
          .set(userData)
          .catch(e => console.error(e.message))

      }
      else
        alert("Error in joining the carpool")
    })
    .catch(error => console.log(error.message))
}

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
  var tripSuccess = false
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
        tripSuccess = true
      }
      else {
        alert("Error in joining the carpool")
        tripSuccess = false
      }
        
    })
    .catch(error => console.error(error.message))
  console.log(tripSuccess)
  return tripSuccess
}

export const convertToCarpool = (carpool) => {
  return new Carpool(
    carpool.title,
    carpool.departureTime,
    carpool.departureLocation,
    carpool.destination,
    carpool.requireDriver,
    carpool.capacity,
    carpool.userGTIDs,
    carpool.driverGTID,
    carpool.userIDs,


    // internal fields
    carpool.tripStatus,
    carpool.isTransactionFinished,
  )
  

}
