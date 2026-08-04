import login from './login.jsx'
import signup from './signup.jsx'
import { useNavigate } from "react-router-dom"



export default function Landingpage() {
    const navigate = useNavigate();
    return (

        <div className="min-h-screen w-screen bg-red-500 flex flex-col items-center justify-center">

            <div className="text-center">
                <h1 className="text-white text-5xl font-bold">
                    Publish your thoughts, your story, your learning.
                </h1>

                <p className="text-white text-2xl font-light mt-4">
                    Create a unique and beautiful blog easily.
                </p>
            </div>

            <button className="mt-10 bg-amber-800 text-white px-8 py-3 rounded-lg text-xl hover:bg-amber-700"
            onClick={() => window.alert("You need to login or signup to write your blog!")}>
                Write your blog!
            </button>

            <div className="flex items-center justify-center mt-4 gap-2">
            <button 
             onClick={() => navigate("/login")}
             className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg text-xl hover:bg-blue-400 ">
                login
            </button>

            <button
              onClick={() => navigate("/signup")}
             className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg text-xl hover:bg-green-400 ">
                Sign up
            </button> 
            </div>
        </div>
    );
}