const express = require("express")
const mongoose = require("mongoose")

const app = express()

// middleware
app.use(express.json())

app.get("/", (req, res)=>{
    res.send("user service ok")
})
// mongoose connect 

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})