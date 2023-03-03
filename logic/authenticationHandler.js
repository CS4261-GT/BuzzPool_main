import { auth } from '../api/firebase'
const handleEmailVerification = (email) => {
    const user = auth.currentUser
    // console.log(user);
    if (user)
        user.sendEmailVerification()
        .then(_ => alert(`Email Verification is sent to ${email}`))
        .catch(error => alert(error.message))
    else alert("User is null")
}

// Joe: this is just a placeholder because I haven't had the access to firebase project yet
const handleDeleteUser = (email, password) => {
    const {user} = auth.currentUser
    // if user is signed in, delete right away
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
    auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        handleEmailVerification()
    })
    .catch(error => alert(error.message))


}

const handleLogin = (email, password) => {
    auth
    .signInWithEmailAndPassword(email, password)
    .then(userCredentials => {
        const user = userCredentials.user;
        console.log(user)
        if (!user.emailVerified) {
            auth.signOut()
            alert("Email is not verified")
        } else {
            console.log('Logged in with:', user.email);
        }
    })
    .catch(error => alert(error.message));
}

const handleResetPassword = (email) => {
    auth.sendPasswordResetEmail(email)
    .then(() => alert(`Password reset email is sent to ${email}`))
    .catch(e => alert(e))
}
export {handleDeleteUser, handleEmailVerification, handleLogin, handleSignUp, handleResetPassword}