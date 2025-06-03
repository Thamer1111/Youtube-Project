import { FaSearch, FaBell, FaPlus } from 'react-icons/fa';
import { AiOutlineMenu } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.username) {
      setUsername(storedUser.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-black text-white px-4 shadow">
      <div className="flex items-center gap-4">
        <AiOutlineMenu size={24} />
        <Link to="/">
          <img
            src="https://media.idownloadblog.com/wp-content/uploads/2020/08/YouTube-logo-black-background.png"
            alt="YouTube"
            className="h-16"
          />
        </Link>
      </div>

      <div className="flex items-center w-1/2">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-l-full bg-neutral-800 text-white outline-none"
        />
        <button className="py-3 px-4 rounded-r-full bg-neutral-700">
          <FaSearch />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <FaBell size={20} />
        <FaPlus size={20} />
        {username && (
          <>
            <div className="bg-blue-800 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
