import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Picker from "emoji-picker-react";
import MessageList from "./MessageList";
import "./chat.css";

const socket = io("http://localhost:5001");

export const Chat = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    socket.emit("register", user.username);
  }, [user.username]);

 useEffect(() => {
  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/users", {
        params: { currentUser: user.username },
      });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };
  fetchUsers();

  //Handle incoming messages
  socket.on("receive_message", (msg) => {
    // Add message only if it's for current chat
    if (msg.sender === currentChat || msg.receiver === currentChat) {
      setMessages((prev) => [...prev, msg]);
    }

    // If message is received by this user, mark it as delivered
    if (msg.receiver === user.username) {
      socket.emit("message_status_update", {
        messageId: msg._id,
        status: "delivered",
      });

      // If the user is currently viewing this chat, mark as read
      if (msg.sender === currentChat) {
        socket.emit("message_read", {
          messageId: msg._id,
          reader: user.username,
        });
      }
    }
  });

  // Handle typing indicators
  socket.on("user_typing", ({ sender }) => {
    if (sender === currentChat) {
      setIsTyping(true);
      setTypingUser(sender);
    }
  });

  socket.on("user_stop_typing", ({ sender }) => {
    if (sender === currentChat) {
      setIsTyping(false);
      setTypingUser("");
    }
  });

  //  Update status when message is read
  socket.on("message_read_update", ({ messageId, status }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status } : msg
      )
    );
  });

  //  Update status when message is delivered
  socket.on("message_status_update", ({ messageId, status }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status } : msg
      )
    );
  });

  // When user opens a chat, mark all unread messages as read
  if (currentChat) {
    messages.forEach((msg) => {
      if (msg.receiver === user.username && msg.status !== "read") {
        socket.emit("message_read", {
          messageId: msg._id,
          reader: user.username,
        });
      }
    });
  }

  return () => {
    socket.off("receive_message");
    socket.off("user_typing");
    socket.off("user_stop_typing");
    socket.off("message_read_update");
    socket.off("message_status_update");
  };
}, [currentChat, user.username, messages]);


  const fetchMessages = async (receiver) => {
    try {
      const { data } = await axios.get("http://localhost:5001/messages", {
        params: { sender: user.username, receiver },
      });
      setMessages(data);
      setCurrentChat(receiver);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const sendMessage = () => {
  if (!currentMessage.trim() || !currentChat) return;

  const messageData = {
    sender: user.username,
    receiver: currentChat,
    message: currentMessage,
    createdAt: new Date().toISOString(),
  };

  // Immediately show message as "sent" in UI
  const tempId = Date.now(); // temporary ID for optimistic UI
  setMessages((prev) => [
    ...prev,
    { ...messageData, _id: tempId, status: "sent" },
  ]);

  // Send message to server
  socket.emit("send_message", messageData);

  // Clear input
  setCurrentMessage("");

  // Stop typing
  socket.emit("stop_typing", {
    sender: user.username,
    receiver: currentChat,
  });
};


  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    if (!currentChat) return;

    socket.emit("typing", { sender: user.username, receiver: currentChat });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", {
        sender: user.username,
        receiver: currentChat,
      });
    }, 1500);
  };

  const handleEmojiClick = (emojiObject) => {
    setCurrentMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container">
      <h2>Welcome, {user.username}</h2>
      <div className="chat-list">
        <h3>Chats</h3>
        {users.map((u) => (
          <div
            key={u._id}
            className={`chat-user ${
              currentChat === u.username ? "active" : ""
            }`}
            onClick={() => fetchMessages(u.username)}
          >
            {u.username}
          </div>
        ))}
      </div>

      {currentChat && (
        <div className="chat-window">
          <h5>You are chatting with {currentChat}</h5>
          <MessageList messages={messages} user={user} />
          {isTyping && (
            <p className="typing-indicator">{typingUser} is typing...</p>
          )}
          <div className="message-field">
            <button
              className="emoji-toggle-btn"
              onClick={() => setShowEmojiPicker((val) => !val)}
            >
              😊
            </button>
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
            <input
              type="text"
              placeholder="Type a message..."
              value={currentMessage}
              style={{ minWidth: "400px" }}
              onChange={handleTyping}
            />
            <button className="btn-prime" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
