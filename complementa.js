$(document).ready(function () {

    // MAPA
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // POLÍGONO DO MUNDO (MÁSCARA)
    var world = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180]
    ];

    // LIMITE REAL DE ITAQUAQUECETUBA (GeoJSON simplificado e correto)
    var itaquaGeoJSON = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-46.4149, -23.4619],
                [-46.4028, -23.4536],
                [-46.3875, -23.4602],
                [-46.3711, -23.4698],
                [-46.3564, -23.4817],
                [-46.3432, -23.4949],
                [-46.3338, -23.5078],
                [-46.3312, -23.5192],
                [-46.3369, -23.5256],
                [-46.3508, -23.5274],
                [-46.3687, -23.5231],
                [-46.3862, -23.5154],
                [-46.4013, -23.5038],
                [-46.4127, -23.4891],
                [-46.4173, -23.4748],
                [-46.4149, -23.4619]
            ]]
        }
    };

    // CONVERTE GEOJSON PARA COORDENADAS LEAFLET
    var itaquaLayer = L.geoJSON(itaquaGeoJSON);
    var itaquaCoords = itaquaLayer.getLayers()[0].getLatLngs();

    // MÁSCARA INVERSA: TUDO PRETO FORA DA CIDADE
    L.polygon([world, itaquaCoords], {
        fillColor: '#000',
        fillOpacity: 10.0,
        stroke: false
    }).addTo(map);

    // AJUSTA ZOOM AO TERRITÓRIO REAL
    map.fitBounds(itaquaLayer.getBounds());

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');

});
