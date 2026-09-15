const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// ✅ middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 MongoDB connect
mongoose.connect("mongodb://bhumi:1234@ac-g6rk3mu-shard-00-00.5huej0j.mongodb.net:27017,ac-g6rk3mu-shard-00-01.5huej0j.mongodb.net:27017,ac-g6rk3mu-shard-00-02.5huej0j.mongodb.net:27017/foodDB?ssl=true&replicaSet=atlas-4qxrza-shard-0&authSource=admin&appName=Cluster0")
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log("❌ DB ERROR:", err));

// static folder
app.use(express.static(path.join(__dirname, "public")));

// default route
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 📦 Schema
const OrderSchema = new mongoose.Schema({
username: String,
items: Array,
total: Number,
address: String,
phone: String,
payment: String,
date: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);

// ================== SAVE ORDER ==================
app.post("/order", async (req,res)=>{

console.log("🚀 API HIT");
console.log("📦 BODY:", req.body);

try{

const { username, items, total, address, phone, payment } = req.body;

// validation
if(!username || !items || !total){
return res.send("❌ Missing data");
}

const order = new Order({
username,
items,
total,
address,
phone,
payment
});

const savedData = await order.save();

console.log("✅ SAVED:", savedData);

res.send("Order Saved Successfully");

}catch(err){
console.log("❌ ERROR:", err);
res.send("Error saving order");
}

});

// ================== GET USER ORDERS (FINAL) ==================
app.get("/orders", async (req,res)=>{

try{

const username = req.query.username;

console.log("👤 Fetching orders for:", username);

// 🛑 IMPORTANT
if(!username){
return res.json([]);
}

const orders = await Order.find({ username }).sort({ date: -1 });

res.json(orders);

}catch(err){
console.log(err);
res.send("Error fetching orders");
}

});

// ================== SERVER START ==================
app.listen(3000, () => {
console.log("🚀 Server running on port 3000");
});