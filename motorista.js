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
                .bindPopup("SEU LOCAL")
                .openPopup();

            map.setView([lat, lng], 17);

            fetch("https://script.google.com/macros/s/AKfycbz6bm4rqeA6_88ztbBVwr_JnQFBmVdsA8Gz9p1pK9heomd9-HFge8Ny6VPF30I5H57LQQ/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    latitude: lat,
                    longitude: lng
                })
            })
            .then(response => response.json())
            .then(data => console.log("Enviado com sucesso:", data))
            .catch(error => console.error("Erro ao enviar:", error));

        },
        function(error) {
            console.error("Erro na geolocalização:", error);
        }
    );

});
