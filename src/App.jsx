import { useContext, useEffect } from 'react';
import './styles/App.css';
import Chat from './components/chat/Chat';
import Detail from './components/detail/Detail';
import List from './components/list/List';
import Login from './components/login/Login';
import Notification from './components/notification/Notification';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { UserContext } from './context/usetContext';

const App = ()=> {

  const {currentuser, isLoading, fetchInfo, chatId} = useContext(UserContext);

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user)=>{
      fetchInfo(user?.uid);
    });
    return () =>{
      unSub();
    };
  },[fetchInfo]);

  if(isLoading) return <div className='loading'>Loading...</div>

  return (
      <div className="container">
        {currentuser ? (
          <>
            <List />
            {chatId&& <Chat />}
            {chatId&& <Detail />}
          </>
        ):(
          <Login/>
        )}
        <Notification />
      </div>
  )
}

export default App
