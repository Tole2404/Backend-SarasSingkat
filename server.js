const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRouter = require('./routes/user/routes')
const path = require("path")
const bookRouter = require('./routes/book/routes')

const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.json());
// app.use(express.static("public"));
app.use('/public', express.static(path.join(__dirname, 'uploads')));

// app.use("/api/auth", authRoutes);
app.use('/api/users/', userRouter);
app.use('/api/books', bookRouter);

// mongoose
//   .connect("mongodb://saras_singkat:123456/SarasSingkat")
//   .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
//   .catch((err) => console.log(err));

app.listen(5000, () => console.log('Server: http://localhost:5000'));
