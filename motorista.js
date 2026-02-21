$(document).ready(function () {
    // MAPA
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    // O MAPA QUE NUNCA FALHA
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'mapa-real-preto'
    }).addTo(map);

    // AJUSTA ZOOM AO TERRITÓRIO REAL
    if (typeof itaquaLayer !== 'undefined') {
        map.fitBounds(itaquaLayer.getBounds());
    }

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');



function enviarLocalizacao() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {

      const dados = {
        timestamp: new Date().toISOString(),     // Data/hora
        latitude: pos.coords.latitude,           // Latitude
        longitude: pos.coords.longitude,         // Longitude
        precisao: pos.coords.accuracy,           // Precisão do GPS
        status: navigator.onLine ? 'online' : 'offline' // Status
      };

      fetch('https://script.google.com/macros/s/AKfycbzn5ZlIImjgl-98ECy2bruU7ZU30Er2SUpl8FKdVCizG6mcTDaQUl2T9mghQkizXePD2Q/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      }).then(res => console.log('Dados enviados:', res.status))
        .catch(err => console.error('Erro envio:', err));

    }, erro => console.error('Erro GPS:', erro));
  } else {
    console.error('Geolocalização não suportada neste navegador.');
  }
}

// Opcional: envio automático a cada 100 segundos
setInterval(enviarLocalizacao, 100000);
