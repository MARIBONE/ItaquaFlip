$(document).ready(function () {

    // 1️⃣ Cria o mapa
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // 2️⃣ Pede permissão de GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {

                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                // 3️⃣ Cria o pin no mapa
                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("Seu Local")
                    .openPopup();

                // 4️⃣ Centraliza o mapa na posição do usuário
                map.setView([lat, lng], 17);

                // 5️⃣ Envia os dados para o Google Sheets (sem ler a resposta)
                var form = new FormData();
                form.append("latitude", lat);
                form.append("longitude", lng);

                fetch("https://script.google.com/macros/s/AKfycbz6bm4rqeA6_88ztbBVwr_JnQFBmVdsA8Gz9p1pK9heomd9-HFge8Ny6VPF30I5H57LQQ/exec", {
                    method: "POST",
                    body: form
                });
                // ❌ NÃO usar .then() ou .catch() para ler retorno
                // isso evita o erro de CORS

            },
            function(error) {
                console.error("Erro na geolocalização:", error);
            }
        );
    } else {
        console.error("Geolocalização não suportada neste navegador.");
    }

});
