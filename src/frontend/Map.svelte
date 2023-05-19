<script>
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';

	const accessToken = "pk.eyJ1IjoiaGF0aW05OTkiLCJhIjoiY2xodTIzYzllMGJsbDNkcWhldGYwOGw2YyJ9.bRw8kPgowd5L01YzsJNyRA"
  
	onMount(() => {
	  const map = L.map('map').setView([51.505, -0.09], 13);
  
	  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access-token=${accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
	  }).addTo(map);
  
	  L.marker([51.5, -0.09]).addTo(map)
		.bindPopup('Aqui estoy.')
		.openPopup();
	});
  </script>
  
  <div id="map" style="width: 100%; height: 400px;"></div>
  