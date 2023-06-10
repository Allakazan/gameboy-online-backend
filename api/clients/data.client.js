const fs = require('fs');
const path = require('path');

module.exports = class DataService {
    constructor() {
        this.dataset = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json')))
    }

    getData() {
        return this.dataset;
    }
}