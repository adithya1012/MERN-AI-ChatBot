import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/chat";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;

function App() {
  // console.log(useAuth()?.isLoggedIn);
  const auth = useAuth();
  return <main>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {auth?.isLoggedIn && auth.user && (<Route path="/chat" element={<Chat />} />)} {/* Protected Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
}

export default App
