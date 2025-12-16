const express = require("express");
const cors = require("cors");
const { readData, writeData } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Get tenants
app.get("/tenants", (req, res) => {
  const data = readData();
  res.json(data.tenants);
});

// Add tenant
app.post("/tenants", (req, res) => {
  const data = readData();
  const newTenant = {
    id: Date.now(),
    ...req.body
  };
  data.tenants.push(newTenant);
  writeData(data);
  res.json(newTenant);
});

app.listen(3000, () => {
  console.log("Mock backend running on http://localhost:3000");
});
