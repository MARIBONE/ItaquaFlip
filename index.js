 $(document).ready(function () {


// MAPA

var map = L.map('map', {

scrollWheelZoom: false

}).setView([-23.4866, -46.3487], 16);


// O MAPA QUE NUNCA FALHA — BASE SÓLIDA

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

maxZoom: 19,

className: 'mapa-real-preto' // A etiqueta de Vossa Majestade

}).addTo(map);



// AJUSTA ZOOM AO TERRITÓRIO REAL

map.fitBounds(itaquaLayer.getBounds());


// MARCADOR CENTRAL

L.marker([-23.4866, -46.3487])

.addTo(map)

.bindPopup('Itaquaquecetuba — Território Soberano');


}); 


setInterval(function() {
    fetch("https://script.google.com/macros/s/AKfycbycNtfKcsjIWoDFVGQ-53oY7hZW4Qf-YLjCQkGne3OYqsxif8q8gP1x-gou88y8nfWn2Q/exec")
        .then(response => response.json())
        .then(dados => {
            var lat = dados[0][1];
            var lng = dados[0][2];
            // Atualiza o Pin Real no Mapa de Vossa Majestade
            meuMarcador.setLatLng([lat, lng]);
        });
}, 5000); // Repete a cada 5 segundos
