const express = require("express");
const fs = require("fs");
const router = express.Router();

const DataService = require('./clients/data.client')
const GoogleDriveService = require('./clients/googleDrive.client')

const dataService = new DataService();
/**
 * GET file list.
 *
 * @return file list | empty.
 */
router.get("/", async (req, res) => {
    try {
        res.json(dataService.getData());
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});


router.get("/:fileId", async (req, res) => {
    try {
        const { data, status, headers } = await new GoogleDriveService()
            .getFileDrive(req.params.fileId);

        res.set({
            'Content-Type': headers['content-type'],
            'Content-disposition': headers['content-disposition'],
            'Content-Length': headers['content-length']
        });
        
        res.send(data);
        
    } catch (error) {
        return res.status(error.config.status).send(error.config.data);
    }
});

module.exports = router;