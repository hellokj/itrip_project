const base = 'https://www.google.com/maps/dir/?api=1'
// format: &origin=Paris,France&destination=Cherbourg,France&travelmode=driving&waypoints=Versailles,France%7CChartres,France%7CLe+Mans,France%7CCaen,France'
// if no origin is provided, starting point will be user's current location

const getUrl = (togos) => {
    let url = base;
    for(let i=0;i<togos.length;i++) {
        if(i == 0) {
            url += ('&waypoints=' + encodeURI(togos[i].name));
        }
        else if(i == togos.length - 1) {
            url += ('&destination=' + encodeURI(togos[i].name));
        }
        else {
            url += ('%7C' + encodeURI(togos[i].name));
        }
    }
    return url
}

export { getUrl }