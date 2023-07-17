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
            console.log(req.body);
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

        // post a review
        app.post("/review/:id", async (req, res) => {
            const bookId = req.params.id;
            const review = req.body.review;

            const result = await bookCollection.updateOne(
                { _id: new ObjectId(bookId) },
                { $push: { reviews: review } }
            );

            if (result.modifiedCount !== 1) {
                res.send({
                    status: false,
                    message: "Book not found or review not added",
                });
                return;
            }
            res.send({ status: true, message: "Comment added successfully" });
        });

        // get review
        app.get("/review/:id", async (req, res) => {
            const bookId = req.params.id;

            const result = await bookCollection.findOne(
                { _id: new ObjectId(bookId) },
                { projection: { _id: 0, reviews: 1 } }
            );

            if (result) {
                res.send({ status: true, data: result });
            } else {
                res.send({ status: false, message: "Product not found" });
            }
        });

        // get all genres
        app.get("/genres", async (req, res) => {
            const result = await bookCollection.distinct("genre");
            res.send(result);
        });
        // get all genres
        app.get("/year", async (req, res) => {
            const result = await bookCollection.distinct("publicationDate");
            res.send(result);
        });
        // get last 10 added sorted book
        app.get("/sortedBook", async (req, res) => {
            const sortedBooks = await bookCollection
                .find({})
                .sort({ createdAt: -1 })
                .limit(10)
                .toArray();

            res.send({ status: true, data: sortedBooks });
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
