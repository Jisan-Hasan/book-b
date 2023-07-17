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

        // get all the books
        app.get("/books", async (req, res) => {
            const cursor = bookCollection.find({});
            const books = await cursor.toArray();

            res.send({ status: true, data: books });
        });
        // post a book
        app.post("/book", async (req, res) => {
            const result = await bookCollection.insertOne(req.body);
            res.send(result);
        });

        // get book details
        app.get("/book/:id", async (req, res) => {
            const id = req.params.id;
            const book = await bookCollection.findOne({
                _id: new ObjectId(id),
            });
            res.send({ status: true, data: book });
        });

        // update book
        app.patch("/book/:id", async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            const result = await bookCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            if (result.modifiedCount === 1) {
                res.send({
                    status: true,
                    message: "Book updated successfully!",
                });
            } else {
                res.send({ status: false, message: "Not updated" });
            }
        });

        // delete book
        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const result = await bookCollection.deleteOne({
                _id: new ObjectId(id),
            });
            if (result.deletedCount === 1) {
                res.send({
                    status: true,
                    message: "Book deleted successfully",
                });
            } else {
                res.send({ status: false, message: "Not Deleted!" });
            }
        });
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
