import { MongoClient } from 'mongodb';
import 'dotenv/config';
import logger from './utils.js';
import sendNotification from './notification.js';

async function getDB() {
  try {
    const uri = process?.env?.MONGODB_URI;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await client.connect();
    return client.db(process?.env?.MONGODB_NAME);
  } catch (error) {
    logger.error(`ERROR: getDB()... ${error}`);
    return;
  }
}

logger.info('Connecting to DB...');
const db = await getDB().catch((error) => {
  logger.error(`ERROR: Connecting to DB... ${error}`);
  return;
});

export const start = async () => {
  const runNotificationCycle = async () => {
    try {
      const invoices = await db
        .collection(process?.env?.MONGODB_INVOICES)
        .find({
          $expr: {
            $eq: [
              { $dateToString: { format: '%Y-%m-%d', date: '$$NOW' } },
              {
                $dateToString: { format: '%Y-%m-%d', date: '$dueDate' },
                notificationSent: false
              }
            ]
          }
        })
        .toArray();

      if (!Array.isArray(invoices)) {
        logger.error('No invoices found');
        return;
      }

      const tasks = invoices.map((invoice) => sendNotification(invoice));

      await Promise.allSettled(tasks);
    } catch (error) {
      logger.error(`ERROR: runNotificationCycle()... ${error}`);
      return;
    }
  };
  if (db) {
    console.log('Starting notification cycle...');
    setInterval(runNotificationCycle, process?.env?.CYCLE_INTERVAL);
  }
};
