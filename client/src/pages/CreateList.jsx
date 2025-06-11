import React, { useState } from 'react'

export default function CreateList() {
    const [rating, setRating] = useState(5);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Add a Restaurant
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg"
            id="Description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap mt-3">
            <div className="flex gap-2">
              <input type="checkbox" id="pedas" className="w-5" />
              <span>Pedas</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="manis" className="w-5" />
              <span>Manis</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="halal" className="w-5" />
              <span>Halal</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="tradisional" className="w-5" />
              <span>Tradisional</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="seafood" className="w-5" />
              <span>Seafood</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="cepatsaji" className="w-5" />
              <span>Cepat Saji</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="kue" className="w-5" />
              <span>Kue</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="minuman" className="w-5" />
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
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full "
              />
              <output>{rating}</output>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="price"
                required
                className="p-5 border border-gray-300 bg-gray-100 rounded-lg"
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
              className="p-3 border border-gray-300 rounded w-full cursor-pointer"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-85 disabled:opacity-75">
            Add Restaurant
          </button>
        </div>
      </form>
    </main>
  );
}
