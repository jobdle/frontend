// import { createContext, useContext, useEffect, useRef, useState } from "react";
// import { useCookies } from "react-cookie";
// import io, { Socket } from "socket.io-client";

// interface ISocketContext {
//   socket: any;
//   isReRenderSidebar: boolean;
//   setIsReRenderSidebar: any;
// }

// const SocketContext = createContext<any>({
//   socket: io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
//     secure: true,
//     transports: ["flashsocket", "polling", "websocket"],
//   }),
//   isReRenderSidebar: false,
//   setIsReRenderSidebar: () => {},
// });

// function SocketProvider({ children }: any) {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [cookies, setCookie] = useCookies(["token"]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isReRenderSidebar, setIsReRenderSidebar] = useState(false);
//   const [messageList, setMessageList] = useState([]);

//   const refMessages = useRef([]);

//   // for connent to socket
//   useEffect(() => {
//     if (socket === null) {
//       setSocket(
//         io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
//           secure: true,
//           transports: ["flashsocket", "polling", "websocket"],
//         })
//       );
//     } else {
//       socket.on("connect", () => {
//         console.log("SOCKET is already connected");
//       });

//       socket.on("message", (data: any) => {
//         console.log("socket.on - message", data);
//         let newMessageLists: any = [...refMessages.current, data.content];
//         setMessageList(newMessageLists);
//         setIsReRenderSidebar(true);
//         // let currentMessageList = [...messageList];
//         // currentMessageList.push(data.content);
//         // setMessageList([...refMessages.current, data.content]);
//         // setChk(!chk);
//         // setChkReRenderSidebar(true);
//         // setChkMessage(true);
//       });
//       // console.log("messageList", messageList);
//     }
//     console.log(socket);
//   }, [socket]);

//   return (
//     <SocketContext.Provider
//       value={{ socket, isReRenderSidebar, setIsReRenderSidebar }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// }

// const useSocket = () => useContext(SocketContext);

// export { SocketProvider, useSocket };
