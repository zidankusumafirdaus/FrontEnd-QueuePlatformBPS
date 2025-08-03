// components/elements/ExpiredLogConfig.jsx
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { setDefaultLogExpiry, getDefaultLogExpiry } from "../../service/api/api"

const ExpiredLogConfig = ({ refetchKey = "cslogs" }) => {
  const [newExpiry, setNewExpiry] = useState("")
  const queryClient = useQueryClient()

  const {
    data: defaultDays,
    isLoading: daysLoading,
    isError: daysError,
  } = useQuery({
    queryKey: ["defaultLogExpiry"],
    queryFn: getDefaultLogExpiry,
    staleTime: 1000 * 60 * 5,
  })

  const { mutate: updateExpiry } = useMutation({
    mutationFn: setDefaultLogExpiry,
    onSuccess: (data) => {
      alert(data.pesan)
      queryClient.invalidateQueries(["defaultLogExpiry"])
      queryClient.invalidateQueries([refetchKey])
    },
    onError: () => alert("Gagal mengubah konfigurasi default expiry"),
  })

  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h2 className="text-lg font-semibold text-[#F87171] mb-4">Konfigurasi Log Kedaluwarsa</h2>

      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 mb-1">Default expiry (hari) saat ini:</p>
        {daysLoading ? (
          <p className="text-blue-500 animate-pulse">Memuat...</p>
        ) : daysError ? (
          <p className="text-red-500 text-sm">Gagal memuat data</p>
        ) : (
          <p className="text-4xl font-bold text-[#F87171]">{defaultDays}</p>
        )}
      </div>

      <div className="flex items-center justify-center">
        <label className="font-medium mr-4">Set default expiry (hari):</label>
        <input
          type="number"
          min={1}
          value={newExpiry}
          onChange={(e) => setNewExpiry(e.target.value)}
          className="border px-3 py-1 rounded w-24"
        />
        <button
          onClick={() => updateExpiry(Number(newExpiry))}
          disabled={!newExpiry}
          className="ml-4 bg-[#F87171] text-white px-4 py-1 rounded"
        >
          Simpan
        </button>
      </div>
    </div>
  )
}

export default ExpiredLogConfig
