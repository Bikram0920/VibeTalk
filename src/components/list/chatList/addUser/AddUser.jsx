import React, { useState } from 'react'
import "./addUser.css"
import {db} from "../../../library/firebase"
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { useUserStore } from '../../../library/userStore';

function AddUser() {
  
  const [user,setUser] = useState(null);

  const {currentUser} = useUserStore();

  const handleSearch = async (e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('userName');

    try {
      const userRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(userRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data())
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleAdd = async (e) =>{
    
    const chatRef = collection(db,"chats")
    const userChatRef = collection(db,"userchats")

    try {
      const newChatRef = doc(chatRef)

      await setDoc(newChatRef,{
        createdAt: serverTimestamp(),
        messages:[]
      });
      
      await updateDoc(doc(userChatRef, user.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:"",
          recieverId:currentUser.id,
          updatedAt: Date.now(),
        })
      })

      await updateDoc(doc(userChatRef, currentUser.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:"",
          recieverId:user.id,
          updatedAt: Date.now(),
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='addUser' >
      <form onSubmit={handleSearch} >
        <input type="text" name='userName' placeholder='UserName' />
        <button>Search</button>
      </form>
      {user && <div className="user">
        <div className='details'>
          <img src={user.avatar || "avatar.png"} alt="" />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd} >Add User</button>
      </div>}
    </div>
  )
}

export default AddUser