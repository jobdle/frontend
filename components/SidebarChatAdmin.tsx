import { BellIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import { useState } from "react";

const SidebarChatAdmin = ({data, chatRoomsObjectsArray, setData, setRoomId, setRoomName }:any) => {
    return (
    chatRoomsObjectsArray.map((room:any, id:string) => {
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
    )
};

export default SidebarChatAdmin;
