import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import api from "../utils/axios";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  console.log(user)
  const userId = user?.user?._id;
  console.log("User Id : ",userId);

  const fetchChatMessages = async () => {
    const chat = await api.get( "/api/chat/" + targetUserId, {
      headers: { Authorization: `${user.token}` } ,
    },
    );

    console.log("Chat messages : ",chat.data.messages);

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstname: senderId?.firstname,
        lastname: senderId?.lastname,
        text,
      };
    });
    setMessages(chatMessages);
  };
  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) {
        console.log("inside if")
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstname: user.user.firstname,
      userId,
      targetUserId,
    });

    console.log("Joined Chat")

    socket.on("messageReceived", ({ firstname, lastname, text }) => {
      console.log(firstname + " :  " + text);
      setMessages((messages) => [...messages, { firstname, lastname, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstname: user.user.firstname,
      lastname: user.user.lastname,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => {
            console.log("User's Firstname:", user.user.firstname);
            console.log("Message's Firstname:", msg.firstname);
          return (
            <div
              key={index}
              className={
                "chat " +
                (user.user.firstname === msg.firstname ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-header">
                {`${msg.firstname}  ${msg.lastname}`}
                <time className="text-xs opacity-50"> 2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-500 text-black rounded p-2"
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;