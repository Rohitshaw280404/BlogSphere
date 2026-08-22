import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {

    const { login, loading } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            await login(email, password);

            navigate("/");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    };


    return (
        <main>

            <h1>Login</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>

            </form>

        </main>
    );
};

export default Login;