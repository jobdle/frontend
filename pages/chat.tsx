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

import { useUser } from "../contexts/User";
import { getJob } from "../services/JobServices";
import { dateFormat, handleUpload } from "../services/UtilsServices";

const ChatPage: NextPage = () => {
  const [search, setSearch] = useState("");
  const [messageList, setMessageList] = useState<any[]>([]);
  const [roomId, setRoomId] = useState(undefined);
  const [cookies] = useCookies(["token"]);
  const refMessages = useRef<any[]>([]);
  const router = useRouter();
  // const { userData } = useUser();

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
  const [fileImage, setFileImage] = useState<File>();

  const getRoom = async (token: string) => {
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
      alert(error.response.data.message);
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

  const reRenderSideBar = async () => {
    if (isReRenderSidebar && userData?.role === "admin") {
      let chatRoomsObjectsArray = await getRoom(cookies.token);
      setChatRoomsObjectsArray(chatRoomsObjectsArray);
      setIsReRenderSidebar(false);
    }
  };

  const init = async () => {
    setIsLoading(true);
    let chatRoomsObjectsArray = await getRoom(cookies.token);
    let userData = await getUserData();
    if (userData) {
      setUserData(userData);
    } else {
      console.clear();
      router.push("/app/signin");
    }

    setSenderId(userData._id);

    if (chatRoomsObjectsArray.length == 0) return;

    if (userData !== undefined && chatRoomsObjectsArray !== undefined) {
      if (userData.role === "user") {
        // USER CHAT
        setMessageList(chatRoomsObjectsArray.messages);
        setRoomId(chatRoomsObjectsArray._id);
        refMessages.current = messageList;
      } else if (userData.role === "admin") {
        // ADMIN CHAT
        setChatRoomsObjectsArray(chatRoomsObjectsArray);
        if (roomId === undefined) {
          console.log("NOT HAVE ROOM ID");
          setRoomId(chatRoomsObjectsArray[0]._id);
          setMessageList(chatRoomsObjectsArray[0].messages);
          setRoomName(chatRoomsObjectsArray[0].nameOfUser);
        } else {
          console.log("HAVE ROOM ID");
          let selected = chatRoomsObjectsArray.filter(
            (room: any) => room._id === roomId
          );
          console.log("selected room", selected);
          console.log("selected messages", selected[0].messages);
          setMessageList(selected[0].messages);
        }
      }
    }
    setIsLoading(false);
  };

  const fetchData = async () => {
    try {
      const { data } = await getUserJobs(["new", "pending"], 1, cookies.token);
      setUserJobsArray(data.docs);
      console.log("data", data.docs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reRenderSideBar();
  }, [chatRoomsObjectsArray]);

  // for getUserJobs
  useEffect(() => {
    fetchData();
  }, []);

  // for getChatRooms
  useEffect(() => {
    init();
  }, [roomId]);

  useEffect(() => {
    refMessages.current = messageList;
    // console.log("ref changed to", refMessages.current);
    // setChkMessage(true)
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

      socket.on("message", (data: any) => {
        console.log("socket.on - message", data);
        let newMessageLists = [...refMessages.current, data.content];
        setMessageList(newMessageLists);
        setIsReRenderSidebar(true);
        // let currentMessageList = [...messageList];
        // currentMessageList.push(data.content);
        // setMessageList([...refMessages.current, data.content]);
        // setChk(!chk);
        // setChkReRenderSidebar(true);
        // setChkMessage(true);
      });
      // console.log("messageList", messageList);
    }
  }, [socket]);

  // for change chat room
  useEffect(() => {
    console.log("ROOMID:", roomId);
    if (roomId && socket !== null) {
      socket.emit("joinroom", roomId);
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
        console.log(ImageUrl);
        if (socket !== null && userData) {
          console.log("in");

          if (!ImageUrl) return;
          console.log("ki");
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

  const handleWorkMessage = async (id: string) => {
    if (!id) return;
    const response = await getJob(id, cookies.token);
    // console.log("response", response);
    return response.data;
  };

  if (!userData) return null;
  if (!userJobsArray) return null;

  return (
    <div className="w-full h-[90vh] max-h-[90vh] md:h-full flex flex-col md:flex md:flex-row rounded overflow-hidden shadow">
      {/* Chat channel part  */}
      <div className="flex flex-col w-full h-full md:w-3/12">
        <div className="w-full h-14 p-5 border-b flex justify-center items-center bg-sky-500">
          <p className="font-bold flex justify-center text-white">
            {userData.role === "admin" ? "Chat" : "Your jobs"}
          </p>
        </div>
        {userData.role === "admin" ? (
          <div>
            <span>Search: </span>
            <input
              className="w-30"
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
            {userData.role === "admin"
              ? chatRoomsObjectsArray.map((room, id) => {
                  return (
                    <div
                      className={`${
                        data.index === id ? "bg-white" : "bg-gray-100"
                      } p-5 hover:bg-white cursor-pointer border-b border-gray-200`}
                      onClick={() => {
                        setData({ ...data, index: id });
                        setRoomId(room._id);
                        setRoomName(room.nameOfUser);
                      }}
                      key={id}
                    >
                      <p className="font-bold">{room.nameOfUser}</p>
                      {/* <p className="text-gray-500 font-light">{chat.username}</p> */}
                      {/* <p>{room.messages[0].content}</p> */}
                    </div>
                  );
                })
              : userJobsArray.map((job: Job, id) => (
                  <div
                    className="bg-white rounded-md px-3 py-2 cursor-pointer hover:shadow-lg m-1"
                    key={id}
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
                          job.status === "new"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        } px-5 rounded-full text-white`}
                      >
                        <span className="uppercase">{job.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
      {/* Chat Message Content  */}
      <div className="w-9/12 md:flex flex-col justify-between bg-white border-l border-gray-200 hidden">
        {/* Chat title */}
        <div className="w-full h-14 py-5 pl-5 pr-3 border-b flex justify-between items-center relative">
          <p>{userData.role === "admin" ? roomName : "Admin"}</p>
          <button className="bg-green-500 p-2 rounded-lg text-white">
            detail
          </button>
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
                      } flex flex-col rounded-lg space-y-2 mx-2 overflow-x-hidden max-w-xs`}
                    >
                      {message.content_type === "Image" && (
                        <div
                          className="h-80 w-80 bg-red-500 max-w-xs bg-no-repeat bg-cover bg-center"
                          style={{ backgroundImage: `url(${message.content})` }}
                        ></div>
                      )}
                      {message.content_type === "Text" && (
                        <span
                          className={`${
                            userData?._id === message.senderId
                              ? "bg-sky-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          } px-4 py-2 rounded-lg inline-block`}
                        >
                          {message.content}
                        </span>
                      )}
                      {message.content_type === "work" &&
                        handleWorkMessage(message.content).then((jobOject) => (
                          <div>{jobOject.title}</div>
                        ))
                        // <div>WORK!</div>
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Chat input message */}
        <div className="flex border-t relative">
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
  );
};

export default ChatPage;
