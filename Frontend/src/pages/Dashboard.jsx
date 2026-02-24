import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending"
  });

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title) {
      setError("Title is required");
      return;
    }

    if (editId) {
      setTasks(tasks.map(task =>
        task._id === editId ? { ...task, ...form } : task
      ));
      setEditId(null);
    } else {
      setTasks([...tasks, { ...form, _id: Date.now() }]);
    }

    setForm({ title: "", description: "", status: "pending" });
    setError("");
  };

  const handleEdit = (task) => {
    setForm(task);
    setEditId(task._id);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task._id !== id));
  };

  const filteredTasks = tasks
    .filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(task =>
      filter === "all" ? true : task.status === filter
    );

  return (
    <div>
      <Navbar />

      <div className="dashboard">
        <h1>My Tasks</h1>

        <div className="card">
          <h2>{editId ? "Edit Task ✏️" : "Add New Task ➕"}</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description (optional)"
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div>
              <button type="submit" className="btn-primary">
                {editId ? "Update" : "Add Task"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditId(null);
                    setForm({
                      title: "",
                      description: "",
                      status: "pending"
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="empty">
            No tasks found! Add one above 👆
          </p>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;