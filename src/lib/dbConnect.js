// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri = process.env.MONGODB_URI;
// const dbName = process.env.DB_NAME;

// if (!uri) {
//   throw new Error("Please add MONGODB_URI to .env.local");
// }

// if (!dbName) {
//   throw new Error("Please add DB_NAME to .env.local");
// }

// let client;
// let clientPromise;

// // 🔥 Prevent multiple connections in development
// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, {
//       serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//       },
//     });

//     global._mongoClientPromise = client.connect();
//   }

//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// // 🔥 Generic collection connector
// export async function connect(collectionName) {
//   const client = await clientPromise;
//   const db = client.db(dbName);
//   return db.collection(collectionName);
// }

// // ✅ Direct users collection export
// export const usersCollection = (async () => {
//   const client = await clientPromise;
//   return client.db(dbName).collection("users");
// })();

 
