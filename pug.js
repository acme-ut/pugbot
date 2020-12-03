const { pick_order, tag_nomic, tag_nocapt } = require("./config.json");
const { db } = require("./utility.js");

module.exports = {
    // Utility
    populateChannels, everyGameContainingUser, fetchUserState,
    // Join / Leave Matches
    joinMatch, leaveMatch, leaveAll,
    // List Matches
    listMatch, listMatches, listAll,
    // Admin
    addMatch, deleteMatch
}

var channels = {};

function populateChannels() {
    const stmt = db.prepare(`SELECT * FROM modes`);
    const info = stmt.all();

    if (typeof info !== "undefined") {
        info.forEach(element => {

            var newgameobj =
            {
                "channelid": element.channelid,
                "modeshort": element.modeshort,
                "modelong": element.modelong,
                "players": [],
                "maxplayers": element.playercount,
                "redplayers": [],
                "blueplayers": [],
                "pick_order": pick_order
            };

            if (element.channelid in channels) {
                channels[element.channelid].push(newgameobj);
            } else {
                channels[element.channelid] = [newgameobj];
            };

        });
        console.log("Match database populated");
    };
}


function addMatch(channelid, modeshort, modelong, playercount) {
    var newgameobj =
    {
        "modeshort": modeshort,
        "modelong": modelong,
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
    }
}

function deleteMatch(channelid, modeshort) {
    var modes = channels[channelid];
    for (i = 0; i < modes.length; i++) {
        if (modes[i].modeshort === modeshort) {
            var index = modes.findIndex(mode => mode.modeshort == modeshort);
            modes.splice(index, 1);
            return true;
        }
    }
}

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
        console.log("Channel not found");
    } else {
        var modes = channels[channelid];
        for (i = 0; i < modes.length; i++) {
            if (modes[i].modeshort === mode) {
                if (inMatch(modes[i].players, userobject.id) || modes[i].maxplayers === modes[i].players.length) {
                    return false;
                } else {
                    modes[i].players.push(userobject);
                    return modes[i];
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
                    modes[i].players.splice(index, 1);
                    return true;
                }
            }
        }
    }
}

function leaveAll(userobject) {
    channelobj = {};
    foundlist = everyGameContainingUser(userobject);

    foundlist.forEach(mode => {

        if (mode.channelid in channelobj) {
            channelobj[mode.channelid].push(mode.modeshort);
        } else {
            channelobj[mode.channelid] = [mode.modeshort];
        };

        var index = mode.players.findIndex(player => player.id === userobject.id);
        mode.players.splice(index, 1);
    });

    return channelobj;
}

function listMatch(channelid, mode) {
    var matchfound = channels[channelid].find(match => match.modeshort == mode)
    if (matchfound) {
        var gamelist = [];
        matchfound.players.forEach(element => {
            gamelist.push(fetchUserState(element));
        });
        return `**${matchfound.modelong} [${matchfound.players.length}/${matchfound.maxplayers}]:**\n ${gamelist.join(" :small_orange_diamond: ")}`;
    } else {
        console.log("Mode not found!")
    }
}

function fetchUserState(userobject) {
    var state = [userobject.username];
    if (typeof userobject.badge !== "undefined" && userobject.badge.length > 0 ||
        typeof userobject.nomic !== "undefined" && userobject.nomic ||
        typeof userobject.nocapt !== "undefined" && userobject.nocapt) {

        state.push(" [");

        if (typeof userobject.badge !== "undefined" && userobject.badge.length > 0) {
            state.push(`${userobject.badge}`);
        }

        if (typeof userobject.nomic !== "undefined" && userobject.nomic) {
            if (userobject.nomic) {
                state.push(`${tag_nomic}`);
            }
        }

        if (typeof userobject.nocapt !== "undefined" && userobject.nocapt) {
            if (userobject.nocapt) {
                state.push(`${tag_nocapt}`);
            }
        }
        
        state.push("] ")
    }
    return state.join("");
}

function listMatches(channelid) {
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

function listAll(channelid) {
    if (!(channelid in channels)) {
        console.log("No modes found!");
    } else {
        var modes = channels[channelid];
        var gamelist = [];
        modes.forEach(element => {
            if (element.players.length > 0) {
                gamelist.push(element);
            }
        });
        return gamelist;
    }
}

function everyGameContainingUser(userobject) {
    gamearray = [];
    for (channel in channels) {
        for (gamemode in channels[channel]) {
            if (channels[channel][gamemode].players.filter(obj => obj.id === userobject.id).length > 0) {
                gamearray.push(channels[channel][gamemode]);
            }
        }
    }
    return gamearray;
}