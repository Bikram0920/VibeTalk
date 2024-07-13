import React from 'react'
import "./detail.css"
import { signOut } from 'firebase/auth'
import { auth, db } from '../library/firebase'
import { useChatStore } from '../library/chatStore'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useUserStore } from '../library/userStore'

function Detail() {

  const {user,chatId,isReceiverBlocked,isCurrentUserBlocked,changeBlock} = useChatStore();
  const {currentUser} = useUserStore();

  const handleBlock = async () =>{

    if(!user) return;

    const userRef = doc(db,"users",currentUser.id)
    try {
      updateDoc(userRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      })
      changeBlock();
    } catch (error) {
      console.log(error)
    }

  }


  return (
    <div className='detail' >
      <div className="info">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h3>{user?.username}</h3>
        <p>Everyday is a new beginning.</p>
      </div>
      <div className="more">
        <div className="items">
          <div className="item"> 
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="item"> 
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="item"> 
            <span>Shared Photos</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/karsten-wurth-0w-uTa0Xz7w-unsplash.jpg" alt="" />
                <span>photo_2024_2.png</span>
              </div>
                <img src="./download.png" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/karsten-wurth-0w-uTa0Xz7w-unsplash.jpg" alt="" />
                <span>photo_2024_2.png</span>
              </div>
                <img src="./download.png" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/karsten-wurth-0w-uTa0Xz7w-unsplash.jpg" alt="" />
                <span>photo_2024_2.png</span>
              </div>
                <img src="./download.png" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/karsten-wurth-0w-uTa0Xz7w-unsplash.jpg" alt="" />
                <span>photo_2024_2.png</span>
              </div>
                <img src="./download.png" alt="" />
            </div>
          </div>
          <div className="item"> 
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}
        </button>
        <button className='logout' onClick={() => auth.signOut()} >Logout</button>
      </div>
    </div>
  )
}

export default Detail