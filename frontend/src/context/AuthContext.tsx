import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { checkAuthStatus, loginUser, signupUser, userLogout } from "../helper/api-communicator.js";


type User = {
    name: string;
    email: string;
};

type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // fetch if the user's cookies are valid then skip login
        async function checkStatus() {
            const data = await checkAuthStatus();
            if (data) {
                setUser({ email: data.email, name: data.name });
                setIsLoggedIn(true);
            }
        }
        checkStatus()
    }, []);
    const login = async (email: string, password: string) => {
        const data = await loginUser(email, password);
        // console.log(data);
        if (data) {
            setUser({ email: data.email, name: data.name });
            setIsLoggedIn(true);
        }
        // else {
        //     setUser(null);
        //     setIsLoggedIn(false);
        // }

    };
    const signup = async (name: string, email: string, password: string) => {
        const data = await signupUser(name, email, password);
        // console.log(data);
        if (data) {
            setUser({ email: data.email, name: data.name });
            setIsLoggedIn(true);
        }
        // else {
        //     setUser(null);
        //     setIsLoggedIn(false);
        // }
    };
    const logout = async () => {
        await userLogout();
        setIsLoggedIn(false);
        setUser(null);
        window.location.reload(); // reloading is necessary, because once we remove the cookies the it might take some time hence we are refreshing.
    };

    const value = {
        user, isLoggedIn, login, logout, signup,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);

