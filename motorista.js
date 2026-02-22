$(document).ready(function () {
    // 1. INICIALIZAÇÃO DO MAPA NO CENTRO DO REINO
    var map = L.map('map', { scrollWheelZoom: false }).setView([-23.4866, -46.3487], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    
    var marcadorReal = null;
    var enviadoAoCastelo = false;

    
     
