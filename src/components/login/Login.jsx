import React, {useState} from 'react'
import "./login.css"
import { toast } from 'react-toastify'
import {auth, db} from '../library/firebase'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import upload from '../library/upload'

function Login() {

  const [avatar, setAvatar] = useState(
    {
      file:null,
      url:''
    }
  )

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) =>{
    if(e.target.files[0]){
      setAvatar({
        file:e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleRegister = async (e) =>{
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target)

    const {username, email, password,cpassword} = Object.fromEntries(formData);

    if(password != cpassword){
      toast.error("Password and Confirm Password must be same")
    }

    try {

      const res = await createUserWithEmailAndPassword(auth,email,password);

      const imageURL = await upload(avatar.file);
      // Add the user to the database
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        password,
        avatar:imageURL,
        id: res.user.uid,
        blocked:[],
      });
      // fetch the chats of the user
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats:[],
      });
      
      toast.success("User registered successfully! You can login now!");

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally{
      setLoading(false);
      // window.location.reload();
    }
  }

  const handleLogin = async (e) =>{
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target)

    const {email, password} = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in:', user);
      return user;
    } catch (error) {
      console.error('Error signing in:', error.message);
      toast.error(error.message);
    } finally{
      setLoading(true);
    }

  }

  return (
    <div className="login">
      <div className="item1">
        <h2>Welcome Back,</h2>
        <form action="" onSubmit={handleLogin}>
          <input type="email" placeholder='Email'name='email'/>
          <input type="password" placeholder='Password' name='password'/>
          <button disabled = {loading}>{loading? "Loading" : "Sign In" }</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item2">
        <h2>Create an Account</h2>
        <form action="" onSubmit={handleRegister}>
          <div className="avatar">
          <img src={avatar.url || "./avatar.png"} alt="" />
          <label htmlFor="file">Upload an Avatar</label>
          <input 
          type="file" 
          id='file' 
          accept='.jpg,.jpeg,.png' 
          style={{display:'none'}} 
          onChange={handleAvatar} />
          </div>
          <input type="text" placeholder='Username' name='username'/>
          <input type="email" placeholder='Email' name='email'/>
          <input type="password" placeholder='Password' name='password'/>
          <input type="password" placeholder='Confirm Password' name='cpassword'/>
          <button disabled={loading}>{loading? "Loading" : "Sign Up" }</button>
        </form>
      </div>
    </div>
  )
}

export default Login