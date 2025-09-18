import express from "express";
import uploadRouter from "./routes/upload";
import session from "express-session";
// import passport from "passport";
import bodyParser from "body-parser";
import routes from "./routes";
import userRoutes from "./routes/app";
// import authRoutes from "./routes/auth";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";

// import "./config/passport";

const app = express();

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb" }));
app.use(
  cors({
    origin: "*",
  })
);

// Use automated routes
app.use("/api/v1", routes);
app.use("/api/v1/app", userRoutes);

// Configure express-session
app.use(
  session({
    secret: process.env.SECRET_KEY_CLIENT || "defaultSecretKey", // Replace with a strong, unique secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }, // Set secure: true if using HTTPS
  })
);
// Initialize Passport and restore authentication state, if any, from the session
// app.use(passport.initialize());
// app.use(passport.session());
app.use("/api/v1/test", (req, res) => {
  res.send("Hello World: API is working");
});
// app.use("/auth", authRoutes);

// File Upload Route
app.use("/api/v1/upload", uploadRouter);

app.use("/public", express.static(path.join(__dirname, "../uploads")));

// Serve static files for web-app (main application)
app.use("/", express.static(path.join(__dirname, "../static")));

// Serve static files for admin panel
app.use("/admin", express.static(path.join(__dirname, "../admin")));
app.use("/admin/_nuxt", express.static(path.join(__dirname, "../admin/_nuxt")));
// Add the global error handler middleware (after routes)
app.use(errorHandler);

const PORT = +(process.env.PORT || 80);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
