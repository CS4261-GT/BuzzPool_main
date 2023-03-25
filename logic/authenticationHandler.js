import { auth } from '../api/firebase'

/**
 * This function handles email verification for user
 * This function is first called when a user registers for an account
 * If a user doesn't receive the verification email, they can call this function again
 * @param {string} email 
 * @param {string} password 
 */
const handleEmailVerification = (email, password) => {
    
    const user = auth.currentUser
    // console.log(user);
    if (!user)
        auth.signInWithEmailAndPassword(email, password).then(() => user.reload())
    user.sendEmailVerification()
    .then(_ => alert(`Email Verification is sent to ${email}`))
    .catch(error => alert(error.message))
}

/**
 * This function handles creates an account for the user in the firebase
 * This function then calls email verification
 * @param {string} email 
 * @param {string} password 
 */
const handleSignUp = (email, password) => {
    auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        handleEmailVerification(email)
    })
    .catch(error => alert(error.message))


}

/**
 * This function handles user login
 * Users are able to login if their email is verified
 * @param {string} email 
 * @param {string} password 
 */
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

/**
 * This function handles password reset for users
 * It will send a reset email to the user with the given email
 * @param {string} email 
 */
const handleResetPassword = (email) => {
    auth.sendPasswordResetEmail(email)
    .then(() => alert(`Password reset email is sent to ${email}`))
    .catch(e => alert(e.message))
}
export default { handleEmailVerification, handleLogin, handleSignUp, handleResetPassword }