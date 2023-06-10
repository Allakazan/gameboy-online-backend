const fs = require('fs');

module.exports = class DataService {
    constructor() {
        this.dataset = JSON.parse(fs.readFileSync('./api/data/data.json'))
    }

    getData() {
        return this.dataset;
    }
}