import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Profile = () => {

  const [user, setUser] = useState({
    name: "Divyanshu",
    email: "example@email.com"
  });

  const [form, setForm] = useState(user);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      setError("All fields are required");
      setSuccess("");
      return;
    }

    setUser(form);
    setSuccess("Profile updated successfully ✅");
    setError("");
  };

  return (
    <div>
      <Navbar />

      <div className="profile-box">
        <div className="card">
          <div className="profile-header">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                {user?.name}
              </h2>

              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                {user?.email}
              </p>
            </div>
          </div>

          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
              Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <label style={{ fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%" }}
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;