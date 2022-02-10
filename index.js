const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
// const fileUpload = require("express-fileupload");
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
// app.use(fileUpload());
// MONGODB database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qa19q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("Yooda-Hostel");
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");
    const foodsCollection = database.collection("foods");
    const studentsCollection = database.collection("students");

    //admin blog get
    app.get("/foods", async (req, res) => {
      const cursor = foodsCollection.find({});
      const foods = await cursor.toArray();
      res.json(foods);
    });
    //   console.log(req.query);
    //   const cursor = blogsCollection.find({});
    //   const page = req.query.page;
    //   const size = parseInt(req.query.size);
    //   let blogs;
    //   const count = await cursor.count();
    //   if (page) {
    //     blogs = await cursor
    //       .skip(page * size)
    //       .limit(size)
    //       .toArray();
    //   } else {
    //     blogs = await cursor.toArray();
    //   }

    //   res.json({
    //     count,
    //     blogs,
    //   });
    // });
    //admin single blog
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodsCollection.findOne(query);
      res.json(result);
    });
    //admin blog post
    app.post("/foods", async (req, res) => {
      const foodId = req.body.foodId;
      const foodName = req.body.foodName;
      const price = req.body.price;
      // const status = req.body.status;
      const foodImage = req.body.foodImage;
      // const pic = req.files.image;
      // const picData = pic.data;
      // const encodedPic = picData.toString("base64");
      // const imageBuffer = Buffer.from(encodedPic, "base64");
      const food = {
        foodId,
        foodName,
        foodImage,
        price,
        // status
      };
      // console.log("body", req.body);
      // console.log("files", req.files);
      const result = await foodsCollection.insertOne(food);

      res.json(result);
    });
    // -----------------------------Student----------------
    //admin student get
    app.get("/students", async (req, res) => {
      const cursor = studentsCollection.find({});
      const students = await cursor.toArray();
      res.json(students);
    });
    //admin single student
    app.get("/students/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentsCollection.findOne(query);
      res.json(result);
    });
    //admin student post
    app.post("/students", async (req, res) => {
      const fullName = req.body.fullName;
      const roll = req.body.roll;
      const age = req.body.age;

      const studentClass = req.body.studentClass;
      const hallName = req.body.hallName;
      const status = req.body.status;
      // const pic = req.files.image;
      // const picData = pic.data;
      // const encodedPic = picData.toString("base64");
      // const imageBuffer = Buffer.from(encodedPic, "base64");
      const student = {
        fullName,
        roll,
        age,
        studentClass,
        hallName,
        status,
      };
      // console.log("body", req.body);
      // console.log("files", req.files);
      const result = await studentsCollection.insertOne(student);

      res.json(result);
    });
    //cancel an order
    app.delete("/deletestudents/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleting the order with id ", id);
      const query = { _id: ObjectId(id) };
      const result = await studentsCollection.deleteOne(query);
      res.send(result);
    });

    //get all user order
    app.get("/students", async (req, res) => {
      console.log("Getting all user orders");
      const cursor = studentsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //update an order
    app.put("/students/:id", async (req, res) => {
      const id = req.params.id;
      updatedOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedOrder.status,
        },
      };

      const result = await studentsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // ----------------------------------------------------

    //cancel an order
    app.delete("/foodsdelete/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleting the order with id ", id);
      const query = { _id: ObjectId(id) };
      const result = await foodsCollection.deleteOne(query);
      res.send(result);
    });

    // ---------------------------------------------------------
    // users collection insert a user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });

    // find user using email
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    // set user as a admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // check either user is admin or not 1
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // post reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });

    // get reviews
    app.get("/allreviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World from Yooda Hostel!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
