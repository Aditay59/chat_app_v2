import { toast } from 'react-toastify';
import './login.css'
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import upload from '../../lib/upload';


const Login = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [avatar, setAvatar] = useState({
        file:null,
        url: ""
    })

    const handleAvatar = (e) =>{
        if(e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleLogin = async (e) =>{
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);

        const {email, password} = Object.fromEntries(formData);

        try {

            await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged IN");
        } 
        catch(err) {
            console.log(err);
            toast.error(err.message);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    const handleRegister = async (e) =>{
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        //checking for empty field values
        if(!username || !email || !password) {
            return toast.warn("Please fill the details");
        }
        if(!avatar.file) {
            return toast.warn("Please upload an avatar");
        }

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querysnapshot = await getDocs(q);
        if(!querysnapshot.empty) {
            return toast.warn("Username already taken!");
        }
        setIsSubmitting(true);
        try {
            
            const response = await createUserWithEmailAndPassword(auth, email, password);

            const imgUrl = await upload(avatar.file);

            await setDoc(doc(db, "users", response.user.uid),{
                username,
                email,
                avatar: imgUrl,
                id: response.user.uid,
                blocked: []
            });

            await setDoc(doc(db, "userchats", response.user.uid),{
                chats: [],
            });

            toast.success("Account Created Successfully");
        
        } catch(err) {
            console.log(err);
            toast.error(err.message)
        }
        finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className="login">
        <div className="item">
            <h2 className='text-xl'>Welcome Back</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Email" name="email" required />
                <input type="password" placeholder="Password" name="password" required />
                <button type='submit' disabled={isSubmitting}>{isSubmitting? "Loading..." : "Sign In"}</button>
            </form>
        </div>
        
        <div className="seperator"></div>
        <div className="item">

        <h2>Create an account</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="file">
                    <img src={avatar.url || "./avatar.png"} alt="" />
                    Upload an image</label>
                <input type="file" id="file" name='avatar' style={{display:'none'}} onChange={handleAvatar} />
                <input type="text" placeholder="username" name="username" required />
                <input type="text" placeholder="Email" name="email" required />
                <input type="password" placeholder="Password" name="password" required />
                <button type='submit' disabled={isSubmitting} className={isSubmitting? 'disabled':''} > {isSubmitting? "Loading...": "Sign Up"} </button>
            </form>

        </div>
    </div>
  )
}

export default Login