import React, { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { auth, db } from "../library/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import upload from "../library/upload";

function Login() {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const handleSignupClick = () => {
    setIsLogin(false);
  };

  const handleLoginClick = () => {
    setIsLogin(true);
  };

  const handleSignupLinkClick = (e) => {
    e.preventDefault();
    setIsLogin(false);
  };

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLogin(false);
    setLoading(true);

    const formData = new FormData(e.target);

    const { username, email, password} =
      Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imageURL = await upload(avatar.file);
      // Add the user to the database
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        password,
        avatar: imageURL,
        id: res.user.uid,
        blocked: [],
      });
      // fetch the chats of the user
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("User registered successfully! You can login now!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      // window.location.reload();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLogin(true);
    setLoading(true);

    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user);
      return user;
    } catch (error) {
      console.error("Error signing in:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(true);
    }
  };

  return (
    <>
      {/* <div className="login">
        <div className="item1">
          <h2>Welcome Back,</h2>
          <form action="" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button disabled={loading}>
              {loading ? "Loading" : "Sign In"}
            </button>
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
                id="file"
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={handleAvatar}
              />
            </div>
            <input type="text" placeholder="Username" name="username" />
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <input
              type="password"
              placeholder="Confirm Password"
              name="cpassword"
            />
            <button disabled={loading}>
              {loading ? "Loading" : "Sign Up"}
            </button>
          </form>
        </div>
      </div> */}

      <div className="wrapper">
        <div className="title-text">
          <div className={`title ${isLogin ? "login" : "signup"}`}>
            {isLogin ? "Login Form" : "Signup Form"}
          </div>
        </div>
        <div className="form-container">
          <div className="slide-controls">
            <input
              type="radio"
              name="slide"
              id="login"
              checked={isLogin}
              readOnly
            />
            <input
              type="radio"
              name="slide"
              id="signup"
              checked={!isLogin}
              readOnly
            />
            <label
              htmlFor="login"
              className="slide login"
              onClick={handleLoginClick}
            >
              Login
            </label>
            <label
              htmlFor="signup"
              className="slide signup"
              onClick={handleSignupClick}
            >
              Signup
            </label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            <form
              action=""
              className="login"
              style={{ display: isLogin ? "block" : "none" }}
              onSubmit={handleLogin}
            >
              <div className="field">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  required
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input disabled = {loading} type="submit" value = {loading ? "Loading" : "Login"} />
              </div>
              <div className="signup-link">
                Not a member?{" "}
                <a href="" onClick={handleSignupLinkClick}>
                  Signup now
                </a>
              </div>
            </form>
            <form
              action=""
              className="signup"
              style={{ display: isLogin ? "none" : "block" }}
              onSubmit={handleRegister}
            >
              <div className="field">
                <div className="avatar">
                  <img src={avatar.url || "./avatar.png"} alt="" />
                  <label htmlFor="file">Upload an Avatar</label>
                  <input
                    type="file"
                    id="file"
                    accept=".jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={handleAvatar}
                  />
                </div>
              </div>
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  required
                />
              </div>
              <div className="field">
                <input
                  type="text"
                  placeholder="Email Address"
                  name="email"
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  required
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input disabled = {loading} type="submit" value = {loading ? "Loading" : "Sign Up"}/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
