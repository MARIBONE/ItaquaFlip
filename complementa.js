$(document).ready(function () {

    // MAPA - A BASE SÓLIDA DE VOSSA MAJESTADE
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'mapa-real-preto'
    }).addTo(map);

    // Conexão Real com o Servidor (Certifique-se de incluir o script do Socket.io)
    const socket = io('https://seu-servidor.com.br'); 

    // Marcador que representa o próprio motorista no mapa dele
    var meuMarcador;

    // A VIGILÂNCIA CONSTANTE DA GEOLOCALIZAÇÃO
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const meuId = "motorista_01"; // Identificador único deste súdito

            // 1. Atualiza ou cria o marcador no mapa local do motorista
            if (meuMarcador) {
                meuMarcador.setLatLng([lat, lng]);
            } else {
                meuMarcador = L.marker([lat, lng], { draggable: false }).addTo(map)
                    .bindPopup('Vossa Posição Atual, Comandante').openPopup();
            }

            // 2. Centraliza o mapa na nova posição
            map.panTo([lat, lng]);

            // 3. ENVIA PARA O TRONO (Mapa Principal)
            socket.emit('update_location', {
                id: meuId,
                lat: lat,
                lng: lng,
                status: 'online'
            });

        }, (error) => {
            console.error("Erro ao reportar posição ao Rei: ", error);
        }, {
            enableHighAccuracy: true
        });
    }

    // AJUSTA ZOOM AO TERRITÓRIO (Caso itaquaLayer já esteja definido)
    if (typeof itaquaLayer !== 'undefined') {
        map.fitBounds(itaquaLayer.getBounds());
    }

});
