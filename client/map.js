let map;
let location;

function setLocation(position) {
  map.setView([position.coords.latitude, position.coords.longitude], 18);
}

document.addEventListener("DOMContentLoaded", async () => {
  map = L.map("map", {
    doubleClickZoom: false,
    zoomControl: false,
    minZoom: 13,
  });

  navigator.geolocation.getCurrentPosition(setLocation);

  L.tileLayer(
    `https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=76506c0cca54471c8ab044c3d9bb37cd`,
    { useCache: true }
  ).addTo(map);
});
