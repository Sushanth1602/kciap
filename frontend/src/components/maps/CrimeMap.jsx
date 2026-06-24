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
  const [dateTo, setDateTo] = useState('2026-12-31')

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
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <h2 className="mb-4 text-lg font-bold text-govnavy uppercase tracking-wide border-l-4 border-govgold pl-3">Crime Map Explorer</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">District</label>
          <select value={district} onChange={(event) => setDistrict(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none">
            <option value="">All Districts</option>
            {districts.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Crime Type</label>
          <select value={crimeType} onChange={(event) => setCrimeType(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none">
            <option value="">All Types</option>
            {crimeTypes.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">From Date</label>
          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">To Date</label>
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>
      <div className="h-[550px] rounded-2xl overflow-hidden border border-slate-200">
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
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-red-700">Hotspot Cluster</p>
                  <p className="text-slate-600">Incident Count: <strong>{spot.crime_count}</strong></p>
                  <p className="text-slate-400">Lat: {spot.center_lat.toFixed(4)}, Lon: {spot.center_lon.toFixed(4)}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          {filteredCrimes.map((crime) => (
            <Marker key={crime.crime_id} position={[crime.latitude, crime.longitude]} icon={markerIcon}>
              <Popup>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-govnavy">{crime.crime_type}</p>
                  <p className="text-slate-600"><strong>District:</strong> {crime.district}</p>
                  <p className="text-slate-600"><strong>Station:</strong> {crime.police_station}</p>
                  <p className="text-slate-600"><strong>Date/Time:</strong> {crime.crime_date} {crime.crime_time}</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-1 ${
                    crime.severity >= 4 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    Severity {crime.severity}
                  </span>
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
