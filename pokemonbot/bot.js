var irc = require("irc");
var colors = require('colors');
var config = require('./config.js');
module.exports = function (account) {
    var settings = {
        channels : [config.channel],
        server : "irc.twitch.tv",
        port: 6667,
        secure: false,
        nick : account.nick,
        password : account.password,
    };
    var bot = new irc.Client(settings.server, settings.nick, {
        channels: [settings.channels + " " + settings.password],
        debug: false,
        password: settings.password,
        username: settings.nick
    });
    var lastmessage = {
        time: 0,
        content: ""
    };
    var timeout = 0; // timestamp of last timeout
    bot.addListener("message", function (uname, channelname, message, opts) {
        switch (uname) {
            case "jtv":// some sort of state stuff. All the parameters are weird if this is the uname
                console.log(account.nick + ": " + message.red);
                if (message.indexOf("You are banned from talking in twitchplayspokemon for ") !== -1) {
                    var time = message.split("You are banned from talking in twitchplayspokemon for ")[1].split(" ")[0];
                    timeout = new Date().getTime() + parseInt(time, 10) * 1000;
                }
                if (message.indexOf("You are permanently banned from talking in") !== -1) { 
                    timeout = Number.MAX_VALUE;
                }
                return;
            default:
                break;
        }
    });
    bot.addListener('error', function (message) {
        console.log(account.nick + ": " + 'ERROR: ', message);
    });
    return {
        nick: account.nick,
        say: function (msg) {
            bot.say(config.channel, msg);
            console.log(account.nick + ": " + msg.green);
            lastmessage = {
                time: new Date().getTime(),
                content: msg,
            };
        },
        lastSent: function (){
            return lastmessage;
        },
        isTimedOut: function (){
            return new Date().getTime() < timeout;
        }
    }
};