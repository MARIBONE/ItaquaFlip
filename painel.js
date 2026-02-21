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

      fetch('1FY39DZYwobqf0OY87jrlcNwDt3kDqp5zEbTFXlPmcic/edit?gid=0#gid=0', {
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
