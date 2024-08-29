import axios from "axios";
import { sendEmailWithMeetingLink } from "../helper/sendEmail.js";

export const checkAuth = (req, res) => {
  const accessToken = req.cookies.zoom_access_token;
  if (accessToken) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
};

export const callback = async (req, res) => {
  const { code } = req.query;
  console.log({ code });

  try {
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
      },
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
    });

    const { access_token, refresh_token } = response.data;

    // Store tokens in cookies or database
    res.cookie("zoom_access_token", access_token, { httpOnly: true });
    res.cookie("zoom_refresh_token", refresh_token, { httpOnly: true });

    res.redirect("http://localhost:5173");
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Failed to authenticate with Zoom.");
  }
};

export const createMeeting = async (req, res) => {
  const { date, time } = req.body;
  console.log({ date, time });
  const accessToken = req.cookies.zoom_access_token;

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please authenticate with Zoom first." });
  }

  const meetingConfig = {
    topic: "Training Session",
    type: 2,
    start_time: new Date(`${date}T${time}`).toISOString(),
    duration: 60, // Meeting duration in minutes
    timezone: "UTC",
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
    },
  };

  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingConfig,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const meetingLink = response.data.join_url;
    console.log("Zoom meeting created:", meetingLink);

    // Call function to send email with meeting link
    sendEmailWithMeetingLink(meetingLink);

    res.status(200).json({
      message: "Zoom meeting created successfully",
      link: meetingLink,
    });
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Failed to create Zoom meeting" });
  }
};
