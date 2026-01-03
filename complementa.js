$(document).ready(function () {

    // MAPA
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

   // O DECRETO FINAL: IMPLEMENTAÇÃO STADIA ALIDADE SATELLITE
var Stadia_AlidadeSatellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {
	minZoom: 0,
	maxZoom: 20,
}).addTo(map);

   
    

    // AJUSTA ZOOM AO TERRITÓRIO REAL
    map.fitBounds(itaquaLayer.getBounds());

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');

});

