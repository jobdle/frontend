import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../firebaseConfig.js";

interface Props {
  setUrl: any;
}

function FirebaseUpload({ setUrl }: Props) {
  const [file, setFile] = useState<File>();
  const [percent, setPercent] = useState(0);

  // Handles input change event and updates state
  function handleChange(event: any) {
    setFile(event.target.files[0]);
  }

  async function handleUpload() {
    if (!file) {
      alert("Please choose a file first!");
      return;
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(
      storageRef,
      await file.arrayBuffer()
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          setUrl(url);
        });
      }
    );
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleChange}
        accept="image/*"
        className="w-full text-xs"
      />
      <div>
        <button
          onClick={handleUpload}
          className="p-2 border bg-sky-500 text-white rounded-full text-xs"
        >
          Upload
        </button>
      </div>
      <p>
        {percent} {"% done"}
      </p>
    </div>
  );
}

export default FirebaseUpload;
