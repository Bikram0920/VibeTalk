import React, {useState} from 'react'
import "./login.css"
import { toast } from 'react-toastify'
import {createUserWithEmailAndPassword} from 'firebase/auth'

function Login() {

  const [avatar, setAvatar] = useState(
    {
      file:null,
      url:''
    }
  )

  const handleAvatar = (e) =>{
    if(e.target.files[0]){
      setAvatar({
        file:e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleLogin = e =>{
    e.preventDefault();

  }

  const handleRegister = async (e) =>{
    e.preventDefault();

    const formData = new FormData(e.target)

    const {username, email, password,cpassword} = Object.fromEntries(formData);

    if(password != cpassword){
      toast.error("Password and Confirm Password must be same")
    }

    try {
      
      const res = await createUserWithEmailAndPassword(auth,email,password)

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <div className="login">
      <div className="item1">
        <h2>Welcome Back,</h2>
        <form action="" onSubmit={handleLogin}>
          <input type="email" placeholder='Enter Email...'name='email'/>
          <input type="password" placeholder='Enter Password...' name='password'/>
          <button>Sign In</button>
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
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default Login