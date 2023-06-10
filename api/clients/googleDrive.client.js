
const axios = require("axios");

module.exports = class GoogleDriveService {

    constructor() {
        this.url = 'https://www.googleapis.com/drive';
        this.apiKey = 'AIzaSyAdUOqgDt0YF3of4QqSxZuWB8avIYR9J1k';
    }

    async getFile(id) {
        return await axios.get(`${this.url}/v3/files/${id}`, { params: {
            key: this.apiKey,
            alt: 'media'
        },
        responseType: 'arraybuffer'});
    }

    async getFileDrive(id) {
        return await axios.get(`https://drive.google.com/uc`, { params: { id }, responseType: 'arraybuffer'});
    }
}