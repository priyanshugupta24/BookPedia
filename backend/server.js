const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const { postgreSQLConnect } = require("./database.js");
const loginRoutes = require("./routes/login.routes");
const sellerRoutes = require("./routes/seller.routes.js");
const buyerRoutes = require("./routes/buyer.routes.js");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5125;

app.use(cookieParser());
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("Backend is working")
})
app.use('/api', loginRoutes);
app.use('/api', sellerRoutes);
app.use('/api', buyerRoutes);

postgreSQLConnect();
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
