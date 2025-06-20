import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;
console.log("API URL:", API_URL);

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch items
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setItems);
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update item
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, quantity: Number(form.quantity) }),
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({ name: "", quantity: "" });
        setEditingId(null);
        // Refresh items
        return fetch(API_URL).then((res) => res.json()).then(setItems);
      });
  };

  // Edit item
  const handleEdit = (item) => {
    setForm({ name: item.name, quantity: item.quantity });
    setEditingId(item._id);
  };

  // Delete item
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => fetch(API_URL).then((res) => res.json()).then(setItems));
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Items CRUD</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" onClick={() => { setForm({ name: "", quantity: "" }); setEditingId(null); }}>
            Cancel
          </button>
        )}
      </form>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} ({item.quantity}){" "}
            <button onClick={() => handleEdit(item)}>Edit</button>{" "}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;