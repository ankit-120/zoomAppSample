import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import zoomRoutes from "./routes/zoom.js";
import cors from "cors";

// Load environment variables from a .env file
dotenv.config({ path: "./.env" });

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/zoom", zoomRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
