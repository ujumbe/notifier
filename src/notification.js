import { IncomingWebhook } from "@slack/webhook";

const webhook = new IncomingWebhook('https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX');

const sendNotification = async (invoice) => {
    const {number, currency, amount, dueDate} = invoice;
    await webhook.send({
        text: `Hi There!\n The invoice ${number} of ${currency} ${amount} is due on ${dueDate}`,
    });
}


export default sendNotification;