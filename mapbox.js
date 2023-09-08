document.addEventListener('DOMContentLoaded', () => {
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Vsa2lyayIsImEiOiJjbGZzdzYzMjcwNHhiM2VxeXJ4NmNqeGJvIn0.v0QKq879I_PYnCtXLo_aNg';
// Add the map to the page
const map = new mapboxgl.Map({
        container: document.querySelector('#map'),
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-77.034084142948, 38.909671288923],
        zoom: 3,
        cooperativeGestures: true
    });

    let geojson;
    fetch('./teachersdataGeoJSON.json')
        .then((response) => response.json())
        .then((data) => {
            // Use the loaded GeoJSON data here
            geojson = data;
            // add markers to map
            for (const feature of geojson.features) {
                // create a HTML element for each feature
                const el = document.createElement('div');
                el.className = 'marker';
                el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#0061ff}</style><path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/></svg>`
                // make a marker for each feature and add to the map
                new mapboxgl.Marker(el)
                    .setLngLat(feature.geometry.coordinates)
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `<h3>${feature.properties.name}</h3>
                            <p>${feature.properties.address}</p>
                            <p>${feature.properties.email}</p>
                            <p>${feature.properties.website}</p>`
                        )
                    )
                    .addTo(map);
                const listingsDiv = document.getElementById('listings');
                const newListing = document.createElement('div');
                newListing.className = 'instructor-listing';
                newListing.id = `listing-${feature.properties.id}`;
                newListing.innerHTML = `
                    <h2>${feature.properties.name}</h2>
                    <p>distance away</p>
                    <p>${feature.properties.address}</p>
                    <p>${feature.properties.email}</p>
                    <p>${feature.properties.phone}</p>`
                newListing.addEventListener('click', () => {
                    // 1. Fly to the point
                    map.flyTo({ 
                        center: feature.geometry.coordinates, 
                        zoom: 15,
                        curve: 1.2 });
                    // 2. Close all other popups and display popup for clicked store
                    createPopUp(feature);
                    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
                    const activeItem = document.getElementsByClassName('active');
                    if (activeItem[0]) {
                        activeItem[0].classList.remove('active');
                    }
                    newListing.classList.add('active');
                }
                );
                listingsDiv.appendChild(newListing);
                }
        })
        .catch((error) => {
            console.error('Error loading JSON data:', error);
        });

    // Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
});