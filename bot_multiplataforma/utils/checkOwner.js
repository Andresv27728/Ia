// Verifica si el usuario es el owner
require('dotenv').config();

const OWNER_ID = process.env.OWNER_ID;

function isOwner(userId) {
    if (!OWNER_ID) {
        console.warn("OWNER_ID is not set in .env file. Owner checks will always return false.");
        return false;
    }
    return userId === OWNER_ID;
}

module.exports = { isOwner };
