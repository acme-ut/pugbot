const { pick_order } = require("./config.json");
const { db } = require("./utility.js");

module.exports = {
    joinMatch, leaveMatch, listMatch, listAll
}

const stmt = db.prepare(`SELECT * FROM modes`);
const info = stmt.all();

var channels = {};

if (typeof info !== "undefined") {
    info.forEach(element => {
        let channelid = element.channelid;
        let modeshort = element.modeshort;
        let playercount = element.playercount;
        var newgameobj =
        {
            "modeshort": modeshort,
            "players": [],
            "maxplayers": playercount,
            "redplayers": [],
            "blueplayers": [],
            "pick_order": pick_order
        };

        if (channelid in channels) {
            channels[channelid].push(newgameobj);
        } else {
            channels[channelid] = [newgameobj];
        };

    });
};

function inMatch(matchplayers, userid) {
    var playerfound = matchplayers.find(player => player.id === userid);
    if (typeof playerfound == "undefined") {
        return false;
    } else {
        return true;
    }
}

function joinMatch(channelid, userobject, mode) {
    if (!(channelid in channels)) {
        console.log("No modes found!");
    } else {
        var modes = channels[channelid];
        for (i = 0; i < modes.length; i++) {
            if (modes[i].modeshort === mode) {
                if (inMatch(modes[i].players, userobject.id) || modes[i].maxplayers === modes[i].players.length) {
                    return false;
                } else {
                    modes[i].players.push(userobject);
                    console.log(channels);
                    return true;
                }
            }
        };
    };
}

function leaveMatch(channelid, userobject, mode) {
    if (channelid in channels) {
        var modes = channels[channelid];
        for (i = 0; i < modes.length; i++) {
            if (modes[i].modeshort === mode) {
                if (inMatch(modes[i].players, userobject.id)) {

                    var index = modes[i].players.findIndex(player => player.id === userobject.id);

                    console.log(`Index: ${index}`);
                    console.log(`Playerlist: ${modes[i].players}`)
                    modes[i].players.splice(index, 1);
                    return true;
                }
            }
        }
    }
}

function listMatch(channelid, mode) {
    var matchfound = channels[channelid].find(match => match.modeshort === mode)
    if (matchfound) {
        var gamelist = [];
        matchfound.players.forEach(element => {
             gamelist.push(element.username);
        });
        return `**${matchfound.modeshort} [${matchfound.players.length}/${matchfound.maxplayers}]:**\n ${gamelist.join(" :small_orange_diamond: ")}`;
    } else {
        console.log("nomodes")
    }
}

function listAll(channelid) {
    if (!(channelid in channels)) {
        console.log("No modes found!");
    } else {
        var modes = channels[channelid];
        var gamelist = [];
        modes.forEach(element => {
            gamelist.push(`${element.modeshort} [${element.players.length}/${element.maxplayers}]`);
        });
        return gamelist.join(" :small_blue_diamond: ");
    }
}