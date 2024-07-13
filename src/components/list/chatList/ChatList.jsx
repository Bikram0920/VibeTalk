import React, { useEffect, useState } from 'react'
import "./chatList.css"
import AddUser from './addUser/AddUser';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../library/firebase';
import { useUserStore } from '../../library/userStore';
import { useChatStore } from '../../library/chatStore';


function ChatList() {
  const [chats,setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("")

  const {currentUser} = useUserStore();
  const { chatId,changeChat} = useChatStore();

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
        // console.log(chatData);
        setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt))
    });

    return () =>{
      unSub();
    }
  }, [currentUser?.id])

  const handleClick = async (chat) =>{

    const userChats = chats.map((item) =>{
      const { user, ...rest} = item;
      return rest;
    })

    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db,"userchats",currentUser.id);

    try {
      await updateDoc(userChatRef,{
        chats:userChats,
      })
      changeChat(chat.chatId,chat.user)
    } catch (error) {
      console.log(error)
    }
  }

  const filteredChats = chats.filter( c => c.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className='chatList' >
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' onChange={(e) => setInput(e.target.value)}/>
        </div>
        <img src={ addMode ? "./minus.png" : "./plus.png"} alt="" className='plus' onClick={() => setAddMode((prev) => !prev) }/>
      </div>
      {filteredChats.map((chat) => (
          <div className="item" 
          key={chat.chatId} 
          onClick={() => handleClick(chat)}
          style={
            {backgroundColor: chat?.isSeen? "transparent" :"#5183fe"}
          }>
          <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div> 
      ))}
      {addMode && <AddUser/>}
    </div>
  )
}

export default ChatList