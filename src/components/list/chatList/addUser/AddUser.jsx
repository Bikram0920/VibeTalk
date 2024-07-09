import React from 'react'
import "./addUser.css"

function AddUser() {
  return (
    <div className='addUser' >
      <form action="">
        <input type="text" name='userName' placeholder='UserName' />
        <button>Search</button>
      </form>
      <div className="user">
        <div className='details'>
          <img src="avatar.png" alt="" />
          <span>Bikram</span>
        </div>
        <button>Add User</button>
      </div>
    </div>
  )
}

export default AddUser