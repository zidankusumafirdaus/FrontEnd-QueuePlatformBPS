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

      <div className="flex flex-col md:flex-row items-center justify-between w-full mb-4">
        {/* Info Expiry */}
        <div className="flex items-center gap-4 flex-1">
          <p className="text-sm text-gray-600 font-medium whitespace-nowrap">Default expiry (hari) saat ini:</p>
          {daysLoading ? (
            <p className="text-blue-500 animate-pulse font-medium">Memuat...</p>
          ) : daysError ? (
            <p className="text-red-500 text-sm font-medium">Gagal memuat data</p>
          ) : (
            <p className="text-4xl font-bold text-[#F87171] tracking-tight">{defaultDays}</p>
          )}
        </div>  
        {/* Form Set Expiry */}
        <div className="flex items-center flex-1 justify-end w-full md:w-auto">
          <label className="font-medium text-gray-700 mr-4 whitespace-nowrap">Set default expiry (hari):</label>
          <input
            type="number"
            min={1}
            value={newExpiry}
            onChange={(e) => setNewExpiry(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded w-24 text-gray-700 focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171] focus:outline-none transition-all"
          />
          <button
            onClick={() => updateExpiry(Number(newExpiry))}
            disabled={!newExpiry}
            className="ml-4 bg-[#F87171] hover:bg-[#ef4444] text-white px-4 py-1 rounded font-medium disabled:opacity-50 disabled:hover:bg-[#F87171] transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpiredLogConfig
