// src/components/Chat.js
import { useEffect, useRef, useState } from "react";
import { io,Socket  } from "socket.io-client";

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:3000", { transports: ["websocket"] });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("receiveMessage", (newMessage : string) => {
      console.log("Message received:", newMessage);
      setMessages((prev : string[]) => [...prev, newMessage]);
    });

    socket.on("connect_error", (err : any) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason : string) => {
      console.log("Client disconnected:", socket.id, "Reason:", reason);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      console.log("Socket disconnected on cleanup");
    };
  }, []);

  const sendMessage = () => {
    const socket : Socket | null = socketRef.current;
    if (message.trim() && socket !== null) {
      console.log("Sending message:", message);
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg :string, index :number) => (
          <p key={index} style={{ margin: "5px 0" }}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", marginRight: "10px", padding: "5px" }}
      />
      <button onClick={sendMessage} style={{ padding: "5px 10px" }}>Send</button>
    </div>
  );
};

export default Chat;
