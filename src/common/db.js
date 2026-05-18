import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://iplacex:Cine2026@eva-u3-express.exb2tqg.mongodb.net/?appName=eva-u3-express";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const DB_NAME = "cine-db";

export async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado exitosamente a MongoDB Atlas");
    return client.db(DB_NAME);
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error.message);
    throw error;
  }
}

export default client;

export async function getDB() {
  if (!client.topology || !client.topology.isConnected()) {
    return await connectDB();
  }
  return client.db(DB_NAME);
}