import { Route, Routes} from 'react-router-dom'
import Landingpage from "../Pages/landingpage"
import Signup from "../Pages/signup"
import Login from "../Pages/login"

export default function Approute() {
    return (
    <Routes>    
        <Route path="/" element={<Landingpage/>}  />
        <Route path="/login" element={<Login/>}  />
        <Route path="/signup" element={<Signup/>}  />

    </Routes>
    )
    }