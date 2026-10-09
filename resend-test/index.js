require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail() {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "delivered@resend.dev",
    subject: "My First Resend Email",
    html: "<h1>Hello!</h1><p>This is my first email using Resend.</p>",
  });

  if (error) {
    console.log("Error:", error);
    return;
  }

  console.log("Email sent successfully!");
  console.log(data);
}

sendEmail();
