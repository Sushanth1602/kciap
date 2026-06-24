import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom DivIcons for pulsing markers
const pulseRedIcon = new L.DivIcon({
  className: 'map-pulse-container',
  html: '<div class="map-pulse-marker"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const pulseGoldIcon = new L.DivIcon({
  className: 'map-pulse-container',
  html: '<div class="map-pulse-marker-gold"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const DISTRICT_COORDS = {
  "Bengaluru Urban": [12.9716, 77.5946],
  "Mysuru": [12.2958, 76.6394],
  "Mangaluru": [12.9141, 74.8560],
  "Belagavi": [15.8497, 74.4977],
  "Kalaburagi": [17.3297, 76.8343],
  "Shivamogga": [13.9299, 75.5681],
  "Hubballi-Dharwad": [15.3647, 75.1239],
  "Tumakuru": [13.3419, 77.1130],
  "Ballari": [15.1394, 76.9214],
  "Vijayapura": [16.8240, 75.7100],
}

export default function HeroMap({ hotspots = [], districtStats = [] }) {
  const center = [14.8, 76.2] // Centered on Karnataka
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [loadingGeoJson, setLoadingGeoJson] = useState(true)

  useEffect(() => {
    // Attempt to load Karnataka GeoJSON from public repository
    fetch('https://raw.githubusercontent.com/sab99r/Karnataka-GeoJSON/master/karnataka.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch GeoJSON')
        return res.json()
      })
      .then((data) => {
        setGeoJsonData(data)
        setLoadingGeoJson(false)
      })
      .catch((err) => {
        console.error('GeoJSON loading error:', err)
        setLoadingGeoJson(false)
      })
  }, [])

  // Style for district polygons
  const geoJsonStyle = {
    fillColor: '#1E40AF', // Karnataka Police Blue
    fillOpacity: 0.05,
    color: '#0B1F4D', // Navy Blue borders
    weight: 1.5,
    dashArray: '3',
  }

  // Highlight district on hover
  const onEachDistrict = (feature, layer) => {
    // Find district name in geojson properties
    const districtName = feature.properties.district || feature.properties.NAME_2 || feature.properties.DISTRICT || ''
    
    // Find if we have stats for this district
    const stat = districtStats.find(d => d.district && d.district.toLowerCase() === districtName.toLowerCase())
    const count = stat ? stat.count : 0

    layer.bindTooltip(`
      <div style="font-family: Inter, sans-serif; padding: 2px 6px;">
        <strong style="color: #0B1F4D;">${districtName}</strong><br/>
        <span style="color: #64748b; font-size: 11px;">Reported Incidents:</span> 
        <strong style="color: #1E40AF;">${count || 'N/A'}</strong>
      </div>
    `, { sticky: true })

    layer.on({
      mouseover: (e) => {
        const l = e.target
        l.setStyle({
          fillOpacity: 0.15,
          color: '#D4A017', // Gold border highlight
          weight: 2.5,
        })
      },
      mouseout: (e) => {
        const l = e.target
        l.setStyle(geoJsonStyle)
      }
    })
  }

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden shadow-inner flex flex-col">
      {/* Header overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs select-none">
        <h3 className="font-bold text-govnavy flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          State Incident Map (Live)
        </h3>
        <p className="text-[10px] text-slate-500 mt-0.5 font-medium">District boundaries & Active Hotspots</p>
      </div>

      {/* Map Container */}
      <div className="flex-grow h-full w-full">
        <MapContainer 
          center={center} 
          zoom={6.8} 
          scrollWheelZoom={false} 
          zoomSnap={0.1}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Grayscale CartoDB Positron Tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* District Boundaries Layer */}
          {!loadingGeoJson && geoJsonData && (
            <GeoJSON 
              data={geoJsonData} 
              style={geoJsonStyle} 
              onEachFeature={onEachDistrict}
            />
          )}

          {/* Static District Markers (Fallback / Hover Targets) */}
          {Object.entries(DISTRICT_COORDS).map(([name, coords]) => {
            const stat = districtStats.find(d => d.district === name)
            const count = stat ? stat.count : 0
            
            // Check if this district has hotspots to decide pulse color
            const hasHotspots = hotspots.some(h => {
              const latDiff = Math.abs(h.center_lat - coords[0])
              const lonDiff = Math.abs(h.center_lon - coords[1])
              return latDiff < 0.25 && lonDiff < 0.25
            })

            return (
              <Marker 
                key={name} 
                position={coords} 
                icon={hasHotspots ? pulseRedIcon : pulseGoldIcon}
              >
                <Popup>
                  <div className="font-sans text-xs space-y-1">
                    <p className="font-bold text-govnavy border-b pb-1 mb-1">{name}</p>
                    <p className="text-slate-600">Incident Count: <strong className="text-govblue">{count || 'Loading...'}</strong></p>
                    <p className="text-[10px] text-slate-400 font-medium">Coordinates: {coords[0].toFixed(2)}, {coords[1].toFixed(2)}</p>
                    {hasHotspots && <p className="text-red-500 font-semibold text-[10px] flex items-center gap-1">⚠️ Active Hotspot Cluster Detected</p>}
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* Live Hotspot Circles */}
          {hotspots.map((spot, idx) => (
            <CircleMarker
              key={`hotspot-${idx}-${spot.cluster_id}`}
              center={[spot.center_lat, spot.center_lon]}
              radius={Math.min(22, 6 + spot.crime_count / 10)}
              pathOptions={{ 
                color: '#ef4444', 
                fillColor: '#ef4444', 
                fillOpacity: 0.2, 
                weight: 1.5,
                className: 'animate-pulse' 
              }}
            >
              <Popup>
                <div className="font-sans text-xs space-y-1">
                  <p className="font-bold text-red-700">Cluster Hotspot</p>
                  <p className="text-slate-600">Density Score: <strong className="text-slate-900">{spot.crime_count} incidents</strong></p>
                  <p className="text-[10px] text-slate-400">Lat: {spot.center_lat.toFixed(4)}, Lon: {spot.center_lon.toFixed(4)}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-slate-200 px-3 py-2 flex justify-between items-center gap-4 text-[10px] font-semibold text-slate-600 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block border border-white shadow-sm"></span>
          <span>Red Alert Pulse (Hotspots)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-govgold inline-block border border-white shadow-sm"></span>
          <span>Gold Alert Pulse (Monitored HQ)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 border-t-2 border-dashed border-govnavy inline-block"></span>
          <span>District Boundaries</span>
        </div>
      </div>
    </div>
  )
}
