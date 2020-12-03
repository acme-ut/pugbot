const { pug_database, currency_starting } = require("./config.json");
const Database = require("better-sqlite3");
const db = new Database(pug_database, { verbose: console.log });

module.exports = {
    db,
    // Members
    ifExists, addMemberIfNotExists,
    // Modes
    addModeIfNotExists, deleteMode,
    // Maps
    addMapIfNotExists, listAllMaps, deleteMap
}

// Given a value, will check a given field & table to determine if that value is found
function ifExists(value, field, table) {
    const stmt = db.prepare(`SELECT ${field} FROM ${table} WHERE ${field} = ?`);
    const info = stmt.get(value);

    if (typeof info !== "undefined") {
        return true;
    }
    return false;
}

// Given a Discord UID will add a user into the members table
function addMember(memberid, currency) {
    const insert = db.prepare(`INSERT INTO members (uid, currency) VALUES (?, ?)`);
    insert.run(memberid, currency);
}

// Performs checks to see if the member exists in the members table, and if not adds the user
function addMemberIfNotExists(memberid) {
    found = ifExists(memberid, "uid", "members");

    if (!found) {
        addMember(memberid, currency_starting);
    }
    return found;
}

// Given a channel ID and mode info will add the mode to the modes table
function addMode(channelid, modeshort, modelong, playercount) {
    const insert = db.prepare(`INSERT INTO modes (channelid, modeshort, modelong, playercount) VALUES (?, ?, ?, ?)`);
    insert.run(channelid, modeshort, modelong, playercount);
}

// Performs checks to see if the mode exists in the modes table, and if not adds the mode
function addModeIfNotExists(channelid, shortName, longName, playerNum) {

    const stmt = db.prepare(`SELECT * FROM modes WHERE channelid = ? AND modeshort = ? `);
    const info = stmt.get(channelid, shortName);

    if (typeof info !== "undefined") {
        console.log("Already in the database! Nothing's changed");
        return false;
    } else {
        addMode(channelid, shortName, longName, playerNum);
        return true;
    }
}

function deleteMode(channelid, modeshort){
    const stmt = db.prepare(`DELETE FROM modes WHERE channelid = ? AND modeshort = ?`)
    const info = stmt.run(channelid, modeshort);

    return info;
}

function addMap(channelid, mode, mapname){
    const insert = db.prepare(`INSERT INTO maps (channelid, mapmode, mapname) VALUES (?, ?, ?)`);
    insert.run(channelid, mode, mapname);
    return true;
}

function addMapIfNotExists(channelid, mode, mapname) {
    const stmt = db.prepare(`SELECT * FROM maps WHERE channelid = ? AND mapmode = ? and mapname = ?`);
    const info = stmt.get(channelid, mode, mapname);

    if (typeof info !== "undefined") {
        console.log("Already in the database! Nothing's changed");
        return false;
    } else {
        addMap(channelid, mode, mapname);
        return true
    }
}

function listAllMaps(channelid){
    const stmt = db.prepare(`SELECT * FROM maps WHERE channelid = ?`);
    const info = stmt.all(channelid);
    return info;
}

function deleteMap(channelid, mapmode, mapname){
    const stmt = db.prepare(`DELETE FROM maps WHERE channelid = ? AND mapmode = ? AND mapname = ?`)
    const info = stmt.run(channelid, mapmode, mapname)
    return info;
}