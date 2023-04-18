import Carpool from '../model/Carpool';
import { getLoginUser } from './userHandler';
import { carpoolConverter, userConverter} from '../constants/converters';
import { carpoolCollection, subscreen, tripStatus, usersCollection } from '../constants/constants';



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
        // console.log("this is the new carpool")
        // console.log(carpoolWithId)
        addInitialCarpoolCreator(carpoolWithId, !requireDriver)
      })

    })
    .catch(error => console.log(error.message));
  // console.log(carpool);
  return carpool
}

/**
 * This class returns all the available carpool instances from firestore
 * @returns {Promise<CarpoolWithId[]>} all avaialble carpool instances
 */
export const getAllCarpools = async () => {
  var carpools = [];
  await carpoolCollection
    .withConverter(carpoolConverter)
    // .orderBy("departureTime", "asec")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        
        var carpool = doc.data();
        // console.log(carpool)
        // console.log(carpool.departureTime.getTime() + 86400*1000 - new Date().getTime() )

        // don't show trips that are 12 hours behind or if they are finished
        if (carpool.departureTime.getTime() + 86400*1000/2 >= new Date().getTime() && carpool.tripStatus != tripStatus.Finished) {
          carpool['id'] = doc.id;
          carpools.push(carpool);
        }
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
