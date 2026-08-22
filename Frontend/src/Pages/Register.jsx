import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {

    const { register } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await register(
                formData.username,
                formData.email,
                formData.password,
                formData.fullName
            );

            navigate("/login");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <main>

            <h1>Create Account</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Register"}
                </button>

            </form>

            <p>
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </main>
    );
};

export default Register;