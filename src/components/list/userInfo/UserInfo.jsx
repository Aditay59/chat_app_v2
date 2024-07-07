import './userinfo.css'
import { useContext } from 'react'
import { UserContext } from '../../../context/usetContext';

const UserInfo = () => {

  const {currentuser} = useContext(UserContext);


  return (
    <div className="userInfo">
        
        <div className="user">
            <img src={ currentuser.avatar || "./avatar.png"} alt="profile" />
            <h2> {currentuser.username} </h2>
        </div>
        
        <div className="icons flex gap-3">
            <img src="./more.png" alt="more_icon" />
            <img src="./video.png" alt=" video_call_button" />
            <img src="./edit.png" alt=" edit_button" />
        </div>
    </div>
  )
}

export default UserInfo