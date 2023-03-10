import { useState } from "react";

interface Props {
  onClose: any;
  children: any;
}
const Modal = ({ children, onClose }: Props) => {
  //   const [modalOpen, setModalOpen] = useState(state);
  //   console.log("modalOpen", modalOpen);
  return (
    <div className="flex justify-center items-center w-screen h-screen fixed inset-0 bg-sky-900 bg-opacity-50 backdrop-blur-sm z-10">
      <div
        className={`bg-white rounded-md w-[500px] shadow-lg flex flex-col p-3`}
      >
        <div className="flex justify-end">
          <button onClick={() => onClose(false)}> X </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
