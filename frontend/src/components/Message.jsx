import React from "react";
import { createRoot } from "react-dom/client";
import Markdown from "react-markdown";
import "./message.css";
export default function Message({ message = "", date = "", me }) {
  return (
    <div
      className="message-container"
      style={
        !me
          ? {
              backgroundColor: "#183D3D",
              color: "93B1A6",
              alignItems: "start",
            }
          : { backgroundColor: "#040D12", color: "#93B1A6", alignItems: "end" }
      }
    >
      {!me ? (
        <Markdown>{message}</Markdown>
      ) : (
        <div className="message">{message}</div>
      )}

      <div className="date">{date}</div>
    </div>
  );
}
