module.exports = function (app, io, botmaster) {
    app.get("/", function (req, res) {
        res.render("controller.ejs", {});
    });

    io.on('connection', function (socket) {
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
        });
        socket.on('mode', function (cmd) {
            switch (cmd) {
                case "antistart":
                    break;
            }
        });
        socket.on('ctrls', function (cmd) {
            console.log(("Command: " + cmd).cyan);
            var commands = JSON.parse(cmd);
            botmaster.say(commands);
        });
    });
}