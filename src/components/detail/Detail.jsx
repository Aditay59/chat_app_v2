import { useContext } from 'react'
import { auth, db } from '../../lib/firebase'
import './detail.css'
import { UserContext } from '../../context/usetContext'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Detail = () => {

  const { currentuser, user, isReceiverBlocked, isCurrentUserBlocked, changeBlock, resetChat } = useContext(UserContext);

  const handleBlock = async () =>{
    if(!user) return;

    const userDocRef = doc(db, "users",currentuser.id);

    try {
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock();
    } catch(err) {
      console.log(err);
    }
  }

  const handleLogout = () =>{
    auth.signOut();
    resetChat();
  }

  return (
    <div className="detail">
      
      <div className="user">
        <img src={user?.avatar || './avatar.png'} alt="" />
        <h2> {user?.username} </h2>
        <p>Lorem, ipsum dolor sit.</p>
      </div>
      
      <div className="info">
        
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.imgur.com/H6YM808.jpeg" alt="" />
                <span>photo_2024_69.png</span>
              </div>
              <img src="./download.png" alt="" className='icon' />
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.imgur.com/H6YM808.jpeg" alt="" />
                <span>photo_2024_69.png</span>
              </div>
              <img src="./download.png" alt="" className='icon' />
            </div>          
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <button onClick={handleBlock}>
          {isCurrentUserBlocked? "You are Blocked!" : isReceiverBlocked ? "Unblock User" : "Block User"}
        </button>
        <button className='logout' onClick={handleLogout}>Logout</button>
      
      </div>
    
    </div>
  )
}

export default Detail