const db = require("./util/database");

async function testConnection() {
  try {
    const res = await db.query("SELECT NOW()");
    console.log("✅ Connected! Current time from Postgres:", res.rows[0]);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    db.end(); // always close the pool when done
  }
}

testConnection();
