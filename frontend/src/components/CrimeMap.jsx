import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function CrimeMap({ crimes = [], hotspots = [] }) {
  const center = [13.0, 76.6]
  const [district, setDistrict] = useState('')
  const [crimeType, setCrimeType] = useState('')
  const [dateFrom, setDateFrom] = useState('2022-01-01')
  const [dateTo, setDateTo] = useState('2025-01-01')

  const districts = useMemo(() => [...new Set(crimes.map((crime) => crime.district))].sort(), [crimes])
  const crimeTypes = useMemo(() => [...new Set(crimes.map((crime) => crime.crime_type))].sort(), [crimes])

  const filteredCrimes = useMemo(() => {
    return crimes.filter((crime) => {
      const matchesDistrict = district ? crime.district === district : true
      const matchesCrimeType = crimeType ? crime.crime_type === crimeType : true
      const crimeDate = crime.crime_date
      return (
        matchesDistrict &&
        matchesCrimeType &&
        crimeDate >= dateFrom &&
        crimeDate <= dateTo
      )
    })
  }, [crimes, district, crimeType, dateFrom, dateTo])

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Crime Map Explorer</h2>
      <div className="grid gap-4 lg:grid-cols-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">District</label>
          <select value={district} onChange={(event) => setDistrict(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
            <option value="">All Districts</option>
            {districts.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Crime Type</label>
          <select value={crimeType} onChange={(event) => setCrimeType(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
            <option value="">All Types</option>
            {crimeTypes.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">From</label>
          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">To</label>
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" />
        </div>
      </div>
      <div className="h-[620px] rounded-3xl overflow-hidden">
        <MapContainer center={center} zoom={7} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hotspots.map((spot) => (
            <CircleMarker
              key={spot.cluster_id}
              center={[spot.center_lat, spot.center_lon]}
              radius={Math.min(35, 8 + spot.crime_count / 8)}
              pathOptions={{ color: '#ef4444', fillColor: '#fca5a5', fillOpacity: 0.35 }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">Hotspot Cluster</p>
                  <p>Crime Count: {spot.crime_count}</p>
                  <p>Center Lat: {spot.center_lat.toFixed(4)}</p>
                  <p>Center Lon: {spot.center_lon.toFixed(4)}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          {filteredCrimes.map((crime) => (
            <Marker key={crime.crime_id} position={[crime.latitude, crime.longitude]} icon={markerIcon}>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{crime.crime_type}</p>
                  <p>{crime.district}</p>
                  <p>{crime.police_station}</p>
                  <p>{crime.crime_date} {crime.crime_time}</p>
                  <p>Severity: {crime.severity}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default CrimeMap
