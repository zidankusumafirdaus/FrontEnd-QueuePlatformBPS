import React from "react"

const CSLogsTable = ({ logs, isLoading }) => {
  const getActionStyle = (action) => {
    const act = action.toLowerCase()

    if (act.includes("delete") || act.includes("hapus")) {
      return { bg: "bg-[#F87171]/10", text: "text-[#F87171]", border: "border-[#F87171]/20" }
    }
    if (act.includes("reset") || act.includes("manual")) {
      return { bg: "bg-[#F7941D]/10", text: "text-[#F7941D]", border: "border-[#F7941D]/20" }
    }
    if (act.includes("create") || act.includes("add") || act.includes("tambah")) {
      return { bg: "bg-[#8DC63F]/10", text: "text-[#8DC63F]", border: "border-[#8DC63F]/20" }
    }
    if (act.includes("update") || act.includes("edit") || act.includes("ubah")) {
      return { bg: "bg-[#00AEEF]/10", text: "text-[#00AEEF]", border: "border-[#00AEEF]/20" }
    }
    if (act.includes("login") || act.includes("logout") || act.includes("masuk") || act.includes("keluar")) {
      return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" }
    }
    if (act.includes("export") || act.includes("download")) {
      return { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-200" }
    }
    if (act.includes("view") || act.includes("read") || act.includes("lihat")) {
      return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" }
    }

    return { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" }
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <p className="text-[#00AEEF] text-lg font-semibold animate-pulse">Memuat data log...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg font-medium">Tidak ada data log aktivitas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 font-poppins text-sm">
            <thead className="bg-[#00AEEF]/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                  ID Log
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                  ID Admin
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-[#222]">
              {logs.map((log) => {
                const dateObj = new Date(log.timestamp)
                const tanggal = dateObj.toLocaleDateString("id-ID")
                const waktu = dateObj.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })

                const style = getActionStyle(log.action)

                return (
                  <tr key={log.log_id} className="hover:bg-[#00AEEF]/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">{log.log_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${style.bg} ${style.text} border ${style.border}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.admin_env}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.admin_id !== null ? (
                        <span className="font-mono text-[#00AEEF]">{log.admin_id}</span>
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{tanggal}</span>
                        <span className="text-xs text-gray-500 font-mono">{waktu}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default CSLogsTable
