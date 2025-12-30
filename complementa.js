$(document).ready(function () {

    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // Polígono do mundo
    var world = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180]
    ];

    // Carregar limite EXATO de Itaqua (GeoJSON IBGE)
    fetch('itaquaquecetuba.geojson')
        .then(res => res.json())
        .then(geojson => {

            var itaquaLayer = L.geoJSON(geojson);

            var itaquaCoords = itaquaLayer.getLayers()[0].getLatLngs();

            // Máscara inversa: mundo escuro, Itaqua livre
            L.polygon([world, itaquaCoords], {
                fillColor: '#000',
                fillOpacity: 0.85,
                stroke: false
            }).addTo(map);

            // Ajustar o zoom ao território real
            map.fitBounds(itaquaLayer.getBounds());
        });

});
