import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.SECURE_FIREBASE_API_KEY,
  authDomain:   process.env.SECURE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.SECURE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.SECURE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  process.env.SECURE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.SECURE_FIREBASE_APP_ID,
  measurementId: process.env.SECURE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Google Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Return user data in a format compatible with your app
    return {
      success: true,
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL || null,
        provider: 'google'
      }
    }
  } catch (error) {
    console.error('Google sign-in error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const user = result.user
    
    return {
      success: true,
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL || null,
        provider: 'email'
      }
    }
  } catch (error) {
    console.error('Email sign-in error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const createAccount = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user
    
    // You can update the display name here if needed
    // await updateProfile(user, { displayName })
    
    return {
      success: true,
      user: {
        id: user.uid,
        email: user.email,
        name: displayName || user.email.split('@')[0],
        avatar: user.photoURL || null,
        provider: 'email'
      }
    }
  } catch (error) {
    console.error('Account creation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const logOut = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: error.message }
  }
}

// Auth state observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL || null,
        provider: user.providerData[0]?.providerId || 'unknown'
      })
    } else {
      callback(null)
    }
  })
}

export default app
