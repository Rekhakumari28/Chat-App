# MERN Real-Time Chat App

A **real-time chat application** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** with **Socket.IO** for instant messaging.  
It includes features like **read receipts (✔, ✔✔, blue ✔✔)**, **typing indicators**, **emoji picker**, and **real-time message delivery status** — just like WhatsApp!

---

## Features

### Chat Features
- **Real-time messaging** using Socket.IO  
- **Message delivery status**:
  - `✔` → Sent  
  - `✔✔` → Delivered  
  - `✔✔ (blue)` → Read  
- **Typing indicators** ("User is typing...")  
- **Emoji support** via `emoji-picker-react`  
- **User registration & login** (via `/auth` route)  
- **Automatic read receipts** when a chat is opened  
- **Message timestamps** (e.g. “07:45 PM”)  
- **User list** with active chat switching  

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js, Socket.IO Client, Axios, emoji-picker-react, CSS |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB (via Mongoose) |
| **Environment Variables** | dotenv |

---

## Installation & Setup

###  Clone the repository
```bash
git clone https://github.com/Rekhakumari28/Chat-App.git
```
### Backend setup
```
cd chat-application-backend
npm install
npm node index.js
```
Your backend will run on:
` http://localhost:5001`

### Frontend Setup
```
cd chat-application-frontend-main
npm install
npm start
```

Your frontend will run on:
`http://localhost:3000`

## Folder Structure
```
chat-app/
│
├── chat-application-backend/
│   ├── models/
│   │   ├── Messages.js
│   │   └── User.js
│   ├── routes/
│   │   └── auth.route.js
│   ├── index.js
│   ├── .env
│   └── package.json
│
├── chat-application-frontend-main/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.js
│   │   │   ├── Login.js
│   │   │   ├── MessageList.js
│   │   │   └── Register.js
│   │   ├── App.js
│   │   └── chat.css
│   ├── public/
│   └── package.json
│
└── README.md
```

## Socket.IO Events Summary
```
| Event                    | Direction       | Description                           |
| ------------------------ | --------------- | ------------------------------------- |
| `register`               | Client → Server | Registers user with socket ID         |
| `send_message`           | Client → Server | Sends message to receiver             |
| `receive_message`        | Server → Client | Receives message on receiver’s side   |
| `message_status_update`  | Server → Client | Updates message to “delivered”        |
| `message_read`           | Client → Server | Marks a message as read               |
| `message_read_update`    | Server → Client | Updates sender’s message tick to blue |
| `typing` / `stop_typing` | Both            | Manages typing indicators             |

```

### Message Status Flow

```
| Status      | Description                        | Tick UI   |
| ----------- | ---------------------------------- | --------- |
| `sent`      | Message sent to server             | ✔         |
| `delivered` | Message reached recipient’s device | ✔✔        |
| `read`      | Recipient opened the message       | ✔✔ (blue) |
```

### How Read Receipts Work

1. Sender sends message → stored in MongoDB with status "sent".

2. Receiver online → backend updates to "delivered" and notifies sender.

3. Receiver opens chat → frontend emits "message_read", backend updates to "read".

4. Sender’s UI updates in real-time (blue double tick).

### UI Preview

```
+-----------------------------------------------------------+
|  💬  Chat App                                             |
|-----------------------------------------------------------|
|  Users:   [ Alice ]  [ Bob ]  [ Charlie ]                 |
|-----------------------------------------------------------|
|  Alice is typing...                                       |
|-----------------------------------------------------------|
|  You: Hey Bob!                         ✔✔ (blue)  07:45PM |
|  Bob: Hi Alice 👋                                       |
|-----------------------------------------------------------|
|  😊 [Type a message...] [Send]                            |
+-----------------------------------------------------------+
```
### Author

Rekha Kumari

Full Stack Developer (MERN)

Projects: ShoeSanctuary, WorkAsana, Anvaya CRD

📧 rekha.kumari1928@gmail.com | [LinkedIn](https://www.linkedin.com/in/rekha-gunarat-7b9459279/) | [Portfolio](https://rekha-portfolio-eifv.vercel.app/)