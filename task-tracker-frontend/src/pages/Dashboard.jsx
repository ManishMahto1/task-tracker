import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects', {
          headers: { 'x-auth-token': token },
        });
        setProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching projects');
      }
    };
    fetchProjects();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { 'x-auth-token': token },
      });
      setProjects([...projects, res.data]);
      setFormData({ title: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating project');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {error && <p className="text-red-500">{error}</p>}
      <h3 className="text-xl mb-2">Create Project</h3>
      <form onSubmit={handleSubmit} className="max-w-md mb-8">
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Create Project
        </button>
      </form>
      <h3 className="text-xl mb-2">Your Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border p-4 rounded cursor-pointer"
            onClick={() => navigate(`/project/${project._id}`)}
          >
            <h4 className="text-lg font-bold">{project.title}</h4>
            <p>{project.description || 'No description'}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;