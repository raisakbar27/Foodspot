import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

export default function ListItems({ list }) {
  return (
    <div className="border-gray-300 shadow-md hover:shadow-lg transition-shadow overflow-hidden w-full sm:w-[330px] rounded-lg">
      <Link to={`/list/${list._id}`}>
        <img
          src={
            list.imageUrls[0] ||
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fparador-hotels.com%2Fblog%2Fapakah-di-hotel-ada-restoran&psig=AOvVaw3GMDp_DLrjCkNlsiZMwCrQ&ust=1749890411977000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiX0_X_7Y0DFQAAAAAdAAAAABAL"
          }
          alt="list-iamge"
          className="h-[320px] sm:h-[220px] w-full pbject-cover hover:scale-105 transition-scale duration-300"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-slate-700">
          {list.name}
        </p>
        <div className="flex items-center gap-1">
          <MdLocationOn className="h-4 w-4 text-green-700" />
          <p className="text-sm text-gray-600 truncate w-full">
            {list.address}
          </p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{list.description}</p>
        <p className="text-slate-500 mt-2 font-semibold">
          Rp. {list.price.toLocaleString("id-ID")} / Menu
        </p>
      </div>
    </div>
  );
}
