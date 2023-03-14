import { PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import io, { Socket } from "socket.io-client";
import LoadingComponent from "../components/LoadingComponent";
import SidebarChatAdmin from "../components/SidebarChatAdmin";

import { useUser } from "../contexts/User";
import { getUserJobs } from "../services/JobServices";
import { dateFormat, handleUpload } from "../services/UtilsServices";
// import { SocketProvider, useSocket } from "../contexts/Socket";
// import { useSocket } from "../hooks/useSocket";

const ChatPage: NextPage = () => {
  const [search, setSearch] = useState("");
  const [messageList, setMessageList] = useState<any[]>([]);
  const [roomId, setRoomId] = useState(undefined);
  const [cookies] = useCookies(["token"]);
  const refMessages = useRef<any[]>([]);
  const router = useRouter();
  const refFile = useRef<any>(null);
  // const { userData } = useUser();
  // const { isReRenderSidebar, setIsReRenderSidebar } = useSocket();

  const [chatRoomsObjectsArray, setChatRoomsObjectsArray] = useState<any[]>([]);
  const [senderId, setSenderId] = useState();
  const [roomName, setRoomName] = useState();
  const [data, setData] = useState({
    index: -1,
  });
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userJobsArray, setUserJobsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [isReRenderSidebar, setIsReRenderSidebar] = useState(false);
  const [arrivalRoomId, setArrivalRoomId] = useState("");
  const [isclickChatOnMoblie, setIsclickChatOnMoblie] = useState(false);

  const getRoom = async (token: string) => {
    console.log("IN getRoom search", search);
    try {
      let searchUrl = "";
      if (!!search) {
        searchUrl = "?search=" + search;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatroom` + searchUrl,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("getRoom", response);
      return response.data;
    } catch (error: any) {
      console.error(error);
      // alert(error.response.data.message);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      console.log("getUserData", response);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  // for getChatRooms
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      let userData = await getUserData();
      if (userData) {
        setUserData(userData);
        setSenderId(userData._id);
      } else {
        console.clear();
        router.push("/signin");
      }

      let chatRoomsObjectsArray = await getRoom(cookies.token);

      // if (chatRoomsObjectsArray.data.length === 0) return;
      if (chatRoomsObjectsArray !== undefined) {
        if (userData.role === "user") {
          // USER CHAT
          setMessageList(chatRoomsObjectsArray.messages);
          refMessages.current = chatRoomsObjectsArray.messages;
          setRoomId(chatRoomsObjectsArray._id);
        } else if (userData.role === "admin") {
          // ADMIN CHAT
          setChatRoomsObjectsArray(chatRoomsObjectsArray);
          if (roomId === undefined) {
            console.log("NOT HAVE ROOM ID:", roomId);
            setRoomId(chatRoomsObjectsArray[0]._id);
            setRoomName(chatRoomsObjectsArray[0].nameOfUser);
            setMessageList(chatRoomsObjectsArray[0].messages);
            refMessages.current = chatRoomsObjectsArray[0].messages;
          } else {
            console.log("HAVE ROOM ID:", roomId);
            let selected = chatRoomsObjectsArray.find(
              (room: any) => room._id === roomId
            );
            setMessageList(selected.messages);
            refMessages.current = selected.messages;
          }
          // if (roomId) {
          //   let selected = chatRoomsObjectsArray.find(
          //     (room: any) => room._id === roomId
          //   );
          //   setMessageList(selected.messages);
          //   refMessages.current = selected.messages;
          // }
        }
      }
      setIsLoading(false);
    };
    init();
  }, [roomId, socket, search]);

  const fetchData = async () => {
    try {
      const { data } = await getUserJobs(["new", "pending"], 1, cookies.token);
      setUserJobsArray(data.docs);
    } catch (error) {
      console.error(error);
    }
  };

  // for getUserJobs
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userData && userData.role === "admin") {
      console.log("arrivalRoomId", arrivalRoomId);
      console.log("roomId", roomId);
      // console.log(chatRoomsObjectsArray);
      let chatOnTop = chatRoomsObjectsArray.find(
        (room) => arrivalRoomId === room._id
      );
      let remainChat = chatRoomsObjectsArray.filter(
        (room) => arrivalRoomId !== room._id
      );
      console.log("chatOnTop,remainChat", chatOnTop, remainChat);
      if (chatOnTop && remainChat) {
        setChatRoomsObjectsArray([chatOnTop, ...remainChat]);
      }

      if (arrivalRoomId === roomId) {
        // refMessages.current = messageList;
        setMessageList(refMessages.current);
      }
      // console.log("ref changed to", refMessages.current);
    } else {
      setMessageList(refMessages.current);
    }

    setArrivalRoomId("");
  }, [arrivalRoomId, socket]);

  useEffect(() => {
    if (messageList) {
      refMessages.current = messageList;
    }
  }, [messageList]);

  // for connent to socket
  useEffect(() => {
    // getRoom(cookies.token);
    if (socket === null) {
      setSocket(
        io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
          secure: true,
          transports: ["flashsocket", "polling", "websocket"],
        })
      );
    } else {
      socket.on("connect", () => {
        console.log("SOCKET is already connected");
      });
      socket.on("message", async (data: any) => {
        console.log("GOT MESSAGE");
        // setMessageList([...refMessages.current, data.content]);
        refMessages.current = [...refMessages.current, data.content];
        setArrivalRoomId(data.roomId);
        // if (userData && userData.role === "admin")
        setIsReRenderSidebar(true);
      });
    }
  }, [socket]);

  // for change chat room
  useEffect(() => {
    if (socket !== null)
      chatRoomsObjectsArray.map((chatroom) =>
        socket.emit("joinroom", chatroom._id)
      );

    console.log("ROOMID:", roomId);
    if (roomId && socket !== null) {
      socket.emit("joinroom", roomId);
    }
    if (roomId && userData && userData.role === "admin") {
      let selected = chatRoomsObjectsArray.find(
        (room: any) => room._id === roomId
      );
      setMessageList(selected.messages);
      refMessages.current = selected.messages;
    }
  }, [roomId]);

  useEffect(() => {
    if (messageList) {
      if (document.getElementById("messages")) {
        var msgContainer: any = document.getElementById("messages");
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }
    }
  }, [messageList]);

  useEffect(() => {
    setIsReRenderSidebar(false);
  }, [isReRenderSidebar]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    console.log("sendMessage");
    if (socket !== null && userData) {
      if (message === "") return;
      let messageContent = {
        roomId: roomId,
        content: {
          // sender: userData.username,
          senderId: senderId,
          content_type: "Text",
          content: message,
          timeStamp: new Date(),
        },
      };
      // console.log(socket.connected)
      socket.emit("message", messageContent);
      // setChkMessage(true)
      // setMessageList([...messageList, messageContent.content]);
      setMessage("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmitFile = async (event: any) => {
    // setFileImage(event.target.files[0]);
    console.log("handleSubmitFile");
    handleUpload(event.target.files[0])
      .then((ImageUrl) => {
        refFile.current.value = "";
        console.log(ImageUrl);
        if (socket !== null && userData) {
          if (!ImageUrl) return;
          let messageContent = {
            roomId: roomId,
            content: {
              // sender: userData.username,
              senderId: senderId,
              content_type: "Image",
              content: ImageUrl,
              timeStamp: new Date(),
            },
          };
          // console.log(socket.connected)
          socket.emit("message", messageContent);
          // setChkMessage(true)
          // setMessageList([...messageList, messageContent.content]);
        }
      })
      .catch((error) => console.error(error));
  };

  if (!userData) return null;
  if (!userJobsArray) return null;
  if (!chatRoomsObjectsArray) return null;

  return (
    // <SocketProvider>
    <div className="w-full h-[90vh] max-h-[90vh] md:h-full flex flex-col md:flex md:flex-row rounded overflow-hidden shadow relative">
      {/* Chat Sidebar part  */}
      <div
        className={`${
          isclickChatOnMoblie ? "z-0" : "z-10"
        } flex flex-col h-full w-full md:w-3/12 bg-gray-100`}
      >
        <div className="w-full h-14 p-5 border-b flex justify-center items-center bg-sky-500">
          <p className="font-bold flex justify-center text-white">
            {userData.role === "admin" ? "Chat" : "Your jobs"}
          </p>
        </div>
        {userData.role === "admin" ? (
          <div className="flex items-center p-1">
            <span>Search: </span>
            <input
              className="w-full px-2"
              value={search}
              onChange={(e) => setSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearch(search);
              }}
            />
          </div>
        ) : null}
        <div className="flex-1 relative">
          <div className="overflow-auto absolute top-0 bottom-0 left-0 right-0">
            {userData.role === "admin" ? (
              !isReRenderSidebar ? (
                <SidebarChatAdmin
                  data={data}
                  chatRoomsObjectsArray={chatRoomsObjectsArray}
                  setData={setData}
                  roomId={roomId}
                  setRoomId={setRoomId}
                  setRoomName={setRoomName}
                  isReRenderSidebar={isReRenderSidebar}
                  isclickChatOnMoblie={isclickChatOnMoblie}
                  setIsclickChatOnMoblie={setIsclickChatOnMoblie}
                ></SidebarChatAdmin>
              ) : null
            ) : (
              userJobsArray.map((job: Job, id) => (
                <div
                  className="bg-white rounded-md px-3 py-2 cursor-pointer hover:shadow-lg m-1"
                  key={id}
                  onClick={() => {
                    router.push(`job/details/${job._id}`);
                  }}
                >
                  <div id="job-header" className="text-lg">
                    <span>{job.title}</span>
                  </div>
                  <hr />
                  <div id="p-5" className="px-5 py-3">
                    <div>
                      <span className="text-gray-400">Category: </span>
                      <span>{job.category.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">min-Wage: </span>
                      <span>{job.category.minWage}</span>
                    </div>
                  </div>
                  <div
                    id="job-footer"
                    className="flex justify-between items-center pt-2"
                  >
                    <div className="text-sm">
                      <span className="text-gray-400">Deadline: </span>
                      <span>{dateFormat(new Date(job.deadline))}</span>
                    </div>
                    <span
                      className={`${
                        job.status === "new" ? "bg-green-500" : "bg-yellow-500"
                      } px-5 rounded-full text-white`}
                    >
                      <span className="uppercase">{job.status}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Chat Message Content  */}
      <div
        className={`${
          isclickChatOnMoblie ? "z-10" : "z-0"
        } w-full flex flex-col md:w-9/12 justify-between bg-white border-l border-gray-200 h-[90vh] absolute md:static`}
      >
        {/* Chat title */}
        <div className="w-full h-14 py-5 pl-5 pr-3 border-b flex justify-between items-center">
          <div className="md:hidden">
            <button
              onClick={() => setIsclickChatOnMoblie(false)}
              className="p-2 bg-yellow-500 text-white rounded"
            >
              GO back to Chat{" "}
            </button>
          </div>
          <p>{userData.role === "admin" ? roomName : "Admin"}</p>
          {userData.role === "admin" && (
            <button className="bg-green-500 p-2 rounded-lg text-white">
              User Detail
            </button>
          )}
        </div>

        {/* Chat content */}
        {isLoading ? (
          <LoadingComponent className="w-28 h-28 border-4 border-gray-100 border-t-sky-500" />
        ) : (
          <div
            id="messages"
            className="space-y-2 p-3 overflow-y-auto flex-1 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            style={{}}
          >
            {messageList.map((message, id) => {
              return (
                <div className="chat-message" key={id}>
                  <div
                    className={`${
                      userData?._id === message.senderId
                        ? "items-end justify-end"
                        : ""
                    } flex`}
                  >
                    <div
                      className={`${
                        userData?._id === message.senderId
                          ? "items-end order-1"
                          : "items-start order-2"
                      } flex rounded overflow-x-hidden max-w-xs`}
                    >
                      {/* <div>hi</div> */}
                      <div>
                        {message.content_type === "Image" && (
                          <div
                            className="h-80 w-80 max-w-xs bg-no-repeat bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${message.content})`,
                            }}
                          ></div>
                        )}
                        {message.content_type === "Text" && (
                          <div
                            className={`${
                              userData?._id === message.senderId
                                ? "bg-sky-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            } px-4 py-2 rounded-lg inline-block`}
                          >
                            <div className="flex">{message.content}</div>
                          </div>
                        )}
                        {message.content_type === "work" && (
                          <div
                            className={`${
                              userData?._id === message.senderId
                                ? "bg-sky-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            } px-4 py-2 rounded-lg flex space-x-2 items-center`}
                          >
                            <p>The job was updated</p>
                            <button
                              onClick={() => {
                                router.push(`/job/details/${message.content}`);
                              }}
                              className="bg-white text-sky-500 p-2 rounded-md"
                            >
                              Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      userData?._id === message.senderId
                        ? "items-end justify-end"
                        : ""
                    } flex text-gray-400 text-xs`}
                  >
                    {new Date(message.timeStamp).toString().substring(16, 21)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Chat input message */}
        <div className="flex border-t">
          {/* {fileImage && (
            <div className="absolute bg-red-500 w-full h-28 -top-28"></div>
          )} */}
          <form onSubmit={sendMessage} className="flex w-full">
            {/* <div
              style={{
                backgroundImage: `url(${
                  fileImage && URL.createObjectURL(fileImage)
                })`,
              }}
              className={`h-60 w-60 bg-gray-100 rounded-full bg-no-repeat bg-cover bg-center flex justify-center items-center`}
            ></div> */}
            <label
              className="h-full w-10 cursor-pointer flex justify-center items-center border-r"
              htmlFor="edit-avatar"
            >
              <PhotoIcon className="w-5 h-5" />
              <input
                type="file"
                id="edit-avatar"
                className="hidden"
                onChange={handleSubmitFile}
                accept="image/*"
                ref={refFile}
              />
            </label>
            <input
              className="flex-1 focus:outline-none px-2"
              type="text"
              onChange={handleChange}
              value={message}
              name="message"
            />
            <button className="p-2 bg-sky-500 text-white" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
    // </SocketProvider>
  );
};

export default ChatPage;
