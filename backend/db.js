const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://ganesh:ganesh123@cluster0.vbk5oaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("MongoDB connected"))
.catch(err => console.log("DB Error:", err));
