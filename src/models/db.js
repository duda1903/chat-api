const { MongoClient, ObjectId } = require("mongodb");

let singleton;

async function connect() {
    if (singleton) return singleton;
    try {
        const client = new MongoClient(process.env.DB_HOST);
        await client.connect();
        singleton = client.db(process.env.DB);
        return singleton;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
}

let findAll = async (collection) => {
    try {
        const db = await connect();
        return await db.collection(collection).find().toArray();
    } catch (err) {
        console.error(`Error finding all documents in collection ${collection}`, err);
        throw err;
    }
}

let insertOne = async (collection, objeto) => {
    try {
        const db = await connect();
        return await db.collection(collection).insertOne(objeto);
    } catch (err) {
        console.error(`Error inserting document into collection ${collection}`, err);
        throw err;
    }
}

let findOne = async (collection, _id) => {
    try {
        const db = await connect();
        let obj = await db.collection(collection).find({ '_id': ObjectId(_id) }).toArray();
        return obj.length > 0 ? obj[0] : null;
    } catch (err) {
        console.error(`Error finding document with _id ${_id} in collection ${collection}`, err);
        throw err;
    }
}

let updateOne = async (collection, object, param) => {
    try {
        const db = await connect();
        let result = await db.collection(collection).updateOne(param, { $set: object });
        return result;
    } catch (err) {
        console.error(`Error updating document in collection ${collection}`, err);
        throw err;
    }
}

module.exports = { findAll, insertOne, findOne, updateOne };
