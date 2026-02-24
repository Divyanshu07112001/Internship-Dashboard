const { MongoClient } = require('mongodb')

const uri = "mongodb+srv://admin:admin123@cluster0.8f63xkh.mongodb.net/?appName=Cluster0"

const client = new MongoClient(uri)

async function run() {
  try {
    await client.connect()
    console.log("Connected! ✅")
  } catch(e) {
    console.log("Error:", e.message)
  }
}

run()