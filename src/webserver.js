// References
const enviroment = require('../enviroment.json');
const logs = require('./logs.js');
const liam = require('./liam.js');

// Dependencies
const express = require('express');
var bodyParser = require('body-parser');
var body = bodyParser.json();
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
const app = express();

app.get('/system/:data', function (req, res) {
    if (enviroment.api_allowedIPs !== "*") {
        if (enviroment.api_allowedIPs == null) {
            return;
        }
        if (!enviroment.api_allowedIPs.includes(req.ip)) {
            return;
        }
    }
    var routeData = req.params.data;
    if (routeData == "logs") {
        res.send(fs.readFileSync('./logs/logs.log'));
        res.end();
        return;
    }
    if (routeData == "status") {
        exec('node --version', (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                return;
            }
            res.send(`{"status":"alive", "connected":"${liam.isConnected()}", "system_uptime":"${os.uptime()}", "node_version":"${stdout.trim()}", "myhome_version":"${enviroment.version}", "os_version":"${os.type()} ${os.release()}"}`);
            res.end();
            return;
        });
    }
    else {
        res.status(404);
        res.send(`{"error":"true", "header":"Error", "message":"Sorry, we can't find that content :C"}`);
        res.end();
    }
})

app.get('/system', function(req, res) {
    if (enviroment.api_allowedIPs !== "*") {
        if (enviroment.api_allowedIPs == null) {
            return;
        }
        if (!enviroment.api_allowedIPs.includes(req.ip)) {
            return;
        }
    }
    res.send(`{"error":"true", "header":"Not Found", "message":"Sorry! We can't find this content, please refer to the documentation for information about the /system directory."}`);
    res.end();
    return;
})

app.post('/private/api/init', body, function(req, res) {
    if (enviroment.api_allowedIPs !== "*") {
        if (enviroment.api_allowedIPs == null) {
            return;
        }
        if (!enviroment.api_allowedIPs.includes(req.ip)) {
            return;
        }
    }
    res.send(req.body);
    res.end();
    return;
})

app.get('/logs', function (req, res) {
    if (enviroment.api_allowedIPs !== "*") {
        if (enviroment.api_allowedIPs == null) {
            return;
        }
        if (!enviroment.api_allowedIPs.includes(req.ip)) {
            return;
        }
    }
    res.send(fs.readFileSync('./logs/logs.log'));
    res.end();
})

try {
    app.listen(enviroment.webserverPort);
    logs.add(`Webserver now listening on ${enviroment.webserverPort}`);
} catch (error) {
    console.log(error);
    logs.add(`Websocked failed to listen on ${enviroment.webserverPort} - Maybe check port ${enviroment.webserverPort} isn't in use?`);
}