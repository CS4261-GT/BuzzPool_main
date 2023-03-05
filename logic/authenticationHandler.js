import { auth } from '../api/firebase'
const handleEmailVerification = (email, password) => {
    
    const user = auth.currentUser
    // console.log(user);
    if (!user)
        auth.signInWithEmailAndPassword(email, password).then(() => user.reload())
    user.sendEmailVerification()
    .then(_ => alert(`Email Verification is sent to ${email}`))
    .catch(error => alert(error.message))
}


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
    .catch(e => alert(e.message))
}
export {handleEmailVerification, handleLogin, handleSignUp, handleResetPassword}