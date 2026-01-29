$(document).ready(function () {
    // MAPA REAL
    var map = L.map('map').setView([-23.4866, -46.3487], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Dicionários para guardar os súditos e seus rastros
    var motoristasAtivos = {};
    var rotasAtivas = {};

    // Conexão com o servidor de mensagens
    const socket = io('https://seu-servidor.com.br');

    // ESCUTANDO O MOVIMENTO DOS MOTORISTAS
    socket.on('update_location', function(dados) {
        const { id, lat, lng } = dados;

        // Se o motorista é novo, criamos seu ícone e sua linha de rota
        if (!motoristasAtivos[id]) {
            // Ícone do Motorista
            motoristasAtivos[id] = L.marker([lat, lng], {
                icon: L.icon({ iconUrl: 'icone-carro.png', iconSize: [30, 30] })
            }).addTo(map).bindPopup("Motorista: " + id);

            // Linha da Rota (O rastro de glória)
            rotasAtivas[id] = L.polyline([[lat, lng]], {
                color: 'gold', 
                weight: 4,
                opacity: 0.6
            }).addTo(map);
        } else {
            // Se já existe, apenas movemos o ícone e estendemos a linha
            motoristasAtivos[id].setLatLng([lat, lng]);
            rotasAtivas[id].addLatLng([lat, lng]);
        }
    });

    // REMOVENDO QUANDO O MOTORISTA SAI DO POSTO
    socket.on('driver_offline', function(dados) {
        if (motoristasAtivos[dados.id]) {
            map.removeLayer(motoristasAtivos[dados.id]);
            map.removeLayer(rotasAtivas[dados.id]);
            delete motoristasAtivos[dados.id];
            delete rotasAtivas[dados.id];
        }
    });
});
