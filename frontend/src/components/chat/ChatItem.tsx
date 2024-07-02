import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MdOutlineElderly } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

function exctractCodeFromString(message: string) {

    const blocks: { type: string; content: string; language?: string; }[] = [];
    const parts = message.split(/(```.*?\n[\s\S]*?\n```)/g); // Split message into code and non-code parts

    parts.forEach(part => {
        if (part.startsWith('```') && part.endsWith('```')) {
            // This is a code block
            // const languageMatch = part.match(/```(\w+)?/);
            // const language = languageMatch ? languageMatch[1] : 'plaintext';
            // const code = part.replace(/```(\w+)?\n/, '').replace(/\n```/, '');
            const part_val = part.split("```");
            blocks.push({ type: 'code', content: part_val[1] });
        } else {
            // This is a regular text block
            blocks.push({ type: 'text', content: part });
        }
    });

    return blocks;
}

function isCodeBlock(data: { type: string, content: string }) {
    if (data.type == "code") {
        return true;
    }
    else {
        return false;
    }
}

const ChatItem = ({ gemini_response, openai_response, role }: { gemini_response: any, openai_response: any, role: "user" | "assistant" | "model" }) => {
    // console.log("this is in the Chatitem");
    // console.log(content)
    const messageBlocks_gemini = exctractCodeFromString(gemini_response);
    const messageBlocks_openai = exctractCodeFromString(openai_response);
    const auth = useAuth();
    return role === "assistant" ? (
        // This is the one i need replace for external box
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: "100%"
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    flexBasis: 0,
                    p: 2,
                    bgcolor: "#004d5612",
                    my: 1,
                    gap: 2,
                    borderRadius: 2,
                    maxWidth: '100%',
                    overflow: 'auto'
                }}
            >
                <Avatar sx={{ ml: 0 }}>
                    <img src="openai.png" alt="openai" width={"30px"} />
                </Avatar>
                <Box sx={{ maxWidth: '100%', overflow: 'auto', wordWrap: 'break-word' }}>
                    {!messageBlocks_openai && (
                        <ReactMarkdown
                            // remarkPlugins={[remarkGfm]} // Enables extended Markdown features
                            components={{
                                p: ({ node, ...props }) => (
                                    //@ts-ignore
                                    <Typography component="p" sx={{ fontSize: "20px" }} {...props} />
                                ),
                                li: ({ node, ...props }) => (
                                    <li style={{ fontSize: "20px" }} {...props} />
                                ),
                                strong: ({ node, ...props }) => (
                                    <strong style={{ fontWeight: 'bold' }} {...props} />
                                ),
                            }}
                        >
                            {openai_response}
                        </ReactMarkdown>
                    )}
                    {messageBlocks_openai && messageBlocks_openai.length && messageBlocks_openai.map((block) =>
                        isCodeBlock(block) ? (

                            // <SyntaxHighlighter style={coldarkDark} language='javascript'>
                            //     {block}
                            // </SyntaxHighlighter>
                            <SyntaxHighlighter style={coldarkDark} language='javascript' sx={{ fontSize: "20px" }}>{block.content}</SyntaxHighlighter>
                        ) : (
                            <ReactMarkdown
                                // remarkPlugins={[remarkGfm]} // Enables extended Markdown features
                                components={{
                                    p: ({ node, ...props }) => (
                                        //@ts-ignore
                                        <Typography component="p" sx={{ fontSize: "20px" }} {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li style={{ fontSize: "20px" }} {...props} />
                                    ),
                                    strong: ({ node, ...props }) => (
                                        <strong style={{ fontWeight: 'bold' }} {...props} />
                                    ),
                                }}
                            >
                                {block.content}
                            </ReactMarkdown>
                        )
                    )}
                </Box>
            </Box>
            {/* test */}
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    flexBasis: 0,
                    p: 2,
                    bgcolor: "#004d5612",
                    my: 1,
                    gap: 2,
                    borderRadius: 2,
                    maxWidth: '100%',
                    overflow: 'auto'
                }}
            >
                <Avatar sx={{ ml: 0 }}>
                    <img src="gemini.png" alt="gemini" width={"30px"} />
                </Avatar>
                <Box sx={{ maxWidth: '100%', overflow: 'auto', wordWrap: 'break-word' }}>
                    {!messageBlocks_gemini && (
                        <ReactMarkdown
                            // remarkPlugins={[remarkGfm]} // Enables extended Markdown features
                            components={{
                                p: ({ node, ...props }) => (
                                    //@ts-ignore
                                    <Typography component="p" sx={{ fontSize: "20px" }} {...props} />
                                ),
                                li: ({ node, ...props }) => (
                                    <li style={{ fontSize: "20px" }} {...props} />
                                ),
                                strong: ({ node, ...props }) => (
                                    <strong style={{ fontWeight: 'bold' }} {...props} />
                                ),
                            }}
                        >
                            {gemini_response}
                        </ReactMarkdown>


                    )}
                    {messageBlocks_gemini && messageBlocks_gemini.length && messageBlocks_gemini.map((block, index) =>
                        isCodeBlock(block) ? (

                            // <SyntaxHighlighter style={coldarkDark} language='javascript'>
                            //     {block}
                            // </SyntaxHighlighter>
                            <SyntaxHighlighter style={coldarkDark} sx={{ fontSize: "20px" }}>{block.content}</SyntaxHighlighter>

                        ) : (
                            // <Typography sx={{ fontSize: "20px", whiteSpace: "pre-line" }}>{block.content}</Typography>
                            <ReactMarkdown
                                key={index}
                                // remarkPlugins={[remarkGfm]} // Enables extended Markdown features
                                components={{
                                    p: ({ node, ...props }) => (
                                        //@ts-ignore
                                        <Typography component="p" sx={{ fontSize: "20px" }} {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li style={{ fontSize: "20px" }} {...props} />
                                    ),
                                    strong: ({ node, ...props }) => (
                                        <strong style={{ fontWeight: 'bold' }} {...props} />
                                    ),
                                }}
                            >
                                {block.content}
                            </ReactMarkdown>
                        )
                    )}
                </Box>
            </Box>

        </Box>

    ) : (
        <Box sx={{ display: 'flex', p: 2, bgcolor: "#004d456", gap: 2 }}>
            <Avatar sx={{ ml: 0, bgcolor: 'black', color: 'white' }}>
                {auth?.user?.name[0]}{auth?.user?.name.split("")[1][0]}
            </Avatar>
            {/* Following is for displaay in user prompted data. messageBlocks_gemini and messageBlocks_openai both variable will have same data we can use any of these */}

            <Box>
                {!messageBlocks_gemini && (
                    <Typography sx={{ fontSize: "20px" }}>{gemini_response}</Typography>)}
                {messageBlocks_gemini && messageBlocks_gemini.length && messageBlocks_gemini.map((block, index) => isCodeBlock(block) ?
                    <SyntaxHighlighter key={index} style={coldarkDark}>{block.content}</SyntaxHighlighter>
                    :
                    <Typography key={index} sx={{ fontSize: "20px" }}>{block.content}</Typography>
                )}
            </Box>
        </Box>
    )
}

export default ChatItem


