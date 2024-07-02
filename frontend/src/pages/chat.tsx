import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from "react-icons/io";
import { deleteUserChats, getUserChats, sendChatRequest } from '../helper/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"

// interface Part {
//     text: string;
// }
type Message = {
    role: "user" | "assistant";
    openai_response: string;
    gemini_response: string;
}

const Chat = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null)
    const auth = useAuth();
    const [chatMesssages, setChatMessages] = useState<Message[]>([]);
    const handleSubmit = async () => {
        // console.log(inputRef.current?.value);
        const data = inputRef.current?.value as string;
        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
        }
        // const newMessage: Message = { role: "user", content: content };
        // const newMessage: Message = { parts: [{ text: data }], role: "user" };
        const newMessage: Message = { openai_response: data, gemini_response: data, role: "user" };
        setChatMessages((prev) => [...prev, newMessage]);

        // Send the API Request to backend and get the result
        const chatData = await sendChatRequest(data);
        // console.log(chatData.chats);
        setChatMessages(chatData);
    };
    const handleDeletechats = async () => {
        try {
            toast.loading("Deleting Chats", { id: "deletechats" });
            await deleteUserChats();
            setChatMessages([]);
            toast.success("Deleted Chats Successfully", { id: "deletechats" });
        } catch (error) {
            console.log(error);
            toast.error("Deleting Chats Failed", { id: "deletechats" });
        }
    }
    // useEffect can be used but useLayoutEffect runs before it renders in the UI
    useLayoutEffect(() => {
        if (auth?.isLoggedIn && auth.user) {
            toast.loading("Loading Chats", { id: "loadchats" });
            getUserChats().then((data) => {
                setChatMessages(data);
                toast.success("Successfully loaded chats", { id: "loadchats" });
            }).catch((err) => {
                console.log(err);
                toast.error("Loading Failed", { id: "loadchats" });
            });
        }
    }, [auth]);
    // In the above line auth should be applied because without that when we refresh the page the chats are not loaded. we need to call the useLayoutEffect when there is any change in 'auth' values.

    // Following useEffect for navigating user to home page if he is not logged in and trying to access /chats
    useEffect(() => {
        if (!auth?.user) {
            return navigate("/login");
        }
    })
    return <Box sx={{ display: 'flex', flex: 1, width: "100%", height: "100%", mt: 3, gap: 3 }}>
        <Box sx={{ display: { md: 'flex', xs: "none", sm: "none" }, flex: 0.2, flexDirection: "column" }}>
            <Box sx={{ display: "flex", width: "100%", height: "60vh", bgcolor: "rgb(17,29,39)", borderRadius: 5, flexDirection: "column", mx: 3 }}>
                <Avatar sx={{ mx: "auto", my: 2, bgcolor: "white", color: "black", fontWeight: 700 }}>
                    {auth?.user?.name[0]}{auth?.user?.name.split("")[1][0]}
                </Avatar>
                <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
                    you are talking to a ChatBot
                </Typography>
                <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
                    {/* you can ask a questions related to knoledge, Business, Advices, education, etc. But avoid sharing personal information */}
                    This is the AI chatbot created by Adithya SN. You can ask a questions related to knoledge, Business, Advices, education, etc.
                </Typography>
                <Button onClick={handleDeletechats} sx={{ width: "200px", my: "auto", color: "white", fontWeight: 700, borderRadius: 3, mx: "auto", bgcolor: red[300], ":hover": { bgcolor: red.A400, }, }}>Clear Converzation</Button>
            </Box>
        </Box>
        <Box sx={{ display: "flex", flex: { md: 0.8, xs: 1, sm: 1 }, flexDirection: 'column', padding: 3, maxWidth: "100%", overflow: "auto" }}>
            <Typography sx={{ fontSize: "40px", color: "white", mb: 2, mx: "auto", fontWeight: 600 }}> Model - GPT 3.5 Turbo v/s gemini-1.5-flash</Typography>
            <Box sx={{ width: "100%", height: "60vh", borderRadius: 3, mx: "auto", display: 'flex', flexDirection: 'column', overflowX: "hidden", overflowY: "auto", scrollBehavior: "smooth" }}>
                {chatMesssages.map((chat, index) =>
                    // console.log(chat)
                    //@ts-ignore
                    // <div><ChatItem content={chat.content} role={chat.role} key={index}></ChatItem></div>
                    // <div><ChatItem content={chat.parts[0].text} role={chat.role} key={index}></ChatItem></div>
                    <div key={index}>
                        {/* {chat.parts.length > 0 ? ( */}
                        <ChatItem gemini_response={chat.gemini_response} openai_response={chat.openai_response} role={chat.role} />
                        {/*  ) : (
                            <span>No content available</span>
                         )} */}
                    </div>
                )}
            </Box>
            <div style={{ width: "100%", borderRadius: 8, backgroundColor: "rgb(17,27,39)", display: 'flex', margin: "auto" }}>
                {" "}
                <input ref={inputRef} type="text" style={{ width: "100%", backgroundColor: "transparent", padding: "30px", border: "none", outline: "none", color: 'white', fontSize: "20px" }} />
                <IconButton onClick={handleSubmit} sx={{ ml: "auto", color: 'white', mx: 1 }}><IoMdSend /></IconButton>
            </div>
        </Box>
    </Box >
}

export default Chat;
