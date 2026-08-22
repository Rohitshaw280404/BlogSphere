import {
    Link,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const {
        user,
        logout
    } = useAuth();

    const navigate = useNavigate();


    const handleLogout = async () => {

        await logout();

        navigate("/login");
    };


    return (
        <nav className="border-b bg-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}

                <Link
                    to="/"
                    className="text-2xl font-bold text-gray-900"
                >
                    Blog<span className="text-blue-600">Platform</span>
                </Link>


                {/* Navigation */}

                <div className="flex items-center gap-6">

                    <Link
                        to="/"
                        className="text-gray-600 transition hover:text-blue-600"
                    >
                        Home
                    </Link>


                    {user ? (
                        <>
                            <Link
                                to="/create-post"
                                className="text-gray-600 transition hover:text-blue-600"
                            >
                                Create Post
                            </Link>

                            <Link
                                to="/dashboard"
                                className="text-gray-600 transition hover:text-blue-600"
                            >
                                Dashboard
                            </Link>

                            <span className="font-medium text-gray-800">
                                {user.fullName}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-600 transition hover:text-blue-600"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
};

export default Navbar;