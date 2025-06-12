
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaShare, FaMapMarkerAlt, FaStar, FaUtensils } from "react-icons/fa";

export default function List() {
  SwiperCore.use([Navigation]);

  const [list, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const getTypeLabel = (type) => {
    const typeMap = {
      pedas: "🌶 Pedas",
      manis: "🍯 Manis",
      halal: "🕌 Halal",
      tradisional: "🏡 Tradisional",
      seafood: "🦐 Seafood",
      cepatsaji: "🍔 Cepat Saji",
      kue: "🍰 Kue",
      minuman: "🥤 Minuman",
    };

    return typeMap[type] || type;
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/list/get/${params.listId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
          setList(data);
          setLoading(false);
          setError(false);
      } catch (error) {
          setError(true);
          setLoading(false);
      }
    };
    fetchList();
  }, [params.listId]);

    return (
      <main>
        {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
        {error && (
          <p className="text-center my-7 text-2xl">Something went wrong</p>
        )}
        {list && !loading && !error && (
          <div>
            <Swiper navigation>
              {list.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  >
                    <img
                      src={url}
                      alt="List"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
              <FaShare
                className="text-slate-500"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                Link copied!
              </p>
            )}
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xl font-semibold text-slate-800">
                
                {/* Nama Restoran */}
                <p className="text-3xl font-bold text-slate-800">{list.name}</p>

                {/* Harga  */}
                <div className="flex items-center gap-2 bg-green-100 text-green-900 px-4 py-2 rounded-lg shadow-sm w-fit">
                  <FaUtensils className="text-green-600" />
                  <span className="text-xl font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(list.price)}
                  </span>
                  <span className="text-sm text-slate-500 ml-1">/ menu</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2 text-yellow-500 text-sm font-semibold">
                Rating:
                <div className="flex">
                  {[...Array(Math.floor(list.rating))].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="text-slate-600 ml-2">({list.rating})</span>
              </div>

              <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
                <FaMapMarkerAlt className="text-green-700" />
                {list.address}
              </p>

              {/* Deskripsi */}
              <p className="text-slate-800 mt-4">
                <span className="font-semibold text-black">Description - </span>
                {list.description}
              </p>

              {/* Tag tipe makanan */}
              <div className="flex flex-wrap gap-2 mt-4">
                {list.type?.split(",").map((item) => (
                  <span
                    key={item.trim()}
                    className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium"
                  >
                    {getTypeLabel(item.trim())}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    );
}
