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
    long: pos.coords.longitude
  };

  fetch('https://script.google.com/macros/s/AKfycbzn5ZlIImjgl-98ECy2bruU7ZU30Er2SUpl8FKdVCizG6mcTDaQUl2T9mghQkizXePD2Q/exec', {
    method: 'POST',
    body: JSON.stringify(dados)
  });
}, err => console.log("Acesso negado por um súdito rebelde."));
