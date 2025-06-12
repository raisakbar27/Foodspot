import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateList() {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    price: "",
    type: "",
    open: "false",
    rating: 5,
  });

  useEffect(
    () => {
      const fetchList = async () => {
        const listId = params.listId;
        const res = await fetch(`/api/list/get/${listId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setFormData(data);
      }
      fetchList();
    }, []);

  const handleImageSubmit = async (e) => {
    console.log("Files:", files);
    console.log("Existing imageUrls:", formData.imageUrls);
    console.log(
      "Total akan diupload:",
      files.length + formData.imageUrls.length
    );

    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      try {
        const urls = await Promise.all(promises);
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageUrls: prevFormData.imageUrls.concat(urls),
        }));

        setImageUploadError(false);
        setUploading(false);
      } catch (err) {
        console.error(err);
        setImageUploadError("Image upload failed (2 MB max per image)");
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ImagesFoodspot");
    data.append("cloud_name", "dfaim5swe");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfaim5swe/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (res.ok) {
        return result.secure_url; // URL dari gambar yang berhasil diupload
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err.message);
      throw err;
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prevFormData) => {
      const newImageUrls = [...prevFormData.imageUrls];
      newImageUrls.splice(index, 1);
      return { ...prevFormData, imageUrls: newImageUrls };
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => {
      // Tangani checkbox kategori makanan (multiple selection)
      if (type === "checkbox") {
        const updatedTypes = new Set(prev.type ? prev.type.split(",") : []);

        if (checked) {
          updatedTypes.add(id);
        } else {
          updatedTypes.delete(id);
        }

        return {
          ...prev,
          type: Array.from(updatedTypes).join(","), // Simpan sebagai string, misal: "pedas,manis"
        };
      }

      // Tangani input range sebagai angka
      if (type === "range") {
        return {
          ...prev,
          [id]: Number(value),
        };
      }

      // Default (text, number, dll)
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("Upload at least one image");

      setLoading(true);
      const res = await fetch(`/api/list/update/${params.listId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/list/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Restaurant
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap mt-3">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="pedas"
                className="w-5"
                onChange={handleChange}
                checked={formData.type.includes("pedas")}
              />
              <span>Pedas</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="manis"
                className="w-5"
                onChange={handleChange}
                checked={formData.type.includes("manis")}
              />
              <span>Manis</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="halal"
                className="w-5"
                onChange={handleChange}
                checked={formData.type.includes("halal")}
              />
              <span>Halal</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="tradisional"
                className="w-5"
                onChange={handleChange}
                checked={formData.type.includes("tradisional")}
              />
              <span>Tradisional</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="seafood"
                className="w-5"
                onChange={handleChange}
                checked={formData.type.includes("seafood")}
              />
              <span>Seafood</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="cepatsaji"
                className="w-5"
                onChange={handleChange}
                checked={formData.type.includes("cepatsaji")}
              />
              <span>Cepat Saji</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="kue"
                className="w-5"
                onChange={handleChange}
                checked={formData.type.includes("kue")}
              />
              <span>Kue</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="minuman"
                className="w-5"
                onChange={handleChange}
                checked={formData.type.includes("minuman")}
              />
              <span>Minuman</span>
            </div>
          </div>
          <div className="p-5">
            <label htmlFor="rating" className="block mb-1">
              Cita Rasa Makanan
            </label>
            <div className="flex items-center gap-2 mb-5">
              <input
                type="range"
                min="1"
                max="10"
                id="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full "
              />
              <output>{formData.rating}</output>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="price"
                required
                className="p-5 border border-gray-300 bg-gray-100 rounded-lg"
                value={formData.price}
                onChange={handleChange}
              />
              <div className="flex flex-col item-center">
                <p>Harga Makanan</p>
                <span className="text-xs">(RP. / Menu)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded w-full cursor-pointer"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center bg-gray-100 rounded-lg"
              >
                <img
                  src={url}
                  alt="list-image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-85 disabled:opacity-75"
          >
            {loading ? "Updating..." : "Update Restaurant"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
