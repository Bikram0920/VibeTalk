import React from 'react'
import "./detail.css"

function Detail() {
  return (
    <div className='detail' >
      <div className="info">
        <img src="./avatar.png" alt="" />
        <h2>Bikram</h2>
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
        <button>Block User</button>
        <button>Logout</button>
      </div>
    </div>
  )
}

export default Detail