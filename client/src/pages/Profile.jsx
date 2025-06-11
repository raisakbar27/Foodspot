import React, {useRef, useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData)
  console.log(filePerc)
  console.log(fileUploadError)


  useEffect(() => {
    if (file) {
      setFilePerc(0);
      setFileUploadError(false);
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ImagesFoodspot");
      data.append("cloud_name", "dfaim5swe");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfaim5swe/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadImage = await res.json();

      if (uploadImage.url) {
        setFormData({ ...formData, avatar: uploadImage.url });
        setFileUploadError(false);
        setFilePerc(100);
      } else {
        setFileUploadError(true);
      }
    } catch (err) {
      console.log("Cloudinary Upload Error:", err);
      setFileUploadError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Your Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e)=>setFile(e.target.files[0])}
          id="fileInput"
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <label htmlFor="fileInput" className="cursor-pointer self-center mt-2">
          <img
            src={formData.avatar || currentUser.avatar}
            alt="Profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
          <p className="text-sm self-center">
              {fileUploadError ? (
                <span className="text-red-700">Error upload image</span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className="text-green-700">Sukses upload</span>
              ) : (
                ''
            )}
          </p>
        </label>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border bg-gray-100 p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="border bg-gray-100 p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border bg-gray-100 p-3 rounded-lg"
        />
        <button className="bg-slate-500 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-50">
          Update
        </button>
      </form>
      <div className="mt-4 flex justify-between ">
        <span className="bg-red-500 text-white p-2 rounded-lg cursor-pointer">
          Delete Account
        </span>
        <span className="bg-red-500 text-white p-2 rounded-lg cursor-pointer">
          Log Out
        </span>
      </div>
    </div>
  );
}
