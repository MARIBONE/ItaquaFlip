$(document).ready(function() {

    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // Itaquaquecetuba (área visível)
    var itaqua = [
        [-23.455, -46.410],
        [-23.455, -46.300],
        [-23.520, -46.300],
        [-23.520, -46.410]
    ];

    // Mundo inteiro (máscara)
    var world = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180]
    ];

    // Máscara preta com furo em Itaqua
    L.polygon([world, itaqua], {
        fillColor: '#000',
        fillOpacity: 0.85,
        stroke: false
    }).addTo(map);

    // Marcador imperial
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Domínio de Sua Majestade');

});
