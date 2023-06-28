const axios = require("axios");
const fs = require('fs');

const BASE_URL = 'https://api.igdb.com/v4';
const CLIENT_ID = '0x28ycejljp5wfm6n4fjmc10hx3gik';
const CLIENT_SECRET = 'tt5ktb5ipokobafk8h8uwl3k3039bb';

const getToken = async () => {
    try {
        const {data} = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`);
        
        return data.access_token;
    } catch (error) {
        console.error(error);
        return null;
    }

};

const getGame = async (name, token, needImage) => {
    const {data} = await axios({
        method: 'post',
        url: `${BASE_URL}/games`,
        headers: {
            'Content-Type': 'text/plain',
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${token}`
        },
        responseType: 'json',
        data: `
        fields name, first_release_date, 
        involved_companies.company.name, 
        involved_companies.developer,
        involved_companies.publisher,
        genres.name, slug
        ${(needImage ? ',cover.image_id' : '')};
        where platforms = (33,22);
        search "${name}";
        limit 1;` 
    })
    
    if (!data.length) {
        return null;
    }

    const {name: gameName, slug, involved_companies, genres, cover, first_release_date} = data[0];

    return {
        gameName,
        slug,
        releaseDate: first_release_date,
        companies: involved_companies ? involved_companies.map(({company, developer, publisher}) => ({
            name: company.name,
            developer, publisher
        })) : null,
        genres: genres ? genres.map(g => g.name) : null,
        cover: cover ? `${cover.image_id}.jpg` : null
    };
}

(async () => {
    const data = JSON.parse(fs.readFileSync('./api/data/data.json'));
    const token = await getToken();

    if (!token) {
        console.log('Error at token creation');
        return;
    }

    const newRomData = [];
    let i = 0;

    for (let rom of data) {
        const clearName = rom.name.replace(/ *\([^)]*\) */g, "");

        const needImage = !rom.hasOwnProperty('imageUrl');
        const igdbData = await getGame(clearName, token, needImage);

        if (igdbData) {
            const {gameName, slug, releaseDate, companies, genres, cover} = igdbData;

            rom = {...rom, ...{
                name: gameName,
                slug
            }}

            if (releaseDate) rom.releaseDate = releaseDate;
            if (companies) rom.companies = companies;
            if (genres) rom.genres = genres;
            
            if (cover && needImage) {
                rom.imageUrl = cover;
                rom.imageFromIGDB = true;
            }
        }

        console.log(`${i + 1} of ${data.length}`)
        newRomData.push(rom);
        i++;
    }

    fs.writeFileSync('./api/data/data.json', JSON.stringify(newRomData));
})();