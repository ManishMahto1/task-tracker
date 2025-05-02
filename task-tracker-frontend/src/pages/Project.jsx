import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useApi from '../api/api';

const Project = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
  });
  const [errors, setErrors] = useState([]);
  const { get, post, put, del } = useApi();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await get(`/tasks/project/${id}`);
        setTasks(data);
      } catch (err) {
        setErrors(Array.isArray(err) ? err : ['Failed to fetch tasks']);
      }
    };
    if (token && id) {
      fetchTasks();
    }
  }, [id, token, get]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const task = await post('/tasks', { ...formData, projectId: id });
      setTasks([...tasks, task]);
      setFormData({ title: '', description: '', status: 'To Do', priority: 'Medium' });
      setErrors([]);
    } catch (err) {
      setErrors(Array.isArray(err) ? err : ['Failed to create task']);
    }
  };

  const handleUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await put(`/tasks/${taskId}`, updates);
      setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)));
      setErrors([]);
    } catch (err) {
      setErrors(Array.isArray(err) ? err : ['Failed to update task']);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await del(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      setErrors([]);
    } catch (err) {
      setErrors(Array.isArray(err) ? err : ['Failed to delete task']);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Project Tasks</h2>
      {errors.length > 0 && (
        <ul className="text-red-500 mb-4">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <h3 className="text-xl mb-2">Create Task</h3>
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
        <div className="mb-4">
          <label className="block mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Create Task
        </button>
      </form>
      <h3 className="text-xl mb-2">Tasks</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="border p-4 rounded">
            <h4 className="text-lg font-bold">{task.title}</h4>
            <p>{task.description || 'No description'}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </p>
            {task.completedAt && (
              <p className="text-sm text-gray-500">
                Completed: {new Date(task.completedAt).toLocaleDateString()}
              </p>
            )}
            <div className="mt-2">
              <button
                onClick={() =>
                  handleUpdate(task._id, {
                    ...task,
                    status: task.status === 'Completed' ? 'To Do' : 'Completed',
                    completedAt:
                      task.status === 'Completed' ? null : new Date().toISOString(),
                  })
                }
                className="bg-yellow-500 text-white p-1 rounded mr-2"
              >
                Toggle Status
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-600 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;