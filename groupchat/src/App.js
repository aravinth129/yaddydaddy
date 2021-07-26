
import React, { useRef, useState } from 'react'
import './App.css';
import firebase from 'firebase';
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyCH9wWhPWrW50u4e4uZnBHr2yztYEB_GGU",
  authDomain: "yaddychat.firebaseapp.com",
  projectId: "yaddychat",
  storageBucket: "yaddychat.appspot.com",
  messagingSenderId: "128945682340",
  appId: "1:128945682340:web:4d56db3071b958582f7331",
  measurementId: "G-FCFXH0945Z"
})

const auth = firebase.auth()
const firestore = firebase.firestore()


function App() {

  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>
        {user ? <SignOut /> : ''}
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}

      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)
  const [formValue, setFormValue] = useState('')

  const [messages] = useCollectionData(query, { idField: 'id' })

  const sendMessage = async (e) => {
    e.preventDefault()
    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)} />
        <button type='submit'>Submit</button>
      </form>

      <div>

      </div>
    </>
  )


}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
