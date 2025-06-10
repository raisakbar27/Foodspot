import React , {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function Signup() {

  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:
        e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        
        return;
      }
      setLoading(false);
      setError(null);
      console.log(data);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError("setError: " + error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Create an Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="border border-gray-300 p-2 w-full bg-gray-100 rounded-lg"
            type="text"
            id="username"
            placeholder="username" 
            onChange={handleChange}           
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="border border-gray-300 p-2 w-full bg-gray-100 rounded-lg"
            type="email"
            id="email"
            placeholder="example@example.com"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="border border-gray-300 p-2 w-full bg-gray-100 rounded-lg"
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />
        </div>
        <button
          disabled={loading}
          className="bg-[#DBA979] text-white p-2 rounded hover:opacity-80 disabled:opacity-50 cursor-pointer"
          type="submit"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/login"}>
          <span className="text-slate-500">Log In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
