$(document).ready(function () {

    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(
        function(position) {
            console.log("Permissão concedida");
        },
        function(error) {
            console.log("Permissão negada ou erro");
        }
    );

});