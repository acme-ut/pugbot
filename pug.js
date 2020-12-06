const { pick_order, tag_nomic, tag_nocapt } = require("./config.json");
const { db } = require("./utility.js");


module.exports = {
    // Utility
    populateChannels, fetchUserState, fetchChannel,
    // Join / Leave Matches
    joinMatch, leaveMatch, leaveAll, matchFilled,
    // List Matches
    listMatch, fetchMatch,
    // Admin
    addMatch, deleteMatch
}

var channels = {};

function populateChannels() {
    const stmt = db.prepare(`SELECT * FROM modes`);
    const info = stmt.all();

    if (typeof info !== "undefined") {
        info.forEach(element => {
            addMatch(element.channelid, element.modeshort, element.modelong, element.playercount);
        });
        console.log("Match database populated");
    };
}

async function addMatch(channelid, modeshort, modelong, playercount) {

    var newgameobj =
    {
        "channelid": channelid,
        "modeshort": modeshort,
        "modelong": modelong,
        "players": [],
        "maxplayers": playercount,
        "redplayers": [],
        "blueplayers": [],
        "pick_order": pick_order
    };

    if (channelid in channels) {
        channels[channelid] = Object.assign({ [modeshort.toLowerCase()]: newgameobj }, channels[channelid]);
    } else {
        channels[channelid] = { [modeshort.toLowerCase()]: newgameobj };
    }
}

function deleteMatch(channelid, modeshort) {
    var modes = channels[channelid];

    for (const mode in modes) {
        if (modes.hasOwnProperty(mode)) {
            if (modes[mode].modeshort === modeshort) {
                delete modes[mode];
            }
        }
    }
}

function fetchChannel(channelid) {
    if (channelid in channels) {
        return channels[channelid];
    }
}

function fetchMatch(channelid, mode) {
    if (channelid in channels) {
        var modes = channels[channelid];
        if (mode in modes) {
            return modes[mode];
        }
    }
    return false;
}

function joinMatch(channelid, userobj, mode) {
    if (channelid in channels) {
        var modes = channels[channelid];
        if (mode in modes) {
            var matchobj = modes[mode];
            if (!(userobj in matchobj.players) && matchobj.maxplayers > matchobj.players.length && !(matchobj.players.includes(userobj))) {
                matchobj.players.push(userobj);
                return matchobj;
            }
        }
    };
    return false;
}

function matchFilled(client, matchobj) {

    matchobj.players.forEach(memberobject => {
        var modesleft = leaveAll(memberobject, [matchobj]);
        Object.keys(modesleft).forEach(channelid => {
            var modelist = [];
            for (const mode in modesleft[channelid]) {
                if (modesleft[channelid].hasOwnProperty(mode)) {
                    const modeobj = modesleft[channelid][mode];
                    modelist.push(modeobj.modeshort);
                }
            }
            var last = modelist.pop();
            if (modelist.length > 0) {
                response = `${memberobject.username} left \`${modelist.join("\`, \`")}\` and \`${last}\` because \`${matchobj.modeshort}\` filled.`;
            } else {
                response = `${memberobject.username} left \`${last}\` because \`${matchobj.modeshort}\` filled.`;
            }

            if (response.length > 0) {
                client.channels.cache.get(channelid).send(response);
            }
        });
    });

}

function leaveMatch(modeobj, userobj) {
    var index = modeobj.players.findIndex(player => player.id === userobj.id);
    modeobj.players.splice(index, 1);
    // Need a check here to see if the game is no longer full
}

function leaveAll(userobj, exceptions) {
    if (typeof exceptions === "undefined") { exceptions = [false]; }
    var modesleft = {};

    for (const channel in channels) {
        if (channels.hasOwnProperty(channel)) {
            const channelobj = channels[channel];
            for (const mode in channelobj) {
                if (channelobj.hasOwnProperty(mode)) {
                    const modeobj = channelobj[mode];
                    if (modeobj.players.includes(userobj) && !(exceptions.includes(modeobj))) {
                        leaveMatch(modeobj, userobj);
                        if (modeobj.channelid in modesleft) {
                            modesleft[modeobj.channelid] = Object.assign({ [modeobj.modeshort.toLowerCase()]: modeobj }, modesleft[modeobj.channelid]);
                        } else {
                            modesleft[modeobj.channelid] = { [modeobj.modeshort.toLowerCase()]: modeobj };
                        }

                    }
                }
            }
        }
    }
    return modesleft;
}

function listMatch(matchobj) {
    var usernamelist = [];
    matchobj.players.forEach(player => {
        usernamelist.push(fetchUserState(player));
    });
    return `**${matchobj.modelong}: [${matchobj.players.length}/${matchobj.maxplayers}]**\n${usernamelist.join(" :small_orange_diamond: ")}`;
}

function fetchUserState(userobj) {
    var state = [userobj.username];
    if (typeof userobj.badge !== "undefined" && userobj.badge.length > 0 ||
        typeof userobj.nomic !== "undefined" && userobj.nomic ||
        typeof userobj.nocapt !== "undefined" && userobj.nocapt) {

        state.push(" [");

        if (typeof userobj.badge !== "undefined" && userobj.badge.length > 0) {
            state.push(`${userobj.badge}`);
        }

        if (typeof userobj.nomic !== "undefined" && userobj.nomic) {
            if (userobj.nomic) {
                state.push(`${tag_nomic}`);
            }
        }

        if (typeof userobj.nocapt !== "undefined" && userobj.nocapt) {
            if (userobj.nocapt) {
                state.push(`${tag_nocapt}`);
            }
        }

        state.push("] ")
    }
    return state.join("");
}