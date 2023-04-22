import { Review } from '../model/Review'
import { auth, firestore } from '../api/firebase'
import User from '../model/User';
import { carpoolConverter, userConverter } from '../constants/converters';
import { subscreen, tripStatus, carpoolCollection, usersCollection } from '../constants/constants';
import { convertToCarpool } from './carpoolHandler';

/**
 * add an instance of report to the report collection
 * @param {string} reportedEmail 
 * @param {string} reportedFirst 
 * @param {string} reportedLast 
 * @param {number} reportedGTID 
 * @param {string} message 
 * @param {string} carpoolTitle 
 */
export const addReport = async(reportedEmail, reportedFirst, reportedLast, reportedGTID, message, carpoolTitle) => {
  firestore.collection("Reports").add({
    email: reportedEmail, // Replace with the actual data you want to store
    first: reportedFirst,
    last: reportedLast,
    GTID: reportedGTID,
    message: message,
    carpoolTitle: carpoolTitle,
  });
}