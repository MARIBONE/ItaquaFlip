$(document).ready(function () {

    // MAPA
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    // A OPÇÃO 3: O CAMINHO DA PAZ E DA NITIDEZ
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

   
    

    // AJUSTA ZOOM AO TERRITÓRIO REAL
    map.fitBounds(itaquaLayer.getBounds());

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');

});

