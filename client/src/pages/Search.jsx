import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListItems from "../components/ListItems";


export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sideBarData, setSideBarData] = useState({
      searchTerm: "",
      type: [],
      sort: "created_at",
      order: "desc",
    });

    const [loading, setLoading] = useState();
    const [list, setList] = useState([]);
    console.log(list);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (searchTermFromUrl || typeFromUrl || sortFromUrl || orderFromUrl) {
            setSideBarData({
              searchTerm: searchTermFromUrl || "",
              type: typeFromUrl ? typeFromUrl.split(",") : [],
              sort: sortFromUrl || "created_at",
              order: orderFromUrl || "desc",
            });
        }

        const fetchLists = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/list/get?${searchQuery}`);
            const data = await res.json();
            setList(data);
            setLoading(false);
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set("type", sideBarData.type.join(","));
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('order', sideBarData.order);
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
                checked={sideBarData.type.includes == "kue"}
              />
              <span>Kue</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="manis"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes == "manis"}
              />
              <span>manis</span>
            </div>
            <div className="flex  gap-2">
              <input
                type="checkbox"
                id="seafood"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes == "seafood"}
              />
              <span>seafood</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="pedas"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes == "pedas"}
              />
              <span>pedas</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="tradisional"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes == "tradisional"}
              />
              <span>tradisional</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="minuman"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type.includes == "minuman"}
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

          <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-80">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl border-gray-300 font-semibold border-b p-3 text-slate-700">
          Hasil Pencarian
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && list.length === 0 && (
            <p className="text-xl text-gray-500">No results found.</p>
          )}
          {loading && (
            <p className="text-xl text-gray-500 texs-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            list &&
            list.map((list) => <ListItems key={list._id} list={list} />)}
        </div>
      </div>
    </div>
  );
}
