import React,{useState, useRef, useEffect} from 'react'
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'

function Chat() {

  const [click, setClick] = useState(false);
  const [message, setMessage] = useState("");

  const endRef = useRef(null);

useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [])


  const handleEmoji = e => {
    setMessage((prev) => prev + e.emoji);
    setClick(false);
  }

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Bikram</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eveniet nesciunt impedit doloribus esse dolorum rem excepturi aliquid quas ipsum.</p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
          <img src="/karsten-wurth-0w-uTa0Xz7w-unsplash.jpg" alt="" />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eveniet nesciunt impedit doloribus esse dolorum rem excepturi aliquid quas ipsum.</p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eveniet nesciunt impedit doloribus esse dolorum rem excepturi aliquid quas ipsum.</p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eveniet nesciunt impedit doloribus esse dolorum rem excepturi aliquid quas ipsum.</p>
            <span>1 min ago</span>
          </div>
        </div>
        <div ref={endRef} ></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" value = {message} placeholder='Type a message...'  onChange={(e) => setMessage(e.target.value)} />
        <div className="emojis">
          <img src="./emoji.png" alt="" onClick={() => setClick(prev => !prev) }/>
          <div className="picker">
          <EmojiPicker open={click} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  )
}

export default Chat