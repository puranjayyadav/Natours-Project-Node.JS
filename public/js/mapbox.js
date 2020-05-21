

export const displayMap = (locations)=>{
  mapboxgl.accessToken = 'pk.eyJ1IjoicHVyYW5qYXkxMDEiLCJhIjoiY2p3NHUwbWQyMDI2MTQ4cWt0cGg3N2Z1dCJ9.q3x4B9l0Ka-YASUxOG2cfw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/puranjay101/cka5ia16i14sy1isgbergarp4',
    scrollZoom:false

  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });

}


