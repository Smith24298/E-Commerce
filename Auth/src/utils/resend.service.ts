import {Resend} from "resend";
import environment from "../config/env";

const resend = new Resend(environment.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const response = await resend.emails.send({
      from: "auth@smithfaldu.tech",
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
