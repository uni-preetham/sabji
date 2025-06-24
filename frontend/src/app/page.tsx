"use client";

import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string || "https://docker-node-app-uymg.onrender.com";

export default function Home() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!API_URL) {
      console.error("API_URL is not defined");
      return;
    }
    fetch(API_URL)
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, quantity: Number(form.quantity) }),
    })
      .then((res) => res.json())
      .then(() => {
        setForm({ name: "", quantity: "" });
        setEditingId(null);
        return fetch(API_URL).then((res) => res.json()).then(setItems);
      });
  };

  const handleEdit = (item: { _id: string; name: string; quantity: number }) => {
    setForm({ name: item.name, quantity: item.quantity.toString() });
    setEditingId(item._id);
  };

  const handleDelete = (id: string) => {
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
        {items.map((item: { _id: string; name: string; quantity: number }) => (
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