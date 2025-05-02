import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { token } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Task Tracker</h1>
      <p className="text-lg text-gray-700 mb-6">
        Organize your projects and tasks with ease. Create up to 4 projects, manage tasks, track progress, and stay productive!
      </p>
      <div className="flex justify-center space-x-4">
        {token ? (
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
            >
              Log In
            </Link>
          </>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded shadow-sm">
            <h3 className="text-xl font-bold">Project Management</h3>
            <p className="text-gray-600">Create and manage up to 4 projects per user.</p>
          </div>
          <div className="p-4 border rounded shadow-sm">
            <h3 className="text-xl font-bold">Task Tracking</h3>
            <p className="text-gray-600">Add, update, and delete tasks with status and priority.</p>
          </div>
          <div className="p-4 border rounded shadow-sm">
            <h3 className="text-xl font-bold">Secure Authentication</h3>
            <p className="text-gray-600">Safe signup and login with JWT.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;