import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, LayersControl } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
// import { latLng } from 'leaflet';


const MapComponent = () => {
    const mapRef = useRef();

    const [mapLayers, setMapLayers] = useState([]);
    // const [baseLayer, setBaseLayer] = useState('Satellite');

    const _onCreate = (event) => {
        console.log(event);
        const { layerType, layer } = event;
        if (layerType === 'polygon') {
            const { _leaflet_id } = layer;

            setMapLayers(layers => [...layers, { id: _leaflet_id, latlngs: layer.getLatLngs()[0] }])
        }
    }
    const _onEdited = (event) => {
        console.log(event);
        const { layers: { _layers } } = event;
        Object.values(_layers).map(({ _layers_id, editing }) => {
            setMapLayers(layers => layers.map(l => l.id === _layers_id ? { ...l, latlngs: { ...editing.latlngs[0] } } : l));
        })

    }
    const _onDeleted = (event) => {
        console.log(event);
        const { layers: { _layers } } = event;
        Object.values(_layers).map(({ _leaflet_id }) => {
            setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id))
        })
    }


    return (
        <>
            <MapContainer
                // center={[-1.286389, 36.817223]}
                center={[-4.054429, 39.661073]}
                zoom={14}
                style={{ height: '600px', width: '80%', margin: '40px' }}
                ref={mapRef} >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <FeatureGroup>
                    <EditControl
                        position='topleft'
                        onCreated={_onCreate}
                        onEdited={_onEdited}
                        onDeleted={_onDeleted}
                        draw={{
                            polygon: true,
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                            marker: false,
                            polyline: false,
                        }}
                    />
                </FeatureGroup>

            </MapContainer >

            <p className='text-left'> {JSON.stringify(mapLayers, 0, 2)} </p>
        </>
    )
}

export default MapComponent;