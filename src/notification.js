import { IncomingWebhook } from '@slack/webhook';
import 'dotenv/config';

const webhook = new IncomingWebhook(process?.env?.SLACK_URL);

const sendNotification = async (invoice) => {
  try {
    const { number, currency, amount, dueDate } = invoice;
    if (!number || !currency || !amount || !dueDate) {
      logger.error(`${invoice} missing some data`);
      return;
    }
    await webhook.send({
      text: `Hi There!\n The invoice ${number} of ${currency} ${amount} is due on ${dueDate}`
    });
  } catch (error) {
    logger.error({ error });
  }
};

export default sendNotification;
