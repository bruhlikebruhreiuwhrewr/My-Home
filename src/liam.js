const fs = require('fs');
const enviroment = require('../enviroment.json');
const logs = require('./logs');

// Dependencies
const signalR = require("@microsoft/signalr");

let connection = new signalR.HubConnectionBuilder()
        .withUrl(`${enviroment.serverendpoint}/myhome/connect`)
        .build(); // build config.

module.exports = {
    connect: function() {
        // Here we connect to the endpoint sent with SignalR. This should always be a Liam server. This is only done if enviroment.access_servers is true.
        try {
            logs.add(`Sending websocket request to "${enviroment.serverendpoint}/myhome/connect"`); // Log this event happened.

            connection.on("connected", data => { // On "send" event.
                if (data == "true") {
                    logs.add(`Successfully connected to "${enviroment.serverendpoint}/myhome/connect"!`);
                    return true;
                } else {
                    logs.add(`Failed to connect to "${enviroment.serverendpoint}/myhome/connect"! [Authentication with server failed]`);
                    return false;
                }
            });

            connection.start() // Start connection with server, it's not automatic after config build.
                .then(() => {
                    logs.add(`Looks like we successfully connected to "${enviroment.serverendpoint}/myhome/connect"! Attempting to send join request...`);
                    connection.invoke("join", enviroment.clientid, enviroment.secret);
                });
        } catch (error) {
            logs.add(`Failed to connect to "${enviroment.serverendpoint}/myhome/connect"`);
            logs.add(error);
            return false; // Tell promise we failed to connect.
        }
    },
    isConnected: function() {
        if (connection.connectionId == null) {
            return false;
        } else {
            return true;
        }
    }
}