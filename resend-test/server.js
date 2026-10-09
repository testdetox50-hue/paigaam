require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "to, subject and message are required" });
  }

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html: `<p>${message}</p>`,
  });

  if (error) {
    return res.status(500).json({ error: error.message || "Failed to send email" });
  }

  res.json({ success: true, id: data.id });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Resend test server running on http://localhost:${PORT}`));
