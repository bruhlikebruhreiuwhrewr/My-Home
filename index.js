const enviroment = require('./enviroment.json');
const logs = require('./src/logs.js');
const liam = require('./src/liam.js');

if (enviroment.access_servers == true) {
    liam.connect();
}

if (enviroment.webserver == true) {
    require('./src/webserver.js');
}