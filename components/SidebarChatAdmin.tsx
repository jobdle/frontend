import { BellIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
// import { useSocket } from "../contexts/Socket";

const SidebarChatAdmin = ({
  data,
  chatRoomsObjectsArray,
  setData,
  setRoomId,
  setRoomName,
  isReRenderSidebar,
}: any) => {
  const [allChatRooms, setAllChatRooms] = useState<any>([]);

  useEffect(() => {
    if (chatRoomsObjectsArray) {
      setAllChatRooms(chatRoomsObjectsArray);
    }
  }, [chatRoomsObjectsArray]);

  if (!chatRoomsObjectsArray) return null;

  return allChatRooms.map((room: any, id: string) => {
    return (
      <div
        className={`${
          data.index === id ? "bg-white" : "bg-gray-200"
        } p-5 hover:bg-white cursor-pointer my-1 rounded-md`}
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
  });
};

export default SidebarChatAdmin;
