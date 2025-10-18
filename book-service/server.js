const express = require("express")
const mongoose = require("mongoose")

const app = expresss()

// middleware
app.use(express.json())

app.get("/", (req, res)=>{
    res.send("book service is ok")
})

// mongoose connect 


const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`Book service running on port ${PORT}`)
})