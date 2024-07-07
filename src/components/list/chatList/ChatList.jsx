import { useContext, useEffect, useState } from "react"
import './chatlist.css'
import AddUser from "../addUser/AddUser";
import { UserContext } from "../../../context/usetContext";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const ChatList = () => {

    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const [input, setInput] = useState("");

    const {currentuser, changeChat} = useContext(UserContext);


    useEffect(()=>{
        const unSub = onSnapshot(doc(db, "userchats", currentuser.id), async (res)=>{
            const items = res.data().chats;

            const promises = items.map(async (item)=>{
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return {...item, user }
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt));
        })

        return ()=>{
            unSub();
        }
    },[currentuser.id])

    const handleSelect = async (chat) =>{

        const userChats = chats.map((item)=>{
            // eslint-disable-next-line no-unused-vars
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(item=>item.chatId=== chat.chatId);

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentuser.id);

        try {

            await updateDoc(userChatsRef,{
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user)
        } catch(err) {
            console.log(err);
        }
    };

    const filteredChats = chats.filter(c=>c.user.username.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="chatList">
        
        <div className="search">
            <div className="searchBar">
                <img src="./search.png" alt="search_lens" />
                <input type="text" placeholder="search" value={input} onChange={(e)=>{setInput(e.target.value)}}  />
            </div>
            <img onClick={()=>setAddMode(prev=>!prev)} className="add" src={addMode? './minus.png':'./plus.png'} alt="add_icon" />
        </div>

        {filteredChats.map(chat=>(
            <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)} style={{backgroundColor: chat?.isSeen ? "transparent" : "#5183fe"}} >
            <img src={ chat.user.blocked.includes(currentuser.id)? "./avatar.png" : chat.user.avatar ||"./avatar.png"} alt="users_profile" />
            <div className="texts">
                <span> {chat.user.blocked.includes(currentuser.id)? "User" : chat.user.username} </span>
                <p> {chat.lastMessage} </p>
            </div>
        </div>
        ))}
        {addMode&& <AddUser />}
    
    </div>
  )
}

export default ChatList