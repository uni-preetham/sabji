const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (update the URI as needed)
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if MongoDB is unreachable
});

// Define a simple schema and model
const ItemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
});
const Item = mongoose.model("Item", ItemSchema);

// Create
app.post("/items", async (req, res) => {
    const item = new Item(req.body);
    await item.save();
    res.status(201).send(item);
});

// Read all
app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.send(items);
});

// Read one
app.get("/items/:id", async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send({ error: "Not found" });
    res.send(item);
});

// Update
app.put("/items/:id", async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).send({ error: "Not found" });
    res.send(item);
});

// Delete
app.delete("/items/:id", async (req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).send({ error: "Not found" });
    res.send({ message: "Deleted" });
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});