import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaPercentage } from 'react-icons/fa'

export default function MLListItem({ item }) {
  return (
    <div className="border-gray-300 shadow-md hover:shadow-lg transition-shadow overflow-hidden w-full sm:w-[330px] rounded-lg relative">
      {item.similarity_score && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-semibold flex items-center">
          <FaPercentage className="mr-1" />
          {(item.similarity_score * 100).toFixed(0)}% mirip
        </div>
      )}
      <Link to={`/list/${item._id}`}>
        <img
          src={
            (item.imageUrls && item.imageUrls[0]) ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={item.name}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-slate-700">
          {item.name}
        </p>
        <div className="flex items-center gap-1">
          <MdLocationOn className="h-4 w-4 text-green-700" />
          <p className="text-sm text-gray-600 truncate w-full">
            {item.address}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-slate-500 font-semibold">
            Rp. {item.price.toLocaleString("id-ID")}
          </p>
          <p className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            {item.type}
          </p>
        </div>
        <div className="flex items-center mt-1">
          <div className="flex items-center bg-green-100 px-2 py-1 rounded">
            <span className="text-green-800 font-medium">{item.rating}</span>
            <span className="text-green-800 ml-1">★</span>
          </div>
        </div>
      </div>
    </div>
  );
}