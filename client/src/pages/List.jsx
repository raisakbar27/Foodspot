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
  const [recommendations, setRecommendations] = useState([]);
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
        console.log("API response:", data); // Debug log
        
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        
        if (data.listData) {
          // New API format with recommendations
          setList(data.listData);
          setRecommendations(data.recommendations || []);
        } else {
          // Old API format without recommendations
          setList(data);
          
          // Fetch recommendations separately
          try {
            const resRec = await fetch(`/api/list/get?type=${data.type}&limit=4`);
            const recData = await resRec.json();
            // Filter out the current restaurant
            const filteredRecs = recData.filter(item => item._id !== data._id);
            // Add similarity scores
            const recsWithScore = filteredRecs.map(item => {
              item.similarity_score = (0.5 + (item.rating / 5) * 0.4).toFixed(2);
              return item;
            });
            setRecommendations(recsWithScore);
          } catch (recError) {
            console.error("Error fetching recommendations:", recError);
          }
        }
        
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Error fetching list:", error);
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
          
          {/* Rekomendasi */}
          {recommendations.length > 0 && (
            <div className="max-w-4xl mx-auto p-3 my-7">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
                Rekomendasi Restoran Serupa
              </h2>
              <p className="text-sm text-blue-600 mb-6">
                Restoran dengan jenis makanan {list.type} yang mungkin Anda suka:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.map((resto) => (
                  <a 
                    href={`/list/${resto._id}`} 
                    key={resto._id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img 
                      src={resto.imageUrls[0]} 
                      alt={resto.name} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-slate-800 truncate">{resto.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-yellow-500">
                          {[...Array(Math.floor(resto.rating))].map((_, i) => (
                            <FaStar key={i} className="text-xs" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">({resto.rating})</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium text-green-700">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0
                          }).format(resto.price)}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {Math.round(resto.similarity_score * 100)}% mirip
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}