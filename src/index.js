import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function getDB() {
  try {
    await client.connect();
    return client.db('kaende');
  } catch(ex) {
    console.error(ex)
  }
}


export const start = async () => {
    console.log('Connecting to DB...');
    const db = await getDB();

    const runNotificationCycle = async () => {
        const invoices = await db.collection('invoices').find({}).toArray();
        const tasks = invoices.map((invoice) => new Promise((resolve, reject) => {
            const { dueDate } = invoice;
            const today = Date.now();
            if (today <= dueDate) {
                sendNotification(invoice)
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve();
            }
        }))
        await Promise.all(tasks);
    }

    console.log('Starting notification cycle...');
    setInterval(runNotificationCycle, 86400000);
}

