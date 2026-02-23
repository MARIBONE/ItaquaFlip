$(document).ready(function () {

    // MAPA
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

  // O MAPA QUE NUNCA FALHA — BASE SÓLIDA
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'mapa-real-preto' // A etiqueta de Vossa Majestade
}).addTo(map);

   
    

    // AJUSTA ZOOM AO TERRITÓRIO REAL
    map.fitBounds(itaquaLayer.getBounds());

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');

});
__________________________________________________________________________________________________________________________________________________________________

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

      fetch('https://script.google.com/macros/s/AKfycbyJumsnPVeASMTsv9ZAFCRmX99MU_GvyMQWgZiBecvHHXNQnw_X-9Lb0xlkThRvnVNEhA/execT', {
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
