import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import './addUser.css';
import { db } from '../../../lib/firebase';
import { useContext, useState } from 'react';
import { UserContext } from '../../../context/usetContext';

const AddUser = () => {

  const {currentuser} = useContext(UserContext);

  const [user, setUser] = useState(null);

  const handleSearch = async (e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if(!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data())
      }
    }
    catch(err) {
      console.log(err);
    }
  };

  const handleAdd = async () =>{

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {

      const newChatRef = doc(chatRef);
      
      await setDoc(newChatRef,{
        createdAt: serverTimestamp(),
        messages: []
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentuser.id,
          updatedAt: Date.now(),
        })
      });

      await updateDoc(doc(userChatsRef, currentuser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        })
      });
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="addUser">
        <form onSubmit={handleSearch}>
            <input type="text" placeholder='username' name='username' />
            <button type='submit'>Search</button>
        </form>

        {user&& 
          <div className='user'>
          <div className="detail">
              <img src={user.avatar || "./avatar.png"} alt=""  />
              <span> {user.username} </span>
          </div>
          <button onClick={handleAdd}>Add User</button>
          </div>
        }

        

    </div>
  )
}

export default AddUser