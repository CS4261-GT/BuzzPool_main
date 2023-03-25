export default class Carpool {
    constructor(departureTime, departureLocation, destination, gtid, capacity=5) {
        this.departureTime = departureTime
        this.departureLocation = departureLocation
        this.destination = destination
        this.capacity = capacity
        this.requireDriver = true
        this.userGTIDs = [gtid]
        this.isTransactionFinished = false
        this.isTripFinished = false
    }

    /**
     * This method adds a driver to the carpool
     * @param {string} gtid 
     */
    addDriver(gtid) {

    }

    /**
     * This method adds a rider to the carpool
     * @param {string} gtid 
     */
    addRider(gtid) {

    }


    /**
     * This method removes a driver of a rider from a carpool
     * This method will set this.requireDriver to false if a 
     * driver is removed
     *
     * If removal is successful, true will be returned
     * Otherwise it will return false
     * @param {string} gtid 
     * @param {bool} isDriver 
     * @returns {bool}
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