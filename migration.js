const fs = require('fs');
const path = require('path');
const db = require('./config/connection');

async function runMigration() {
  try {
    const schemaPath = path.join(__dirname, './schema/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    const queries = schema.split(';').filter((query) => query.trim());
    for (const query of queries) {
      await db.query(query);
    }
    console.log('Database schema has been successfully initialized.');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
  } finally {
    process.exit();
  }
}

runMigration();
