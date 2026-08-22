import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // Get currently logged-in user
    const getCurrentUser = async () => {

        try {

            const response = await api.get("/auth/me");

            setUser(response.data.data);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        getCurrentUser();
    }, []);


    const login = async (email, password) => {

        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            const loggedInUser =
                response.data.data.user;

            setUser(loggedInUser);

            return response.data;

        } finally {

            setLoading(false);

        }
    };


    const register = async (
        username,
        email,
        password,
        fullName
    ) => {

        const response = await api.post(
            "/auth/register",
            {
                username,
                email,
                password,
                fullName
            }
        );

        return response.data;
    };


    const logout = async () => {

        try {

            await api.post("/auth/logout");

        } finally {

            setUser(null);

        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                getCurrentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};