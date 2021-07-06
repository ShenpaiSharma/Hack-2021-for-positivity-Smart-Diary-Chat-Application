const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = "mongodb+srv://admin-agp:17JE003089@cluster0.8vdgl.mongodb.net/DoctorchatDB";

const connect = mongoose.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });

module.exports = connect;
