const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:%24mUezT6y6Ufb%234B@db.fruaqfkijirkuhdrjbgg.supabase.co:5432/postgres'
});
client.connect()
  .then(() => { console.log('Connected!'); client.end(); })
  .catch(err => console.error('Connection error', err.stack));
