import React from "react";

const MessageList = ({ messages, user }) => {
  
  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        const isSender = msg.sender === user.username;

        // Format the time (e.g., "07:45 PM")
        const time = msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <div
            key={index}
            className={`message ${isSender ? "sent" : "received"}`}
          >
            <div className="message-content">
              <strong>{msg.sender}: </strong>
              {msg.message}
            </div>

            {/* Read Receipts */}
            {isSender && (
  <span className="message-status">
    {msg.status === "sent" && "✔"}
    {msg.status === "delivered" && "✔✔"}
    {msg.status === "read" && <span style={{ color: "blue" }}>✔✔</span>}
  </span>
)}

            {msg.createdAt && <span className="timestamp">{time}</span>}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
