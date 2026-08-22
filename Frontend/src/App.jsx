import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";


function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/posts/:id"
                    element={<PostDetails />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;