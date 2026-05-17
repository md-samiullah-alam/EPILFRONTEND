import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

// ============================================================
// MEMOIZED SUB-COMPONENTS
// ============================================================

const THEMES = {
  blue: "bg-blue-600 text-white",
  amber: "bg-amber-500 text-white",
  emerald: "bg-emerald-600 text-white",
  cyan: "bg-cyan-600 text-white",
  indigo: "bg-indigo-600 text-white",
  rose: "bg-rose-600 text-white",
  slate: "bg-slate-700 text-white",
};

const MiniCard = React.memo(({ title, value, theme }) => (
  <div className={`${THEMES[theme]} p-3 rounded-lg text-center shadow transition-all duration-300 hover:scale-105`}>
    <h3 className="text-[9px] uppercase font-black opacity-90">{title}</h3>
    <p className="text-lg font-black mt-1">{value ?? 0}</p>
  </div>
));

const Card = React.memo(({ title, value, theme }) => (
  <div className={`${THEMES[theme]} p-4 rounded-xl text-center shadow transition-all duration-300 hover:scale-105 hover:rotate-1`}>
    <h3 className="text-[10px] uppercase font-black opacity-80">{title}</h3>
    <p className="text-xl font-black">{value ?? 0}</p>
  </div>
));

const AdditionalSection = React.memo(({ title, data, formatPercent, singleSection = false }) => {
  if (!data) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
      <div className="px-6 py-3 border-b bg-slate-50 group-hover:bg-indigo-50 transition-colors">
        <h2 className="font-black uppercase text-slate-700 group-hover:text-indigo-700">{title}</h2>
      </div>
      {singleSection ? (
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card title="Total Work" value={data.totalWork || 0} theme="slate" />
            <Card title="Completed" value={data.completedWork || 0} theme="emerald" />
            <Card title="On Time" value={data.onTimeWork || 0} theme="cyan" />
            <Card title="Pending" value={data.pendingWork || 0} theme="amber" />
            <Card title="Pending %" value={formatPercent(data.pendingPercent)} theme="indigo" />
            <Card title="Delay %" value={formatPercent(data.delayPercent)} theme="rose" />
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {data.assigned && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Assigned Tickets</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card title="Total" value={data.assigned.totalWork || 0} theme="slate" />
                <Card title="Completed" value={data.assigned.completedWork || 0} theme="emerald" />
                <Card title="On Time" value={data.assigned.onTimeWork || 0} theme="cyan" />
                <Card title="Pending" value={data.assigned.pendingWork || 0} theme="amber" />
                <Card title="Pending %" value={formatPercent(data.assigned.pendingPercent)} theme="indigo" />
                <Card title="Delay %" value={formatPercent(data.assigned.delayPercent)} theme="rose" />
              </div>
            </div>
          )}
          {data.created && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Created Tickets</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card title="Total" value={data.created.totalWork || 0} theme="slate" />
                <Card title="Completed" value={data.created.completedWork || 0} theme="emerald" />
                <Card title="On Time" value={data.created.onTimeWork || 0} theme="cyan" />
                <Card title="Pending" value={data.created.pendingWork || 0} theme="amber" />
                <Card title="Pending %" value={formatPercent(data.created.pendingPercent)} theme="indigo" />
                <Card title="Delay %" value={formatPercent(data.created.delayPercent)} theme="rose" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });
  const [dashboardData, setDashboardData] = useState(null);

  // ================= LOAD DASHBOARD (memoized) =================
  const loadDashboardData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setIsUpdating(true);

      const response = await axios.get("/allDashboard/all-dashboard", {
        params: {
          month: selectedMonth,
          week: selectedWeek === "all" ? "" : selectedWeek,
          selectedName: user?.name || user?.key || user?.email,
        },
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      setDashboardData(response.data.data?.[0] || {});
      setWeekRange({
        start: response.data.weekStart || "N/A",
        end: response.data.weekEnd || "N/A",
      });
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  }, [user?.name, user?.token, selectedMonth, selectedWeek]);

  // ================= EFFECTS =================
  useEffect(() => { loadDashboardData(true); }, [loadDashboardData]);
  useEffect(() => {
    if (!loading) loadDashboardData(false);
  }, [selectedMonth, selectedWeek]);

  // ================= MEMOIZED CALCULATIONS (calculated ONCE per data change) =================
  const formatPercent = useCallback((value) => {
    if (!value && value !== 0) return "-0.00%";
    const num = parseFloat(value);
    return isNaN(num) ? "-0.00%" : `-${num.toFixed(2)}%`;
  }, []);

  const withoutDelData = useMemo(() => {
    if (!dashboardData) return null;
    const checklist = dashboardData.checklist || {};
    const helpAssigned = dashboardData.helpTicket?.assigned || {};
    const supportAssigned = dashboardData.supportTicket?.assigned || {};

    const totalWork = (checklist.totalWork || 0) + (helpAssigned.totalWork || 0) + (supportAssigned.totalWork || 0);
    const completedWork = (checklist.completedWork || 0) + (helpAssigned.completedWork || 0) + (supportAssigned.completedWork || 0);
    const pendingWork = (checklist.pendingWork || 0) + (helpAssigned.pendingWork || 0) + (supportAssigned.pendingWork || 0);
    const onTimeWork = (checklist.onTimeWork || 0) + (helpAssigned.onTimeWork || 0) + (supportAssigned.onTimeWork || 0);
    const pendingPercent = totalWork > 0 ? ((pendingWork / totalWork) * 100).toFixed(2) : "0.00";
    const delayPercent = totalWork > 0 ? (((totalWork - onTimeWork) / totalWork) * 100).toFixed(2) : "0.00";
    const overallScore = ((parseFloat(pendingPercent) * 0.80) + (parseFloat(delayPercent) * 0.20)).toFixed(2);

    return { totalWork, completedWork, pendingWork, onTimeWork, pendingPercent, delayPercent, overallScore };
  }, [dashboardData]);

  const delOverall = useMemo(() => {
    if (!dashboardData?.delegation) return "-0.00";
    const del = dashboardData.delegation;
    const p = parseFloat(del.pendingPercent || 0);
    const d = parseFloat(del.delayPercent || 0);
    return `-${((p * 0.80) + (d * 0.20)).toFixed(2)}`;
  }, [dashboardData]);

  const emDoerStatus = useMemo(() => {
    if (!withoutDelData) return false;
    const wo = parseFloat(withoutDelData.overallScore || 0);
    const del = parseFloat(delOverall.replace("-", "") || 0);
    return wo > 10 || del > 10;
  }, [withoutDelData, delOverall]);

  // ================= LOADING STATE =================
  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-100">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 font-bold text-[10px]">DATA</div>
      </div>
      <p className="mt-4 text-slate-600 font-black text-xs animate-pulse uppercase tracking-widest">LOADING DASHBOARD...</p>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-800 text-white px-4 py-3 md:px-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="font-black uppercase text-base md:text-lg leading-tight tracking-wider">{user?.name || "Dashboard"}</h1>
            <p className="text-[10px] md:text-xs text-blue-400 font-bold">{weekRange.start || "Loading..."} — {weekRange.end || "Loading..."}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="grid grid-cols-2 sm:flex items-center bg-slate-900 rounded-xl p-2 gap-2 w-full sm:w-auto border border-slate-700">
              <div className="flex items-center px-2">
                <span className="text-[8px] font-black text-slate-500 uppercase mr-2">Month</span>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer">
                  {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1} className="text-black">{new Date(0, i).toLocaleString("default", { month: "short" })}</option>)}
                </select>
              </div>
              <div className="flex items-center px-2 border-l border-slate-700">
                <span className="text-[8px] font-black text-slate-500 uppercase mr-2">Week</span>
                <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value === "all" ? "all" : Number(e.target.value))} className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer">
                  <option value="all" className="text-black">All</option>
                  {[1, 2, 3, 4, 5].map((w) => <option key={w} value={w} className="text-black">W{w}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
        {isUpdating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-sm z-50">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 font-black text-xs animate-pulse uppercase tracking-widest">Updating Data...</p>
          </div>
        )}

        {!dashboardData || Object.keys(dashboardData).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-slate-300">
            <div className="text-7xl mb-4">📊</div>
            <p className="text-slate-400 font-bold uppercase tracking-widest">No Data Found for {user?.name || "this employee"}</p>
            <p className="text-xs text-slate-300 mt-2">Week {selectedWeek} • {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })}</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Employee Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
              <div className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-blue-50 group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
                <div className="flex justify-between items-center">
                  <h2 className="font-black uppercase text-lg text-slate-700 group-hover:text-blue-700">{user?.name || "Employee"}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">Your Dashboard</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${emDoerStatus ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{emDoerStatus ? '⚠️ EM Required' : '✅ Good Performance'}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <SectionBlock title="Delegation" data={dashboardData?.delegation} score={delOverall} formatPercent={formatPercent} theme="slate" />
                <SectionBlock title="Without Delegation" data={withoutDelData} score={`-${withoutDelData?.overallScore || "0.00"}`} formatPercent={formatPercent} theme="blue" />
                <SectionBlock title="Overall" data={dashboardData?.overall} score={formatPercent(dashboardData?.overall?.overallScore)} formatPercent={formatPercent} theme="emerald" />
              </div>
            </div>

            <AdditionalSection title="Help Tickets" data={dashboardData?.helpTicket} formatPercent={formatPercent} />
            <AdditionalSection title="Support Tickets" data={dashboardData?.supportTicket} formatPercent={formatPercent} />
            {dashboardData?.checklist && <AdditionalSection title="Checklist" data={{ assigned: dashboardData.checklist }} formatPercent={formatPercent} singleSection={true} />}
          </div>
        )}
      </main>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }`}</style>
    </div>
  );
}

// Memoized section block
const SectionBlock = React.memo(({ title, data, score, formatPercent, theme }) => (
  <div className={`border border-slate-200 rounded-xl p-5 bg-gradient-to-br ${theme === "blue" ? "from-blue-50" : theme === "emerald" ? "from-emerald-50" : "from-slate-50"} to-white hover:shadow-md transition-all duration-300 hover:border-blue-300`}>
    <h3 className="font-black text-sm uppercase text-center mb-4 text-slate-600 border-b pb-3">{title}</h3>
    <div className="grid grid-cols-2 gap-3">
      <MiniCard title="Total Work" value={data?.totalWork || 0} theme="slate" />
      <MiniCard title="Completed" value={data?.completedWork || data?.totalCompleted || 0} theme="emerald" />
      <MiniCard title="On Time" value={data?.onTimeWork || data?.totalOnTime || 0} theme="cyan" />
      <MiniCard title="Pending" value={data?.pendingWork || data?.totalPending || 0} theme="amber" />
      <MiniCard title="Pending %" value={formatPercent(data?.pendingPercent)} theme="indigo" />
      <MiniCard title="Delay %" value={formatPercent(data?.delayPercent)} theme="rose" />
    </div>
    {score !== undefined && (
      <div className="mt-5 pt-4 border-t border-slate-200">
        <div className="text-center">
          <span className="text-xs font-bold text-slate-500">{title} Score</span>
          <p className="text-xl font-black text-blue-600">{score}</p>
        </div>
      </div>
    )}
  </div>
));