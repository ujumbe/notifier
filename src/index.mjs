import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const notificationInterval = process.env.NOTIFICATION_INTERVAL;

const client = new MongoClient(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getDB() {
  try {
    await client.connect();
    return client.db(dbName);
  } catch (ex) {
    console.error(ex);
  }
}

export const start = async () => {
  console.log("Connecting to DB...");
  const db = await getDB();

  const runNotificationCycle = async () => {
    const query = { dueDate: { $lte: Date.now() } };
    db.collection("invoices")
      .find(query)
      .toArray(async (err, invoices) => {
        if (err) {
          console.error("Error:", err);
          return;
        }
        const tasks = invoices.map(
          (invoice) =>
            new Promise((resolve, reject) => {
                sendNotification(invoice).then(resolve).catch(reject);
            })
        );
        await Promise.all(tasks);
      });
  };

  console.log("Starting notification cycle...");
  setInterval(runNotificationCycle, notificationInterval);
};
