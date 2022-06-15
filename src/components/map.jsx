import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom/client'
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import Popup from './popup'
import {placesData} from '../assets/placesData'
import icon from '../assets/custom_marker.png'

import './map.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
    const mapContainer = useRef(null);
    const [lng, setLng]= useState(-76.9750541388)
    const [lat, setLat]= useState(38.8410857803)
    const [zoom, setZoom]= useState(12)

    useEffect(()=>{
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: zoom
        })

        map.addControl(new mapboxgl.NavigationControl(), 'top-right' );
        
        map.on('move',()=>{
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));     
        })

        map.on('load',()=>{
            
            map.loadImage(icon, (error, image)=>{
                if(error) throw error;
                map.addImage('custom-marker', image);
            })
            
            map.addSource('places', {
                type: 'geojson',
                data: placesData
            })

            map.addLayer({
                id: 'places',
                type: 'symbol',
                source: 'places',
                layout:{
                    "icon-image": "custom-marker",
                    "text-field": ["get", "title"],
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 1.25],
                    "text-anchor": "top",
                }
            });
        })

        map.on('click', 'places',(e)=>{
            console.log('clicked', e.features[0].properties.description)
            const coordinates = e.features[0].geometry.coordinates.slice();
            const feature = e.features[0];
            const popupNode = document.createElement("div");
            const node = ReactDOM.createRoot(popupNode);
            node.render(<Popup feature={feature}/>)

            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(popupNode)
            .addTo(map);
        })
        
        map.on('mousemove','places',(e)=>{
            map.getCanvas().style.cursor = 'pointer';
        })

        map.on('mouseleave','places',()=>{
            map.getCanvas().style.cursor ='';
        })



        return ()=>map.remove();
    },[])

  return (
    <div>
        <div className="sidebar">
            <div>
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
        </div>
        <div className="map-container" ref={mapContainer}></div>
    </div>
  )
}

export default Map