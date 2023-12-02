import React from "react";
import "./message.css";
export default function Message({ message = "", date = "", me }) {
  return (
    <div
      className="message-container"
      style={
        !me
          ? {
              backgroundColor: "#357315",
              color: "white",
              alignItems: "start",
            }
          : { backgroundColor: "#4b494c", color: "#b3c2ce", alignItems: "end" }
      }
    >
      <div className="message">{message}</div>
      <div className="date">{date}</div>
    </div>
  );
}
