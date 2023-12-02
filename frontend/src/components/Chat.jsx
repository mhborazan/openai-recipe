import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import Message from "./Message";
import axios from "axios";
import UID from "uniquebrowserid";
const myid = new UID().completeID();

export default function Chat() {
  const [chatHistory, setChatHistory] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();
  const [input, setInput] = useState("");
  const onSubmit = async (event) => {
    const date = new Date();
    setMessages((prev) => [
      ...prev,
      {
        message: input,
        date: `${date.getHours()}:${date.getMinutes()}`,
        id: "user",
      },
    ]);
    event.preventDefault();
    inputRef.current.value = "";
    inputRef.current.disabled = true;
    const respond = await axios.post("http://127.0.0.1:9000/question", {
      question: input,
      date: `${date.getHours()}:${date.getMinutes()}`,
      chatHistory: chatHistory,
    });
    setMessages((prev) => [
      ...prev,
      {
        message: respond.data.message,
        date: `${date.getHours()}:${date.getMinutes()}`,
        id: "ai",
      },
    ]);
    setChatHistory(
      (prev) =>
        prev + `"user": ${input} \n\n "ai": ${respond.data.message} \n\n`
    );
    inputRef.current.disabled = false;
    setInput.value = "";
  };

  return (
    <>
      <div className="container">
        <div className="chat-area">
          {messages.map((e, i) => {
            return (
              <Message
                message={e.message}
                date={e.date}
                key={i}
                me={e.id == "user"}
              />
            );
          })}
        </div>
        <div className="input-area">
          <form onSubmit={onSubmit}>
            <input
              type="text"
              onChange={(i) => setInput(i.target.value)}
              ref={inputRef}
            />
            <button type="submit">Tarif Sor</button>
          </form>
        </div>
      </div>
    </>
  );
}
