const path = require('path');
const fs = require('fs');

const repRegex = /\(|\)|\,|-|_|'|\&|\.|\#|\?|\||\+|\!| /g

const romData = JSON.parse(fs.readFileSync('./api/data/roms.json'));
const labelData = JSON.parse(fs.readFileSync('./api/data/labels_cloud.json'));

const filenameToKey = file => file.replace(repRegex, '').toLowerCase()

const joinedData = [];

let withImage = 0;
let withoutImage = 0;

const countriesToSearch = [
    'Europe',
    'USA',
    'Japan'
]

const getCountry = (romName) => {

    const countryList = [];

    for (const country of countriesToSearch) {
        if (romName.includes(country)) {
            countryList.push(country)
        }
    }

    return countryList;
}

for (const rom of romData) {
    const romKey = filenameToKey(path.parse(rom.name).name)

    const findedLabel = labelData.find(label => romKey === filenameToKey(label.filename.split("_").slice(0,-1).join("_")));

    const data = {
        name: path.parse(rom.name).name,
        fileID: rom.id,
        countries: getCountry(rom.name),
        sgb: rom.name.includes('SGB Enhanced')
    };

    if (findedLabel) {
        data.imageUrl = findedLabel.url;
        withImage++;
    } else {
        withoutImage++;
    }

    joinedData.push(data)
}

console.log(withImage)
console.log(withoutImage)

fs.writeFileSync('./api/data/data.json', JSON.stringify(joinedData));