document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('establishments-map').setView([46.603354, 1.888334], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const establishments = establishmentsData.establishments;
    
    establishments.forEach(establishment => {
        const marker = L.marker([
            parseFloat(establishment.lat), 
            parseFloat(establishment.lng)
        ]).addTo(map);
        
        marker.bindPopup(`
            <strong></strong><br>
            <br>
            Observations: 
        `);
    });
});