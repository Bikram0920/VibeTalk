import React, { useState } from 'react'
import "./userInfo.css"
import { useUserStore } from "../../../components/library/userStore";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../library/firebase';

function UserInfo() {

  const {currentUser} = useUserStore();
  const [bio, setBio] = useState(false)

  const handleBio = () => {
    setBio(!bio);
  }

  const addBio = async (e) => {

    e.preventDefault();
    const data = new FormData(e.target);
    const {userBio} = Object.fromEntries(data);

    console.log(userBio)

    const userRef = doc(db,"users",currentUser.id)

    try {
      updateDoc(userRef,{
        userBio,
      })
      handleBio();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='userInfo' >
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h4>{currentUser.username}</h4>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" onClick={handleBio}/>

        {bio && <div className="bio">
          <form action="" onSubmit={addBio}>
            <input type="text" name="userBio" placeholder='Add Bio'/>
            <button type='submit'>Add</button>
          </form>
        </div>}

      </div>
    </div>
  )
}

export default UserInfo