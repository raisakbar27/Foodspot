import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Selamat Datang di FoodSpot
        </h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          Platform rekomendasi restoran terpercaya untuk Anda. Temukan berbagai
          pilihan tempat makan terbaik
          <br />
          dan dapatkan inspirasi kuliner yang sesuai dengan selera Anda setiap
          hari. FoodSpot, solusi mudah mencari restoran favorit Anda!
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Mulai Jelajahi Restoran
        </Link>
      </div>


    </div>
  );
}
