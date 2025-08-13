import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { getCSLogs } from "../../service/api/api"
import ExportLogButton from "../../components/export/ExportLogButton"
import SidebarAdmin from "../../components/layout/SidebarAdmin"
import ExpiredLogConfig from "../../components/core/ExpiredLogConfig"
import CSLogsTable from "../../components/tables/CSLogsTable"

const CSLogs = () => {
  const navigate = useNavigate()

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["cslogs"],
    queryFn: getCSLogs,
    staleTime: 1000 * 60 * 5,
    retry: false,
    onError: (err) => {
      console.error("Gagal mengambil log CS:", err)
      if (err.response?.status === 403) navigate("/403")
      else if (err.response?.status === 405) navigate("/405")
      else if (err.response?.status === 500) navigate("/500")
      else alert("Gagal mengambil log CS. Silakan coba lagi.")
    },
  })

  return (
    <div className="flex h-screen bg-[#F5F8FA] font-poppins">
      <SidebarAdmin />

      <main className="flex-1 overflow-auto p-8 font-poppins">
        <h1 className="text-4xl font-bold mb-8 text-[#00AEEF] drop-shadow-sm">
          Log Aktivitas Customer Service
        </h1>

        <section className="bg-white p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between">
          <span className="text-lg font-semibold text-[#8DC63F]">Export Data Log</span>
          <ExportLogButton />
        </section>

        <ExpiredLogConfig refetchKey="cslogs" />

        <CSLogsTable logs={logs} isLoading={isLoading} />
      </main>
    </div>
  )
}

export default CSLogs
