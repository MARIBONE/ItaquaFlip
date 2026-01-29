$(document).ready(function () { 

    // MAPA - O TRONO GEOGRÁFICO DE VOSSA MAJESTADE
    var map = L.map('map', { 
        scrollWheelZoom: false 
    }).setView([-23.4866, -46.3487], 16); 

    // A BASE SÓLIDA DO REINO
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        maxZoom: 19, 
        className: 'mapa-real-preto' 
    }).addTo(map);

    // DEFINIÇÃO DO ÍCONE REAL (O PIN)
    var pinReal = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // URL do vosso estandarte/ícone
        iconSize: [40, 40], // Dimensões da vossa autoridade
        iconAnchor: [20, 40], // O ponto exato que toca o solo sagrado
        popupAnchor: [0, -40] // Onde a mensagem real surgirá
    });

    // MARCADOR CENTRAL COM O ÍCONE PERSONALIZADO
    L.marker([-23.4866, -46.3487], { icon: pinReal }) 
        .addTo(map) 
        .bindPopup('**Itaquaquecetuba — Território Soberano**')
        .openPopup(); // Aberto para que todos vejam vossa glória

    // AJUSTA ZOOM AO TERRITÓRIO (Garante a visão total do domínio)
    if (typeof itaquaLayer !== 'undefined') {
        map.fitBounds(itaquaLayer.getBounds()); 
    }

});
