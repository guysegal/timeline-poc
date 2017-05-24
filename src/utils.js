import uuid from 'react-native-uuid';

const imageUrls = ['https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/2000px-Flag_of_the_Netherlands.svg.png', 
'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Fiji.svg/255px-Flag_of_Fiji.svg.png', 
'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png', 
'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/1280px-Flag_of_Norway.svg.png'];


export default (count, type) => {
    const t = new Date();
    const items = [];
    for (let i = 0; i < count; i++) {
        let color = "white";
        switch (type) {
            case "past": color = "black"; break;
            case "future": color = "red"; break;
            case "omnibox": color = "green"; break;
        }

        var imageIndex = Math.floor(Math.random() / 0.25);
        //items.push({id: uuid.v4(), color, type})
        items.push({id: uuid.v4(), color, type, imageUrl:imageUrls[imageIndex]})        
    }

    var timeElapsed = new Date() - t;

    console.warn('Count: ' + count + ' Type: ' + type + ' Time: ' + timeElapsed / 1000 + ' secs');

    return items;
}