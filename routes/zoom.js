import express from "express";
import { callback, checkAuth, createMeeting } from "../controller/zoom.js";

const router = express.Router();

router.get("/checkAuth", checkAuth);

router.get("/auth", (req, res) => {
  const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`;
  console.log({ authorizationUrl });
  res.redirect(authorizationUrl);
});

router.get("/callback", callback);

router.post("/createZoomMeeting", createMeeting);

export default router;
