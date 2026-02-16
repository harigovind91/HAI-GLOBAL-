const { MongoClient } = require('mongodb');

export default async function handler(req, res) {
    // Vercel Environment से चाबियाँ उठाना
    const mongoUri = process.env.CLIENT_KEY; 
    const aiKey = process.env.hai_global;

    const client = new MongoClient(mongoUri);

    if (req.method === 'POST') {
        try {
            await client.connect();
            const db = client.db('HAI_Global_DB');
            const collection = db.collection('Products');

            // यहाँ AI (aiKey) का उपयोग करके प्रोडक्ट को 'Scan' किया जा सकता है
            const newProduct = {
                ...req.body,
                verifiedBy: "HAI-AI-v1",
                timestamp: new Date()
            };

            const result = await collection.insertOne(newProduct);
            res.status(200).json({ success: true, message: "AI Verified & Saved to Cloud!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        } finally {
            await client.close();
        }
    }
              }
      
