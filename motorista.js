$(document).ready(function () {

    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(
        function(position) {

            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            L.marker([lat, lng])
                .addTo(map)
                .bindPopup("Você está aqui 📍")
                .openPopup();

            map.setView([lat, lng], 17);

        },
        function(error) {
            console.log("Permissão negada ou erro");
        }
    );

});