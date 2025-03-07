const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/users.routes");
const { courseRoute } = require("./routes/courses.route");
const { videoRoute } = require("./routes/videos.route");
const instructorRoutes = require("./routes/instructor.route");
const enrollRouter = require("./routes/enroll.route"); // Import đúng router
const commentRouter = require("./routes/comments.route");
const viewRoute = require("./routes/view.route");
const discussionRoutes = require("./routes/discussion.route");
const questionRoutes = require("./routes/question.route");
const scoreRoute = require("./routes/score.route");
const favoriteCourseRoutes = require('./routes/favoritecourse.route');
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/courses", courseRoute);
app.use("/videos", videoRoute);
app.use("/instructors", instructorRoutes);
app.use("/enrollments", enrollRouter);
app.use("/comments", commentRouter);
app.use("/views", viewRoute);
app.use("/discussions", discussionRoutes);
app.use("/questions", questionRoutes);
app.use("/scores", scoreRoute); // Use score routes
app.use('/favoritecourses', favoriteCourseRoutes);

// Endpoint to regenerate token
app.get("/regenerateToken", (req, res) => {
  const rToken = req.headers.authorization?.split(" ")[1];

      try {
        const decoded = jwt.verify(rToken, "ARIVU");
        const token = jwt.sign(
          { userId: decoded.userId, user: decoded.user },
          "arivu",
          { expiresIn: "7d" }
        );
        res.status(201).json({ msg: "Token created", token });
      } catch (error) {
        res
          .status(400)
          .json({ msg: "Not a valid Refresh Token", error: error.message });
      }
    });

    // Home route
    app.get("/", (req, res) => {
      try {
        res.status(200).json({ message: "Welcome to SRM's Backend" });
      } catch (err) {
        res.status(400).json({ message: "Some Error Occurred. Please Refresh" });
      }
    });

    // Server and Database Connection
    const port = process.env.port || 5001;

    app.listen(port, async () => {
      try {
        await connection;
        console.log("Connected to DB");
        console.log(`Connected to port ${port}`);
      } catch (error) {
        console.error("Error connecting to database:", error.message);
      }
    });