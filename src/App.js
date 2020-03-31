import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.Config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name:'',
    email:'',
    photo:''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(response => {
      const user = response.user;
      const {displayName, email, photoURL} = user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(error => {
      console.log("error");
      console.log("error.message");
    })
  }

  const handleSignOut = () => {
    //console.log("Signed Out Clicked");
    firebase.auth().signOut()
    .then(response => {
      const signOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo:'',
        password:'',
        error:'',
        isValid: false,
        existingUser: false
      }
      setUser(signOutUser);
    })
    
    .catch(error =>{
      console.log(error);
      console.log(error.message);
    })
  }

  const is_valid_email = (email) => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = event => {
    const createUser = {...user};
    createUser.existingUser = event.target.checked;
    setUser(createUser);
  }
  const handleChange = event => {
    const newUserInfo = {
      ...user
    }

    //perform Validation
    let isValid = true;
    if(event.target.name === 'email'){
      isValid = is_valid_email(event.target.value);
    }
    if(event.target.name === 'password'){
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name]=event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    //console.log(event.target.name, event.target.value);
  }

  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        console.log(response);
        const createUser = {...user};
            createUser.isSignedIn = true;
            createUser.message = '';
            setUser(createUser);
      })
      .catch(error => {
        console.log(error.message);
        const createUser = {...user};
            createUser.isSignedIn = false;
            createUser.error = error.message;
            setUser(createUser);
      })
      //console.log(user.email, user.password);
    }
    else{
      console.log("form is not valid", user);
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(response => {
        console.log(response);
        const createUser = {...user};
            createUser.isSignedIn = true;
            createUser.message = '';
            setUser(createUser);
      })
      .catch(error => {
        console.log(error.message);
        const createUser = {...user};
            createUser.isSignedIn = false;
            createUser.error = error.message;
            setUser(createUser);
      })
      //console.log(user.email, user.password);
    }

    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
      user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
        <button onClick={handleSignIn}>Sign in</button>
      }

      {
        user.isSignedIn && <div>
          <p>Welcome,{user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

        <h1>Our Own Authentication</h1>
        <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm" />
        <label htmlFor="switchForm">Returning User</label>
        <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
           <input type="email" onBlur={handleChange} name="email" placeholder="Enter Your Email" required />
           <br />
           <input type="password" onBlur={handleChange} name="password" placeholder="Type Your Password" required />
           <br />
           <input type="submit" value="signIn"/>
        </form>

        <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
           <input type="text" onBlur={handleChange} name="name" placeholder="Type Your Name" required />
           <br />
           <input type="email" onBlur={handleChange} name="email" placeholder="Type Your Email" required />
           <br />
           <input type="password" onBlur={handleChange} name="password" placeholder="Type Your Password" required />
           <br />
           <input type="submit" value="Create Account"/>
        </form>
        {
          user.error && <p style={{color: 'red'}}>{user.error}</p>
        }
    </div>
  );
}

export default App;
