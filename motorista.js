navigator.geolocation.getCurrentPosition(function(position) {

    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    // Cria o marcador no mapa
    var marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("SEU LOCAL")
        .openPopup();

    map.setView([lat, lng], 17);

    // AGORA pegamos exatamente do pin
    var pinLat = marker.getLatLng().lat;
    var pinLng = marker.getLatLng().lng;

    // Envia para a planilha
    const dados = {
        timestamp: new Date().toISOString(),
        latitude: pinLat,
        longitude: pinLng,
        precisao: position.coords.accuracy,
        status: navigator.onLine ? 'online' : 'offline'
    };

    fetch('https://script.google.com/macros/s/AKfycbz6bm4rqeA6_88ztbBVwr_JnQFBmVdsA8Gz9p1pK9heomd9-HFge8Ny6VPF30I5H57LQQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

});
