$(document).ready(function () {

    // MAPA
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

   // CAMADA 1: A FOTO DE SATÉLITE (O FUNDO)
var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19
}).addTo(map);

// CAMADA 2: OS NOMES DAS RUAS (A SOBREPOSIÇÃO)
// Este link traz apenas os nomes e linhas com fundo transparente
var nomesRuas = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    pane: 'shadowPane' // Garante que os nomes fiquem por cima de tudo
}).addTo(map);

   
    

    // AJUSTA ZOOM AO TERRITÓRIO REAL
    map.fitBounds(itaquaLayer.getBounds());

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');

});

