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
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Public routes */}

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


                {/* Protected routes */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/create-post"
                        element={<CreatePost />}
                    />

                    <Route
                        path="/edit-post/:id"
                        element={<EditPost />}
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;