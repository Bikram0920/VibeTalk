import React, { useEffect, useState } from 'react'
import "./detail.css"
import { signOut } from 'firebase/auth'
import { auth, db } from '../library/firebase'
import { useChatStore } from '../library/chatStore'
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useUserStore } from '../library/userStore'

function Detail() {
  const [chat, setChat] = useState({ messages: [] });
  const {user,chatId,isReceiverBlocked,isCurrentUserBlocked,changeBlock} = useChatStore();
  const {currentUser} = useUserStore();
  const [img, setImg] = useState(false);

  const handleImg = (e) =>{
    setImg(!img);
  }


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

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data() || { messages: [] });
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  // console.log(chat)

  const imageMessages = chat.messages.filter(message => message.hasOwnProperty('img'));

  // imageMessages.map((message) => {
  //   console.log(message.img)
  // })

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link); // Append to the body to work in Firefox
    link.click();
    document.body.removeChild(link); // Clean up by removing the link
  };


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
            <img src={img ? "./arrowDown.png" : "./arrowUp.png"} alt="" onClick={handleImg}/>
          </div>
          {img && <div className="photos">
            {(imageMessages.length > 0) && imageMessages.map((message,index) => (
                <div className="photoItem" key={index}>
                  <div className="photoDetail" >
                    <img src={message.img} alt="" />
                    <span>{message.text}</span>
                  </div>
                    <img src="./download.png" alt="" onClick={() => handleDownload(message.img,message.text)}/>
              </div>
            ))}
          </div>}
          <div className="item"> 
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="buttons">
        <button onClick={handleBlock}>
          {isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}
        </button>
        <button className='logout' onClick={() => auth.signOut()} >Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Detail