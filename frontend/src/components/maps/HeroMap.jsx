import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

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

export default function HeroMap({ hotspots = [], districtStats = [], riskColored = false }) {
  const center = [14.8, 76.2] // Centered on Karnataka
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [loadingGeoJson, setLoadingGeoJson] = useState(true)

  useEffect(() => {
    const primaryUrl = 'https://raw.githubusercontent.com/inosaint/StatesOfIndia/master/karnataka.geojson'
    const backupUrl = 'https://raw.githubusercontent.com/sab99r/Karnataka-GeoJSON/master/karnataka.geojson'

    const fetchGeoJson = async () => {
      try {
        const res = await fetch(primaryUrl)
        if (!res.ok) throw new Error(`Primary fetch failed with status ${res.status}`)
        const data = await res.json()
        setGeoJsonData(data)
      } catch (err) {
        console.warn(`Primary GeoJSON loading error (${err.message}). Trying backup URL...`)
        try {
          const res = await fetch(backupUrl)
          if (!res.ok) throw new Error(`Backup fetch failed with status ${res.status}`)
          const data = await res.json()
          setGeoJsonData(data)
        } catch (backupErr) {
          console.error('All Karnataka GeoJSON fetches failed:', backupErr.message)
        }
      } finally {
        setLoadingGeoJson(false)
      }
    }

    fetchGeoJson()
  }, [])

  // Dynamic style calculation
  const getStyleForFeature = (feature) => {
    if (!riskColored) {
      return {
        fillColor: '#1E40AF',
        fillOpacity: 0.05,
        color: '#0B1F4D',
        weight: 1.5,
        dashArray: '3',
      }
    }

    const districtName = feature.properties.district || feature.properties.NAME_2 || feature.properties.DISTRICT || ''
    const stat = districtStats.find(d => d.district && d.district.toLowerCase() === districtName.toLowerCase())
    const count = stat ? stat.count : 0

    // Thresholds: Red (High) >= 50, Yellow (Medium) >= 15, Green (Low) < 15
    let color = '#22C55E' // Low (Green)
    let opacity = 0.15
    if (count >= 50) {
      color = '#EF4444' // High (Red)
      opacity = 0.35
    } else if (count >= 15) {
      color = '#F59E0B' // Medium (Yellow)
      opacity = 0.25
    }

    return {
      fillColor: color,
      fillOpacity: opacity,
      color: '#0B1F4D',
      weight: 1.5,
      dashArray: '3',
    }
  }

  const onEachDistrict = (feature, layer) => {
    const districtName = feature.properties.district || feature.properties.NAME_2 || feature.properties.DISTRICT || ''
    const stat = districtStats.find(d => d.district && d.district.toLowerCase() === districtName.toLowerCase())
    const count = stat ? stat.count : 0

    layer.bindTooltip(`
      <div style="font-family: Inter, sans-serif; padding: 2px 6px;">
        <strong style="color: #0B1F4D;">${districtName}</strong><br/>
        <span style="color: #64748b; font-size: 11px;">Reported Incidents:</span> 
        <strong style="color: #1E40AF;">${count || '0'}</strong>
      </div>
    `, { sticky: true })

    layer.on({
      mouseover: (e) => {
        const l = e.target
        l.setStyle({
          fillOpacity: riskColored ? 0.5 : 0.15,
          color: '#D4A017', // Gold border highlight
          weight: 2.5,
        })
      },
      mouseout: (e) => {
        const l = e.target
        l.setStyle(getStyleForFeature(feature))
      }
    })
  }

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden shadow-inner flex flex-col">
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs select-none">
        <h3 className="font-bold text-govnavy flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          State Incident Map (Live)
        </h3>
        <p className="text-[10px] text-slate-500 mt-0.5 font-medium">District boundaries & Active Hotspots</p>
      </div>

      <div className="flex-grow h-full w-full">
        <MapContainer 
          center={center} 
          zoom={6.8} 
          scrollWheelZoom={false} 
          zoomSnap={0.1}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {!loadingGeoJson && geoJsonData && (
            <GeoJSON 
              data={geoJsonData} 
              style={getStyleForFeature} 
              onEachFeature={onEachDistrict}
            />
          )}

          {Object.entries(DISTRICT_COORDS).map(([name, coords]) => {
            const stat = districtStats.find(d => d.district === name)
            const count = stat ? stat.count : 0
            
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
                    <p className="text-slate-600">Incident Count: <strong className="text-govblue">{count || '0'}</strong></p>
                    <p className="text-[10px] text-slate-400 font-medium">Coords: {coords[0].toFixed(2)}, {coords[1].toFixed(2)}</p>
                    {hasHotspots && <p className="text-red-500 font-semibold text-[10px] flex items-center gap-1">⚠️ Active Hotspot Cluster</p>}
                  </div>
                </Popup>
              </Marker>
            )
          })}

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
                  <p className="text-slate-600">Density: <strong>{spot.crime_count} incidents</strong></p>
                  <p className="text-[10px] text-slate-400">Lat: {spot.center_lat.toFixed(4)}, Lon: {spot.center_lon.toFixed(4)}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

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
