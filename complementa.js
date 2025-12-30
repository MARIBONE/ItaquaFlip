$(document).ready(function() {

    // Criação do mapa
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 12);

    // Camada base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // Limite mais fiel de Itaquaquecetuba (polígono refinado)
    var itaqua = [
        [-23.4516, -46.4093],
        [-23.4589, -46.3964],
        [-23.4682, -46.3821],
        [-23.4758, -46.3667],
        [-23.4859, -46.3502],
        [-23.4974, -46.3396],
        [-23.5086, -46.3328],
        [-23.5179, -46.3311],
        [-23.5234, -46.3359],
        [-23.5261, -46.3468],
        [-23.5252, -46.3624],
        [-23.5211, -46.3772],
        [-23.5144, -46.3926],
        [-23.5047, -46.4038],
        [-23.4916, -46.4112],
        [-23.4769, -46.4148],
        [-23.4628, -46.4141]
    ];

    // Polígono do mundo (máscara)
    var world = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180]
    ];

    // Máscara inversa: tudo preto fora de Itaqua
    L.polygon([world, itaqua], {
        fillColor: '#000',
        fillOpacity: 0.85,
        stroke: false
    }).addTo(map);

    // Marcador central
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Domínio de Sua Majestade');

});
