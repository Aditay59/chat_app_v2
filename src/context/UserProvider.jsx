import { useState } from "react"
import { UserContext } from "./usetContext"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";


// eslint-disable-next-line react/prop-types
export const UserProvider = ({children}) => {

    const [currentuser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [chatId, setChatId] = useState(null);
    const [user, setUser] = useState(null);
    const [isCurrentUserBlocked, setIsCurrentUserBlocked] = useState(false);
    const [isReceiverBlocked, setIsReceiverBlocked] = useState(false);


    const fetchInfo = async (uid) =>{
        if(!uid) {
            setIsLoading(false);
            setCurrentUser(null);
        }

        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                setCurrentUser(docSnap.data());
                setIsLoading(false);
            } else {
                setCurrentUser(null);
                setIsLoading(false);
            }

        } catch(err) {
            console.log(err);
        }
    }


    const changeChat = (chatId, user) =>{

        if(user.blocked.includes(currentuser.id)) {
            setUser(null);
            setIsCurrentUserBlocked(true);
            setIsReceiverBlocked(false);
            setChatId(chatId);
            return;
        }
        
        if(currentuser.blocked.includes(user.id)) {
            setUser(user);
            setIsCurrentUserBlocked(false);
            setIsReceiverBlocked(true);
            setChatId(chatId);
            return;
        } 
            
        setUser(user)
        setIsCurrentUserBlocked(false);
        setIsReceiverBlocked(false);
        setChatId(chatId);
    }

    const changeBlock = () =>{
        setIsReceiverBlocked(prev=>!prev);
    }

    const resetChat = () => {
        setChatId(null);
        setUser(null);
        setIsCurrentUserBlocked(false);
        setIsReceiverBlocked(false);
    };

  return (
    <UserContext.Provider value={{currentuser, isLoading, fetchInfo, changeChat, changeBlock, user, isCurrentUserBlocked, isReceiverBlocked, chatId, resetChat}}>
        {children}
    </UserContext.Provider>
  )
}
