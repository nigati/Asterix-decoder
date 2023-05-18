<script>
    import { onMount } from 'svelte';
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
  
    let map;
  
    onMount(() => {
      console.log('Map mounted');
      map = L.map('map').setView([41.289, 2.07], 13);
  
      // Configurar la CSP manualmente
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute(
        'content',
        "default-src 'self'; img-src 'self' data: https://*.tile.openstreetmap.org"
      );
      document.head.appendChild(meta);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);
    });
  </script>
  
  <style>
    #map {
      width: 100%;
      height: 400px;
    }
  </style>
  
  <div id="map"></div>
  
  
  
  
  

