import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth } from '../api/firebase'
import { useNavigation } from '@react-navigation/core'
import { handleLogin, handleEmailVerification, handleSignUp, handleResetPassword } from '../logic/authenticationHandler'
import { Navigator } from '../components/navigator'
import { blacklistCollection } from '../constants/constants'
const DOMAIN = '@gatech.edu'
const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [reload, setReload] = useState(true)
  const [password, setPassword] = useState('')

  const navigation = useNavigation()



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log(user)
      if (user && user.emailVerified) {
        
          if (user.displayName  != null)
            navigation.navigate("Navigator")
          else
            navigation.navigate("Profile")

          }
    })

    return unsubscribe
  }, [])


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <View>
          <TextInput
            placeholder="GT Username"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
        </View>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>

        <TouchableOpacity
          onPress={() => handleLogin(email + DOMAIN, password, navigation)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSignUp(email + DOMAIN, password)}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEmailVerification(email + DOMAIN, password)}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Resend Email Verification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleResetPassword(email + DOMAIN)}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Reset password</Text>
        </TouchableOpacity>

      </View>


    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})
