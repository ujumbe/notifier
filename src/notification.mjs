import dotenv from "dotenv";
import { IncomingWebhook } from "@slack/webhook";
dotenv.config();

const slackUrl = process.env.SLACK_URL;

const webhook = new IncomingWebhook(slackUrl);

const sendNotification = async (invoice) => {
    const {number, currency, amount, dueDate} = invoice;
    webhook
      .send({
        text: `Hi There!\n The invoice ${number} of ${currency} ${amount} is due on ${dueDate}`,
      })
      .then(() => {
        console.log("Message sent successfully");
      })
      .catch((error) => {
        console.error("Error sending message to Slack:", error.message);
      });
}


export default sendNotification;