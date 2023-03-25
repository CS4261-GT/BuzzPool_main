import { Review } from '../model/Review'
import { auth, firestore } from '../api/firebase'



const usersCollection = firestore.collection('Users');


/**
 * This function adds the first name and last name for a user
 * @param {string} fname 
 * @param {string} lname 
 */
const addName = (fname, lname) => {

}

/**
 * This function retrieves the first name and last name for a user
 * @returns {{string, string}}
 */
const getName = () => {

}

/**
 * This function updates the first name and last name for a user
 * @param {string} fname 
 * @param {string} lname 
 */
const updateName = (fname, lname) => {

}

/**
 * This function adds the GTID for a user
 * @param {string} gtid 
 */
const addGTID = (gtid) => {

}

/**
 * This function retrieves the gtid of a user
 * @returns {string}
 */
const getGTID = () => {

}

/**
 * This function updates the GTID for a user
 * @param {string} gtid 
 */
const updateGTID = (gtid) => {

}


/**
 * This function adds the phone number of a user
 * @param {string} phoneNumber 
 */
const addPhoneNumber = (phoneNumber) => {

}

/**
 * This function retrieves the phone number of a user
 * @returns {string}
 */
const getPhoneNumber = () => {

}

/**
 * This function updatse the phone number of a user
 * @param {string} phoneNumber 
 */
const updatePhoneNumber = (phoneNumber) => {

}

/**
 * This function adds a Review for a user
 * @param {Review} review 
 */
const addReview = (review) => {

}

/**
 * This function retrieves all the reviews for a user
 * @returns {List<Review>} 
 */
const getReviews = () => {

}

/**
 * This function adds a Venmo handle for the user
 * @param {string} venmo 
 */
const addVenmoHandle = (venmo) => {

}

/**
 * This function retrieves the Venmo handle of a user
 * @returns {string}
 */
const getVenmoHandle = () => {

}

/**
 * This function updates a Venmo handle for the user
 * @param {string} venmo
 */
const updateVenmoHandle = (venmo) => {

}


export {}