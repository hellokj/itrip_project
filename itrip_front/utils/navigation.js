const base = 'https://www.google.com/maps/dir/?api=1'
// &origin=Paris,France&destination=Cherbourg,France&travelmode=driving&waypoints=Versailles,France%7CChartres,France%7CLe+Mans,France%7CCaen,France'

const getUrl = (togos) => {
    let url = base;
    for(let i=0;i<togos.length;i++) {
        if(i == 0) {
            url += ('&origin=' + encodeURI(togos[i].name) + '&waypoints=');
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