const CONNECT_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/bookmarks';
module.exports = CONNECT_URL;
