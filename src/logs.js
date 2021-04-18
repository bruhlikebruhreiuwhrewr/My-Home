const fs = require('fs');

module.exports = {
    add: function(content) {
        console.log(content);
        fs.writeFile("./logs/logs.log", `${fs.readFileSync('./logs/logs.log')}
${content}`, function(err) {
            if(err) {
                console.log(`Could not save logfile!`)
                return console.log(err);
            }
        }); 
    }
}