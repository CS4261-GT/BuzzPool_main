export default class Carpool {
  constructor(title, departureTime, departureLocation, destination,
    requireDriver = true, capacity = 4, userGTIDs = [],
    isTransactionFinished = false, isTripFinished = false) {
    this.title = title
    this.departureTime = departureTime
    this.departureLocation = departureLocation
    this.destination = destination
    this.capacity = capacity
    this.requireDriver = requireDriver
    this.userGTIDs = userGTIDs
    this.isTransactionFinished = isTransactionFinished
    this.isTripFinished = isTripFinished
  }

  /**
   * 
   * @returns the number of remaining seats for the carpool
   */
  getRemainingSeats() {
    return this.capacity - this.userGTIDs.length
  }
 
  /**
   * This method adds a driver to the carpool
   * @param {number} gtid 
   * @return {boolean} true if the action is successful, false otherwise
   */
  addDriver(gtid) {
    if (!this.requireDriver || this.userGTIDs.length == this.capacity)
      return false
    this.userGTIDs.push(gtid)
    this.requireDriver = false
    return true
  }

  /**
   * This method adds a rider to the carpool
   * @param {number} gtid 
   * @return {boolean} true if the action is successful, false otherwise
   */
  addRider(gtid) {
    if (this.userGTIDs.length == this.capacity)
      return false
    this.userGTIDs.push(gtid)
    return true
  }

  /**
   * This method adds a driver of a rider from a carpool
   *
   * If adding is successful, true will be returned
   * Otherwise it will return false
   * @param {number} gtid 
   * @param {boolean} isDriver 
   * @returns {boolean}
   */
  addUser(gtid, isDriver) {
    console.log("Add user")
    return isDriver ? this.addDriver(gtid) : this.addRider(gtid)
  }


  /**
   * This method removes a driver of a rider from a carpool
   * This method will set this.requireDriver to false if a 
   * driver is removed
   *
   * If removal is successful, true will be returned
   * Otherwise it will return false
   * @param {number} gtid 
   * @param {boolean} isDriver 
   * @returns {boolean}
   */
  removeUser(gtid, isDriver) {

  }


  /**
   * This method starts the carpooling trip
   */
  startTrip() {

  }

  /**
   * This method ends the carpooling trip
   * This method will call startTransaction
   * and startReview
   */
  endTrip() {

  }

  /**
   * This method starts the transaction between the driver and riders
   * Once transaction is done, this.isTransactionFinished and this.isTripFinished
   * will be both marked true
   */
  startTransaction() {

  }

  /**
   * This method starts the review process between the driver and riders
   * We don't enforce reviews for now, but this can be further discussed
   */
  startReview() {

  }

  /**
   * This method reports a suspicious user to the GT police
   * @param {string} gtid 
   */
  reportUser(gtid) {

  }


}