import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MLSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError("Silakan masukkan kata kunci pencarian");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/ml/recommendations?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Terjadi kesalahan saat mencari rekomendasi");
      }
      
      setResults(data.data);
    } catch (error) {
      console.error("Error searching:", error);
      setError(error.message || "Terjadi kesalahan saat mencari rekomendasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 my-8">
      <h1 className="text-3xl font-semibold text-slate-700 mb-8 text-center">
        Rekomendasi Restoran dengan AI
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="query" className="block text-gray-700 font-medium mb-2">
              Cari berdasarkan nama restoran, jenis makanan, atau lokasi
            </label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: Sushi, Bandung, Warung Tekko"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
          >
            {loading ? "Mencari..." : "Cari Rekomendasi"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {results && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {results.type === "recommendation" 
              ? `Rekomendasi untuk "${results.query}"` 
              : `Hasil pencarian untuk "${results.query}"`}
          </h2>
          
          {results.results.length === 0 ? (
            <p className="text-gray-500">Tidak ditemukan hasil yang sesuai.</p>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {results.match_type === "restaurant_name" && "Berdasarkan nama restoran"}
                {results.match_type === "food_type" && "Berdasarkan jenis makanan"}
                {results.match_type === "location" && "Berdasarkan lokasi"}
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left">Nama Restoran</th>
                      <th className="py-2 px-4 text-left">Rating</th>
                      <th className="py-2 px-4 text-left">Jenis Makanan</th>
                      <th className="py-2 px-4 text-left">Harga</th>
                      <th className="py-2 px-4 text-left">Alamat</th>
                      {results.type === "recommendation" && results.results[0]?.similarity_score && (
                        <th className="py-2 px-4 text-left">Kemiripan</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="py-2 px-4">
                          {item.imageUrls && item.imageUrls[0] ? (
                            <div className="flex items-center">
                              <img 
                                src={item.imageUrls[0]} 
                                alt={item["Nama Restoran"]} 
                                className="w-10 h-10 object-cover rounded-full mr-2"
                              />
                              {item["Nama Restoran"]}
                            </div>
                          ) : (
                            item["Nama Restoran"]
                          )}
                        </td>
                        <td className="py-2 px-4">{item.Rating}</td>
                        <td className="py-2 px-4">{item["Jenis Makanan"]}</td>
                        <td className="py-2 px-4">{item.Harga}</td>
                        <td className="py-2 px-4">{item.Alamat}</td>
                        {results.type === "recommendation" && item.similarity_score && (
                          <td className="py-2 px-4">
                            {(item.similarity_score * 100).toFixed(1)}%
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}