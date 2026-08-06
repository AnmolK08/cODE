import React from 'react'
import { useEffect } from "react";
import socket from "./socket";
import { useState } from 'react';

export default function chat() {

    const [message, setMessage] = useState('');
    const [msgArray, setMsgArray] = useState([]);

    useEffect(() => {

        socket.on("connect", () => {
            console.log("Connected");
        });

        socket.on("message", (message) => {
            console.log(message);
            setMsgArray((prev) => [...prev, message]);
        })

        return () => {
            socket.off("connect");
            socket.off("message");
        };

    }, []);

    const sendMessage = () => {
        socket.emit('message', {"message" : message, "recieverID" : "hddwHid2m9eci2WsAAAC"});
        setMsgArray((prev) => [...prev, message]);
        console.log(message);
        setMessage('');
    }



    return (
        <div className=''>chatting

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message" />
            <button onClick={() => sendMessage()}>Send</button>
            <ul className=''>
                {msgArray.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>


    )
}

