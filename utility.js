const { pug_database, vbucks_default, match_json, pick_order } = require("./config.json");
const Database = require("better-sqlite3");
const db = new Database(pug_database, { verbose: console.log });
const fs = require('fs');

module.exports = {
    db,
    ifExists,
    addMemberIfNotExists,
    addModeIfNotExists
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
function addMember(memberid, vbucks) {
    const insert = db.prepare(`INSERT INTO members (uid, vbucks) VALUES (?, ?)`);
    insert.run(memberid, vbucks);
}

// Performs checks to see if the member exists in the members table, and if not adds the user
function addMemberIfNotExists(memberid) {
    found = ifExists(memberid, "uid", "members");

    if (found) {
        console.log("Already in the database! Nothing's changed");
    }
    else {
        addMember(memberid, vbucks_default);
        console.log("Added to the members database!");
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
        found = true;
    } else {
        found = false;
    }

    if (found) {
        console.log("Already in the database! Nothing's changed");
    }
    else {
        addMode(channelid, shortName, longName, playerNum);
    }
    return found;
}