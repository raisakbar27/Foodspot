import React, {useRef, useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';


export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListError, setShowListError] = useState(false);
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();


  console.log(formData);
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
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/logout", {
        method: "GET", 
        credentials: "include", 
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      console.error("Logout Error:", error); // log error
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowList = async () => { 
    try {
      setShowListError(false);
      const res = await fetch(`/api/user/list/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListError(true);
        return;
      }
      setUserList(data);

    } catch (error) {

      setShowListError(true);
    }
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Your Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
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
              ""
            )}
          </p>
        </label>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border bg-gray-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border bg-gray-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border bg-gray-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-500 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-[#DBA979] text-white p-3 rounded-lg text-center hover:opacity-80"
          to={"/create-list"}
        >
          Add Restaurant
        </Link>
      </form>
      <div className="mt-4 flex justify-between">
        <span
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 rounded-lg cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-lg cursor-pointer"
        >
          Log Out
        </span>
      </div>
      <p className="text-red-700 mt-5">
        {error ? error && "Something went wrong!" : ""}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "Update Successfully" : ""}
      </p>
      <button
        onClick={handleShowList}
        className="text-green-700 w-full cursor-pointer"
      >
        Show Restaurant
      </button>
      <p className="text-red-700 mt-5">
        {showListError ? "Error showing lists" : ""}
      </p>

      {userList && userList.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your List Restaurant</h1>
          {userList.map((list) => (
            <div
              key={list._id}
              className="border bg-[#DBA979] rounded-lg gap-4 p-3 flex justify-between item-center"
            >
              <Link to={`/list/${list._id}`}>
                <img
                  src={list.imageUrls[0]}
                  alt="image-cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/list/${list._id}`}
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              >
                <p>{list.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button className="text-red-700 cursor-pointer">Delete</button>
                <button className="text-red-700 cursor-pointer">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}