import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from "react-icons/io";
import { deleteUserChats, getUserChats, sendChatRequest } from '../helper/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"

// const chat_messsages = [
//     {
//         "role": "user",
//         "content": "Hi, can you help me with some information?"
//     },
//     {
//         "role": "assistant",
//         "content": "Of course! What do you need help with?"
//     },
//     {
//         "role": "user",
//         "content": "Can you tell me the weather forecast for today?"
//     },
//     {
//         "role": "assistant",
//         "content": "Sure, please provide your location so I can look up the weather forecast."
//     },
//     {
//         "role": "user",
//         "content": "I'm in New York City."
//     },
//     {
//         "role": "assistant",
//         "content": "The weather forecast for New York City today is mostly sunny with a high of 75°F (24°C) and a low of 60°F (16°C)."
//     },
//     {
//         "role": "user",
//         "content": "Thank you! Can you also recommend a good book to read?"
//     },
//     {
//         "role": "assistant",
//         "content": "Sure! If you enjoy fiction, I recommend 'The Great Gatsby' by F. Scott Fitzgerald. It's a classic novel set in the Jazz Age."
//     },
//     {
//         "role": "user",
//         "content": "That sounds great. I'll check it out. Thanks!"
//     },
//     {
//         "role": "assistant",
//         "content": "You're welcome! If you have any other questions, feel free to ask."
//     }
// ]

type Message = {
    role: "user" | "assistant";
    content: string;
}

const Chat = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null)
    const auth = useAuth();
    const [chatMesssages, setChatMessages] = useState<Message[]>([]);
    const handleSubmit = async () => {
        // console.log(inputRef.current?.value);
        const content = inputRef.current?.value as string;
        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
        }
        const newMessage: Message = { role: "user", content: content };
        setChatMessages((prev) => [...prev, newMessage]);

        // Send the API Request to backend and get the result
        const chatData = await sendChatRequest(content);
        setChatMessages([...chatData.chats]);
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
                setChatMessages([...data.chats]);
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
                    you can ask a questions related to knoledge, Business, Advices, education, etc. But avoid sharing personal information
                </Typography>
                <Button onClick={handleDeletechats} sx={{ width: "200px", my: "auto", color: "white", fontWeight: 700, borderRadius: 3, mx: "auto", bgcolor: red[300], ":hover": { bgcolor: red.A400, }, }}>Clear Converzation</Button>
            </Box>
        </Box>
        <Box sx={{ display: "flex", flex: { md: 0.8, xs: 1, sm: 1 }, flexDirection: 'column', padding: 3 }}>
            <Typography sx={{ fontSize: "40px", color: "white", mb: 2, mx: "auto", fontWeight: 600 }}>GPT-3.5 Turbo</Typography>
            <Box sx={{ width: "100%", height: "60vh", borderRadius: 3, mx: "auto", display: 'flex', flexDirection: 'column', overflow: "scroll", overflowX: "hidden", overflowY: "auto", scrollBehavior: "smooth" }}>
                {chatMesssages.map((chat, index) =>
                    //@ts-ignore
                    <div><ChatItem content={chat.content} role={chat.role} key={index}></ChatItem></div>
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
