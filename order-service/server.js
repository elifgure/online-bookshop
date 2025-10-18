const express = require("express")
const mongoose = require("mongoose")

const app = express()

// middleware
app.use(express.json())

app.get("/", (req, res)=>{
    res.send("Order service ok")
})
// mongoose connect

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=>{
    console.log(`Order service running on port ${PORT}`)
})