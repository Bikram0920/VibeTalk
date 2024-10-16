import React, { useState, useRef, useEffect } from 'react';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../library/firebase';
import { useChatStore } from '../library/chatStore';
import { useUserStore } from '../library/userStore';
import upload from '../library/upload';

function Chat() {
  const [chat, setChat] = useState({ messages: [] });
  const [click, setClick] = useState(false);
  const [text, setText] = useState('');
  const [img, setImg] = useState({
    file: null,
    url: '',
  });

  const { chatId, user,isReceiverBlocked,isCurrentUserBlocked} = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data() || { messages: [] });
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImg({
        file,
        url,
      });
    }
  };

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setClick(false);
  };

  const handleSend = async (e) => {
    if (text === '') return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      console.log(imgUrl);

      const chatRef = doc(db, 'chats', chatId);

      await updateDoc(chatRef, {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      // Update the chat list item
      const userIDs = [currentUser.id, user.id];

      for (const id of userIDs) {
        const userChatsRef = doc(db, 'userchats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setImg({
      file: null,
      url: '',
    });
    setText('');
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{user?.userBio}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? 'message own' : 'message'} key={message.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              {/* {<span>1 min ago</span>} */}
            </div>
          </div>
        ))}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="image">
            <img src="./img.png" alt="" />
          </label>
          <input type="file" id="image" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" value={text} placeholder={(isCurrentUserBlocked || isReceiverBlocked)? "You cannot send message" : "Type a text..."} onChange={(e) => setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
        <div className="emojis">
          <img src="./emoji.png" alt="" onClick={() => setClick((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={click} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
