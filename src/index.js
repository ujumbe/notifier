import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function getDB() {
  try {
    const uri = process?.env?.MONGODB_URI;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await client.connect();
    return client.db(process?.env?.MONGODB_NAME);
  } catch (ex) {
    console.error({ ex });
  }
}

console.log('Connecting to DB...');
const db = await getDB().catch((error) => {
  console.error(error);
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
        console.error('No invoices found');
        return;
      }

      const tasks = invoices.map(
        (invoice) =>
          new Promise((resolve, reject) => {
            sendNotification(invoice).then(resolve).catch(reject);
          })
      );

      await Promise.allSettled(tasks);
    } catch (error) {
      console.error(error);
    }
  };
  console.log('Starting notification cycle...');
  setInterval(runNotificationCycle, process?.env?.CYCLE_INTERVAL);
};
