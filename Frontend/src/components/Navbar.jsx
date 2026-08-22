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
        <nav>

            <Link to="/">
                Blog Platform
            </Link>


            <div>

                <Link to="/">
                    Home
                </Link>


                {user ? (
                    <>
                        <span>
                            Welcome, {user.fullName}
                        </span>

                        <button
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
};

export default Navbar;