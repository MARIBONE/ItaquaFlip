// Removido o jQuery para evitar conflitos no Reino
window.onload = function() {

    // MAPA - Criado com a precisão de um ourives
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    // O MAPA QUE NUNCA FALHA
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // MARCADOR CENTRAL - O ponto de vossa glória
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');

    /* Atenção: Removi o fitBounds(itaquaLayer) pois a variável 
       itaquaLayer não estava definida e causava o colapso do sistema.
    */
};
