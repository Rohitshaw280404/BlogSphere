import { Routes, Route} from "react-router-dom"
import Landingpage from "../Pages/landingpage"
import Login from "../Pages/login"
import Signup from "../Pages/signup";

function AppRoutes() {
  return (

    <Routes>
        <Route path = "/" element = {<Landingpage/>}/> v
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/signup" element = {<Signup/>}/>
    </Routes>
  );
}

export default AppRoutes  
