import uuid from 'react-native-uuid';

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
        items.push({id: uuid.v4(), color, type})
    }
    return items;
}