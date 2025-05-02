import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useApi from '../api/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState([]);
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { get, post } = useApi();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await get('/projects');
        setProjects(data);
      } catch (err) {
        setErrors(Array.isArray(err) ? err : ['Failed to fetch projects']);
      }
    };
    fetchProjects();
  }, [token, get]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (projects.length >= 4) {
      setErrors(['You can only create up to 4 projects.']);
      return;
    }

    try {
      const newProject = await post('/projects', formData);
      setProjects([...projects, newProject]);
      setFormData({ title: '', description: '' });
    } catch  {
      setErrors(['Failed to create project. Please check your input.']);
    }
  };

 
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {errors.length > 0 && (
        <div className="mb-4">
          <ul className="text-red-500">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-xl mb-2">Create Project</h3>
      <form onSubmit={handleSubmit} className="max-w-md mb-8">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            maxLength={50}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            maxLength={200}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!formData.title || projects.length >= 4}
        >
          Create Project
        </button>
        {projects.length >= 4 && (
          <p className="text-sm text-gray-500 mt-2">
            You've reached the maximum number of projects allowed.
          </p>
        )}
      </form>

      <h3 className="text-xl mb-2">Your Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border p-4 rounded shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(`/project/${project._id}`)}
          >
            <h4 className="text-lg font-bold text-blue-700">{project.title}</h4>
            <p className="text-gray-700">{project.description || 'No description provided.'}</p>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
