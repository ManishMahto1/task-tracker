import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { token, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken('');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Task Tracker</Link>
        <div>
          {token ? (
            <>
              <Link to="/dashboard" className="text-white mr-4">Dashboard</Link>
              <button onClick={handleLogout} className="text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-white mr-4">Signup</Link>
              <Link to="/login" className="text-white">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;