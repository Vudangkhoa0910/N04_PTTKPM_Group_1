const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning';
// const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://eduphenikaa:09102004@cluster0.6z6g1.mongodb.net/elearning?retryWrites=true&w=majority';

console.log("Connecting to MongoDB URI:", mongoURI);

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((err) => {
        console.error("Error connecting to database:", err);
        process.exit(1); // Thoát chương trình nếu không kết nối được
    });

const db = mongoose.connection;

db.on("error", (error) => console.error("MongoDB Connection Error:", error));
db.once("open", () => console.log("MongoDB connection is open."));

module.exports = {
    db
};