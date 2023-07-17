const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = process.env.mongo_uri;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// all api here
const run = async () => {
    try {
        const db = client.db("book-catalog");
        const bookCollection = db.collection("book");

        
    } finally {
    }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
