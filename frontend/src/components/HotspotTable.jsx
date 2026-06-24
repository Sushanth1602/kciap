function HotspotTable({ hotspots }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Hotspot Clusters</h2>
      <div className="max-h-96 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="border-b px-3 py-2">Cluster ID</th>
              <th className="border-b px-3 py-2">Crime Count</th>
              <th className="border-b px-3 py-2">Latitude</th>
              <th className="border-b px-3 py-2">Longitude</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map((spot) => (
              <tr key={spot.cluster_id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-3 py-2">{spot.cluster_id}</td>
                <td className="px-3 py-2">{spot.crime_count}</td>
                <td className="px-3 py-2">{spot.center_lat.toFixed(4)}</td>
                <td className="px-3 py-2">{spot.center_lon.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HotspotTable
