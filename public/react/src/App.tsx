import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.css'
import { faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

function App() {

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

    socket.on("receiveMessage", (newMessage: string) => {
      console.log("Message received:", newMessage);
      setMessages((prev: string[]) => [...prev, newMessage]);
    });

    socket.on("connect_error", (err: any) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("Client disconnected:", socket.id, "Reason:", reason);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      console.log("Socket disconnected on cleanup");
    };
  }, []);

  const sendMessage = () => {
    const socket: Socket | null = socketRef.current;
    if (message.trim() && socket !== null) {
      console.log("Sending message:", message);
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <>
      <div className='flex w-full'>
        <div className='w-[25%] border-[1px] border-slate-300'>
          <input className='border-[1px] border-slate-300 my-5 p-2 rounded' type="text" placeholder='Search ..' />

          <div className='list-users-chat p-5'>

            <a className="flex items-center" href="#" aria-label="Profile of Ahmad Othmani">
              <img
                src="https://bootdey.com/img/Content/avatar/avatar5.png"
                className="rounded-[25px] me-2"
                alt="Profile picture of Ahmad Othmani"
                width="40"
                height="40"
              />
              <div className='ms-3 text-left'>
                <span className="block text-base font-medium">Ahmad Othmani</span>
                <span className="block text-sm text-gray-600">Hello brother</span>
              </div>
            </a>

          </div>

        </div>
        <div className='w-[75%] h-screen border-[1px] border-slate-300'>

          <div className="flex p-5 border-b-2 items-center justify-between bg-slate-100 ">

            <div className='flex items-cente'>
              <img
                src="https://bootdey.com/img/Content/avatar/avatar5.png"
                className="rounded-[25px] m-2"
                alt="Profile picture of Ahmad Othmani"
                width="40"
                height="40"
              />
              <div className="text-xl text-left m-2">
                Ahmad Othmani
              </div>
            </div>

            <button className='bg-slate-200 px-5 py-2 text-2xl rounded' type="button">
              <FontAwesomeIcon icon={faBars} size="xs" />
            </button>

          </div>
          <div className='messages h-[80%] mx-h-[80%] overflow-y-auto'>
            {/* The messages will print there */}
            {messages.map((msg: string, index: number) => (
              <p key={index} style={{ margin: "5px 0" }}>{msg}</p>
            ))}

          </div>
          <div className='send-section flex items-center justify-center border-t-2 h-[10%]'>
            <input 
              className='w-[80%] p-3 m-2 rounded border-2' 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            
            <button 
              className='bg-blue-200 rounded py-3 px-5' 
              type="button" 
              onClick={sendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
