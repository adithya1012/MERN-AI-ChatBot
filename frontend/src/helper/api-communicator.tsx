import axios from "axios";
import { Component } from "react";

export const loginUser = async (email: string, password: string) => {

    const res = await axios.post("/user/login", { email, password });

    if (res.status !== 200) {
        throw new Error("Unable to Login");
    }
    const data = await res.data;
    return data;
};

export const signupUser = async (name: string, email: string, password: string) => {

    const res = await axios.post("/user/signup", { name, email, password });

    if (res.status !== 201) {
        throw new Error("Unable to Signup");
    }
    const data = await res.data;
    return data;
};

export const checkAuthStatus = async () => {

    const res = await axios.get("/user/auth-status");

    if (res.status !== 200) {
        throw new Error("Unable to Authenticate");
    }
    const data = await res.data;
    return data;
};

export const sendChatRequest = async (message: string) => {
    const res_gemeni = await axios.post("/chat/new_gemini", { message });
    if (res_gemeni.status !== 200) {
        throw new Error("Unable to send chat to Gemini API! ");
    }
    const data_gemini = await res_gemeni.data;
    console.log(data_gemini.chats)
    const res_openai = await axios.post("/chat/new_openai", { message });
    if (res_openai.status !== 200) {
        throw new Error("Unable to send chat to Openai API! ");
    }
    const data_openai = await res_openai.data;
    // console.log(data_openai)
    // data_openai.parts = data_gemini.parts


    console.log(data_openai.chats)

    // create a for loop to create a conbined object of gemini and openai responses

    interface CombinedObject {
        role: "user" | "assistant";
        openai_response: string;
        gemini_response: string;
    }

    const data: CombinedObject[] = data_openai.chats.map((item: any, index: number) => ({
        role: item.role,
        openai_response: item.content,
        gemini_response: data_gemini.chats[index].parts[0].text
    })
    );
    // console.log(data)
    return data;
};

export const getUserChats = async () => {

    const res_gemini = await axios.get("/chat/all-chats_gemini");
    if (res_gemini.status !== 200) {
        throw new Error("Unable to send chat from Gemini API");
    }
    const data_gemini = await res_gemini.data;

    const res_openai = await axios.get("/chat/all-chats_openai");
    if (res_openai.status !== 200) {
        throw new Error("Unable to send chat from OpenAI API");
    }
    const data_openai = await res_openai.data;

    interface CombinedObject {
        role: "user" | "assistant";
        openai_response: string;
        gemini_response: string;
    }

    const data: CombinedObject[] = data_openai.chats.map((item: any, index: number) => ({
        role: item.role,
        openai_response: item.content,
        gemini_response: data_gemini.chats[index].parts[0].text
    })
    );

    return data;
};

export const deleteUserChats = async () => {

    const res_gemini = await axios.delete("/chat/delete_gemini");
    if (res_gemini.status !== 200) {
        throw new Error("Unable to delete chat! ");
    }
    // const data_gemini = await res_gemini.data;

    const res_openai = await axios.delete("/chat/delete_openai");
    if (res_openai.status !== 200) {
        throw new Error("Unable to delete chat! ");
    }
    // const data_openai = await res_openai.data;
    // return data_openai; 
};

export const userLogout = async () => {

    const res = await axios.get("/user/logout");
    if (res.status !== 200) {
        throw new Error("Unable to Logout! ");
    }
    const data = await res.data;
    return data;
};