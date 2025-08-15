
const lat = 18.5204; // Example latitude
const lng = 73.8567; // Example longitude
const zoomLevel = 18;

const map = L.map('map').setView([lat, lng], zoomLevel);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([lat, lng]).addTo(map)
    .bindPopup()
    .openPopup();
