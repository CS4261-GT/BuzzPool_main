import { auth } from "../api/firebase"

export default class User {
  constructor(GTID, firstName, lastName, phoneNumber, ongoingTripID) {
    // userId from firebase?
    this.email = auth.currentUser.email
    this.GTID = GTID
    this.firstName = firstName
    this.lastName = lastName
    this.phoneNumber = phoneNumber
    this.ongoingTripID = ongoingTripID
  
  }

  /**
   * This function adds the tripId to a user
   * If it is successful, returns true, otherwise false
   * @param {string} tripId 
   */
  addTripId(tripId){
    if (this.ongoingTripID.includes(tripId))
      return false
    this.ongoingTripID.push(tripId)
    return true
  }



  /**
   * This function retrieves the first name and last name for a user
   * @returns {string, string}}
   */
  getName(){
    return {"firstName": this.firstName, "lastName": this.lastName}
  }

  /**
   * This function updates the first name and last name for a user
   * @param {string} fname 
   * @param {string} lname 
   */
  updateName(fname, lname){

  }


  /**
   * This function retrieves the gtid of a user
   * @returns {number}
   */
  getGTID(){
    return this.GTID
  }

  /**
   * This function updates the GTID for a user
   * @param {number} GTID 
   */
  updateGTID(GTID){
    this.GTID = GTID
  }



  /**
   * This function retrieves the phone number of a user
   * @returns {number}
   */
  getPhoneNumber(){
    return this.phoneNumber
  }

  /**
   * This function updatse the phone number of a user
   * @param {number} phoneNumber 
   */
  updatePhoneNumber(phoneNumber){
    this.phoneNumber = phoneNumber
  }

  /**
   * This function adds a Review for a user
   * @param {Review} review 
   */
  addReview(review){

  }

  /**
   * This function retrieves all the reviews for a user
   * @returns {List<Review>} 
   */
  getReviews(){

  }

  /**
   * This function adds a Venmo handle for the user
   * @param {string} venmo 
   */
  addVenmoHandle(venmo){

  }

  /**
   * This function retrieves the Venmo handle of a user
   * @returns {string}
   */
  getVenmoHandle(){

  }

  /**
   * This function updates a Venmo handle for the user
   * @param {string} venmo
   */
  updateVenmoHandle(venmo){

  }
}