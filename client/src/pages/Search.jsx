import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListItems from "../components/ListItems";
import MLListItem from "../components/MLListItem";


export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sideBarData, setSideBarData] = useState({
      searchTerm: "",
      type: [],
      sort: "created_at",
      order: "desc",
      useML: true,
    });

    const [loading, setLoading] = useState();
    const [list, setList] = useState([]);
    const [mlRecommendations, setMlRecommendations] = useState(null);
    console.log(list);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (searchTermFromUrl || typeFromUrl || sortFromUrl || orderFromUrl) {
            const useMLFromUrl = urlParams.get('useML');
            setSideBarData({
              searchTerm: searchTermFromUrl || "",
              type: typeFromUrl ? typeFromUrl.split(",") : [],
              sort: sortFromUrl || "created_at",
              order: orderFromUrl || "desc",
              useML: useMLFromUrl === 'false' ? false : true,
            });
        }

        const fetchLists = async () => {
            try {
                setLoading(true);
                setMlRecommendations(null);
                
                // Tambahkan parameter useML ke query
                urlParams.set('useML', sideBarData.useML);
                const searchQuery = urlParams.toString();
                
                console.log("Fetching with query:", searchQuery);
                const res = await fetch(`/api/list/get?${searchQuery}`);
                
                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`);
                }
                
                const data = await res.json();
                console.log("Response data:", data);
                
                // Cek apakah response berisi data ML
                if (data.ml && data.results) {
                    setList(data.results);
                    setMlRecommendations(data.ml);
                } else {
                    setList(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
    }, [location.search]);


    const handleChange = (e) => { 
        if (
          [
            "kue",
            "manis",
            "seafood",
            "pedas",
            "tradisional",
            "minuman",
          ].includes(e.target.id.toLowerCase())
        ) {
          const typeId = e.target.id.toLowerCase(); // Buat lowercase agar konsisten
          const checked = e.target.checked;
          let newTypes = [...sideBarData.type];

          if (checked) {
            newTypes.push(typeId);
          } else {
            newTypes = newTypes.filter((type) => type !== typeId);
          }

          setSideBarData({ ...sideBarData, type: newTypes });
        }

        if (e.target.id === 'searchTerm') {
            
            setSideBarData({ ...sideBarData, searchTerm: e.target.value });
       
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSideBarData({ ...sideBarData, sort, order });
        }
        
        if (e.target.id === 'useML') {
            setSideBarData({ ...sideBarData, useML: e.target.checked });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set("type", sideBarData.type.join(","));
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('order', sideBarData.order);
        urlParams.set('useML', sideBarData.useML);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-gray-300 border-b-2 md:border-r-2 md:min-h-screen md:max-w-sm w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <label className="whitespace-nowrap font-semibold">Search:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search by name"
              className="border border-gray-300 bg-gray-100 rounded-lg p-3 w-full"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="" className="font-semibold">
              Type:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="kue"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes("kue")}
              />
              <span>Kue</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="manis"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes("manis")}
              />
              <span>manis</span>
            </div>
            <div className="flex  gap-2">
              <input
                type="checkbox"
                id="seafood"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes("seafood")}
              />
              <span>seafood</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="pedas"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes("pedas")}
              />
              <span>pedas</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="tradisional"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes("tradisional")}
              />
              <span>tradisional</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="minuman"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes("minuman")}
              />
              <span>minuman</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="" className="font-semibold">
              Sort:
            </label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              name=""
              id="sort_order"
              className="border border-gray-300 bg-gray-100 rounded-lg p-3"
            >
              <option value="price_desc">Price (low to high)</option>
              <option value="price_asc">Price (high to low)</option>
              <option value="createAt_desc">Latest</option>
              <option value="createAt_asc">Oldest</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="useML" className="font-semibold">
              Use AI Recommendations:
            </label>
            <input
              type="checkbox"
              id="useML"
              className="w-5 h-5"
              onChange={handleChange}
              checked={sideBarData.useML}
            />
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-80">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl border-gray-300 font-semibold border-b p-3 text-slate-700">
          Hasil Pencarian
        </h1>
        
        {/* Tampilkan hasil pencarian biasa di atas */}
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && list.length === 0 && (
            <p className="text-xl text-gray-500">No results found.</p>
          )}
          
          {loading && (
            <p className="text-xl text-gray-500 texs-center w-full">
              Loading...
            </p>
          )}

          {/* Tampilkan hasil pencarian biasa */}
          {!loading && list && list.length > 0 && (
            <>
              <div className="w-full mb-2">
                <h2 className="text-xl font-semibold text-slate-700">
                  Hasil Pencarian untuk "{sideBarData.searchTerm}"
                </h2>
              </div>
              {list.map((list) => <ListItems key={list._id} list={list} />)}
            </>
          )}
        </div>
        
        {/* Tampilkan rekomendasi ML jika ada */}
        {!loading && mlRecommendations && mlRecommendations.recommendations && mlRecommendations.recommendations.length > 0 && (
          <div className="px-7 pb-7">
            <div className="w-full border-t border-gray-300 pt-6 mt-2 mb-4">
              <h2 className="text-xl font-semibold text-blue-800">
                Rekomendasi AI untuk "{mlRecommendations.query}"
              </h2>
              <p className="text-sm text-blue-600 mt-2 mb-4">
                {mlRecommendations.query && (
                  <>
                    Berdasarkan pencarian "{mlRecommendations.query}", 
                    berikut restoran dengan {mlRecommendations.matchDescription || "karakteristik serupa"} yang mungkin Anda suka:
                  </>
                )}
                {!mlRecommendations.query && (
                  <>Restoran yang mungkin Anda suka:</>
                )}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {mlRecommendations.recommendations.map((resto) => (
                <MLListItem key={resto._id} item={resto} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
