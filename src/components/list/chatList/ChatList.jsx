import React, { useEffect, useState } from 'react'
import "./chatList.css"
import AddUser from './addUser/AddUser';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../library/firebase';
import { useUserStore } from '../../library/userStore';

function ChatList() {
  const [chats,setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);

  const {currentUser} = useUserStore();

  useEffect(() => {

    if (!currentUser?.id) return;

    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;
      // console.log(items)
      const promises = items.map(async (item) =>{
        const userDocRef = doc(db, "users", item.recieverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();
        // console.log(user)
        return {...item,user}
      })
      const chatData = await Promise.all(promises);
        console.log(chatData);
        setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt))
    });

    return () =>{
      unSub();
    }
  }, [currentUser?.id])

  return (
    <div className='chatList' >
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' />
        </div>
        <img src={ addMode ? "./minus.png" : "./plus.png"} alt="" className='plus' onClick={() => setAddMode((prev) => !prev) }/>
      </div>
      {chats.map((chat) => (
          <div className="item" key={chat.chatId}>
          <img src={chat.user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div> 
      ))}
      {addMode && <AddUser/>}
    </div>
  )
}

export default ChatList