import React, { useState, useEffect } from 'react'
import { auth } from '../api/firebase'
import { useNavigation } from '@react-navigation/core'
const handleEmailVerification = (email) => {
    const user = auth.currentUser
    console.log(user);
    if (user)
        user.sendEmailVerification()
        .then(_ => alert(`Email Verification is sent to ${email}`))
        .catch(error => alert(error.message))
    else alert("User is null")
}

const handleDeleteUser = (email, password) => {
    const {user} = auth.currentUser
    if (user) {
        user.delete()
        console.log(`delete account ${email}`)
        return
    }
    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredentials => {
        const user = userCredentials.user;
        // console.log('Logged in with:', user.email);
        user.delete();
        console.log(`delete account ${email}`)
        })
        .catch(error => alert(error.message))
    // console.log(auth.currentUser)
}

const handleSignUp = (email, password) => {
    const {user} = auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);

        handleEmailVerification()
        })
        .catch(error => alert(error.message))


}

const handleLogin = (email, password) => {
    const user = auth.currentUser;
    if (user) {
        user.reload().then(_ => {
        if (user.emailVerified) {
            auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
            })
            .catch(error => alert(error.message));
        } else {
            alert("email is not verified");
        }
        })
    } else {
        alert("User is null");
    }
}

export {handleDeleteUser, handleEmailVerification, handleLogin, handleSignUp}