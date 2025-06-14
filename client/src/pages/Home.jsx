import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import ListItems from '../components/ListItems';

export default function Home() {
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPopularRestaurants = async () => {
      try {
        setLoading(true);
        // Gunakan parameter useML=true untuk mendapatkan rekomendasi AI
        const res = await fetch('/api/list/get?limit=4&useML=true&searchTerm=populer');
        const data = await res.json();
        
        // Jika ada rekomendasi AI, gunakan itu
        if (data.ml && data.ml.recommendations && data.ml.recommendations.length > 0) {
          setPopularRestaurants(data.ml.recommendations);
        } 
        // Jika tidak ada rekomendasi, gunakan hasil pencarian biasa
        else if (Array.isArray(data)) {
          setPopularRestaurants(data);
        } 
        // Jika data.results tersedia (format baru)
        else if (data.results && Array.isArray(data.results)) {
          setPopularRestaurants(data.results);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular restaurants:', error);
        setLoading(false);
      }
    };

    fetchPopularRestaurants();
  }, []);

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

      {/* Restoran Populer */}
      <div className="max-w-6xl mx-auto p-3 mb-12">
        <h2 className="text-2xl font-bold text-slate-700 mb-2 border-b pb-2">
          Restoran Paling Populer
        </h2>
        <p className="text-sm text-blue-600 mb-4">
          Rekomendasi restoran terbaik berdasarkan AI FoodSpot
        </p>
        
        {loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}
        
        {!loading && popularRestaurants.length === 0 && (
          <p className="text-center text-gray-500">Tidak ada restoran yang ditemukan</p>
        )}
        
        <div className="flex flex-wrap gap-4">
          {!loading && popularRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="relative">
              <ListItems list={restaurant} />
              {restaurant.similarity_score && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                  {Math.round(restaurant.similarity_score * 100)}% relevan
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
