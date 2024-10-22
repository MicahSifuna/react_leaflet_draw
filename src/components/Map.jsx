import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';
import { EditControl } from "react-leaflet-draw"

const Map = () => {
   const mapRef = useRef();

   useEffect(() => {
      const map = mapRef.current;

      if (map) {
         const drawnItems = new L.FeatureGroup();
         map.addLayer(drawnItems);

         // Load saved shapes from localStorage and add them to the map
         const savedData = localStorage.getItem('drawnItems');
         if (savedData) {
            const savedLayers = JSON.parse(savedData);
            L.geoJSON(savedLayers).eachLayer((layer) => {
               drawnItems.addLayer(layer);
            });
         }

         // Initialize the draw control (make sure this is always present)
         const drawControl = new L.Control.Draw({
            edit: {
               featureGroup: drawnItems,
            },
            draw: {
               polygon: true,
               circle: true,
               rectangle: true,
               marker: false, // Disable marker drawing if not needed
               polyline: false, // Disable polyline drawing if not needed
            },
         });

         // Add the draw control to the map (make sure this is always added)
         map.addControl(drawControl);

         // Event listener for created layers (when user finishes drawing)
         map.on(L.Draw.Event.CREATED, (e) => {
            const { layerType, layer } = e;

            // Clear all existing layers before adding the new one
            drawnItems.clearLayers();

            // Add the newly drawn layer to the feature group
            drawnItems.addLayer(layer);

            // Save the new drawn items to local storage
            const geoJSONData = drawnItems.toGeoJSON();
            localStorage.setItem('drawnItems', JSON.stringify(geoJSONData));

            if (layerType === 'polygon') {
               console.log('Polygon drawn:', layer.getLatLngs());
            } else if (layerType === 'circle') {
               console.log('Circle drawn:', layer.getLatLng(), layer.getRadius());
            } else if (layerType === 'rectangle') {
               console.log('Rectangle drawn:', layer.getBounds());
            }
         });

         // Optional: Handle the edit event to save changes to localStorage
         map.on(L.Draw.Event.EDITED, () => {
            const geoJSONData = drawnItems.toGeoJSON();
            localStorage.setItem('drawnItems', JSON.stringify(geoJSONData));
         });
      }
   }, []);

   return (
      <MapContainer
         center={[-1.286389, 36.817223]}
         zoom={13}
         style={{ height: '600px', width: '80%', margin: '40px' }}
         ref={mapRef}
         whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
         }}

      >
         <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         />
      </MapContainer >
   );
};

export default Map;