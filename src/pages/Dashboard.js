// import React, { useState, useEffect, useContext } from "react";
// import axios from "../api/axios";
// import { AuthContext } from "../context/AuthContext";

// export default function Dashboard() {
//   const { user } = useContext(AuthContext);
// console.log("user:",user);

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedWeek, setSelectedWeek] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [weekRange, setWeekRange] = useState({ start: "", end: "" });

//   // Single state to hold all dashboard data
//   const [dashboardData, setDashboardData] = useState(null);

//   // ================= LOAD DASHBOARD DATA =================
//   const loadDashboardData = async (isInitial = false) => {
//     try {
//       if (isInitial) setLoading(true);
//       else setIsUpdating(true);

//       const response = await axios.get("/allDashboard/all-dashboard", {
//         params: {
//           month: selectedMonth,
//           week: selectedWeek === "all" ? "" : selectedWeek,
//           selectedName:user?.name||user?.key || user?.email, // Empty string for current user's data
//         },
//         headers: { Authorization: `Bearer ${user.token}` },
//       });

//       // Since this is for single user, we take the first item from data array
//       const userData = response.data.data?.[0] || {};
      
//       setDashboardData(userData);
//       setWeekRange({
//         start: response.data.weekStart || "N/A",
//         end: response.data.weekEnd || "N/A",
//       });

//       setLoading(false);
//       setIsUpdating(false);
//     } catch (err) {
//       console.error("Error loading dashboard data:", err);
//       setLoading(false);
//       setIsUpdating(false);
//     }
//   };

//   useEffect(() => { 
//     loadDashboardData(true); 
//   }, []);

//   useEffect(() => { 
//     if (!loading) {
//       loadDashboardData(false); 
//     }
//   }, [selectedMonth, selectedWeek]);

//   // ================= FORMAT PERCENTAGES WITH MINUS SIGN =================
//   const formatPercent = (value) => {
//     if (!value && value !== 0) return "-0.00%";
//     const num = parseFloat(value);
//     if (isNaN(num)) return "-0.00%";
//     return `-${num.toFixed(2)}%`;
//   };

//   if (loading) return (
//     <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
//       <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
//       <p className="mt-4 text-xs font-black text-slate-500 tracking-[0.3em]">SYNCHRONIZING...</p>
//     </div>
//   );

//   return (
//     <div className="h-screen w-full flex flex-col bg-[#f8fafc] overflow-hidden font-sans">
      
//       {/* --- 1. STRICT FULL-WIDTH HEADER --- */}
//       <div className="w-full bg-[#0f172a] text-white px-6 py-3 border-b border-slate-800 flex-shrink-0">
//         <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          
//           <div className="flex items-center gap-4">
//             <div className="bg-blue-600 p-2 rounded-lg">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </div>
//             <div>
//               <h1 className="text-lg font-black tracking-tight uppercase italic leading-none">Dashboard</h1>
//               <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-widest">
//                 {weekRange.start} — {weekRange.end}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-1 rounded-xl">
//              <div className="flex items-center px-4 border-r border-slate-700">
//                 <span className="text-[10px] font-black text-slate-500 uppercase mr-3">Month</span>
//                 <select 
//                   value={selectedMonth} 
//                   onChange={(e) => setSelectedMonth(Number(e.target.value))} 
//                   className="bg-transparent text-sm font-black outline-none cursor-pointer"
//                 >
//                   {Array.from({ length: 12 }, (_, i) => (
//                     <option key={i} value={i + 1} className="text-black">
//                       {new Date(0, i).toLocaleString("default", { month: "long" })}
//                     </option>
//                   ))}
//                 </select>
//              </div>
//              <div className="flex items-center px-4">
//                 <span className="text-[10px] font-black text-slate-500 uppercase mr-3">Week</span>
//                 <select 
//                   value={selectedWeek} 
//                   onChange={(e) => setSelectedWeek(e.target.value === "all" ? "all" : Number(e.target.value))} 
//                   className="bg-transparent text-sm font-black outline-none cursor-pointer"
//                 >
//                   <option value="all" className="text-black">All Weeks</option>
//                   {[1, 2, 3, 4, 5].map(w => (
//                     <option key={w} value={w} className="text-black">Week {w}</option>
//                   ))}
//                 </select>
//              </div>
//           </div>
//         </div>
//       </div>

//       {/* --- 2. FULL WIDTH CONTENT AREA --- */}
//       <div className="flex-1 overflow-y-auto w-full relative">
        
//         {/* Loading Overlay for Filters */}
//         {isUpdating && (
//           <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
//             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         )}

//         <div className="w-full p-6 space-y-6">
          
//           {/* Delegation Section */}
//           <Section title="Delegation Summary" accent="bg-blue-600">
//             <Card title="Total Work" value={dashboardData?.delegation?.totalWork || 0} theme="blue" />
//             <Card title="Completed" value={dashboardData?.delegation?.completedWork || 0} theme="emerald" />
//             <Card title="On Time" value={dashboardData?.delegation?.onTimeWork || 0} theme="cyan" />
//             <Card title="Pending" value={dashboardData?.delegation?.pendingWork || 0} theme="amber" />
//             <Card title="Pending %" value={formatPercent(dashboardData?.delegation?.pendingPercent)} theme="indigo" />
//             <Card title="Delayed %" value={formatPercent(dashboardData?.delegation?.delayPercent)} theme="rose" />
//           </Section>

//           {/* Checklist Section */}
//           <Section title="Checklist Summary" accent="bg-emerald-600">
//             <Card title="Total Tasks" value={dashboardData?.checklist?.totalWork || 0} theme="blue" />
//             <Card title="Completed" value={dashboardData?.checklist?.completedWork || 0} theme="emerald" />
//             <Card title="On Time" value={dashboardData?.checklist?.onTimeWork || 0} theme="cyan" />
//             <Card title="Pending" value={dashboardData?.checklist?.pendingWork || 0} theme="amber" />
//             <Card title="Pending %" value={formatPercent(dashboardData?.checklist?.pendingPercent)} theme="indigo" />
//             <Card title="Delayed %" value={formatPercent(dashboardData?.checklist?.delayPercent)} theme="rose" />
//           </Section>

//           {/* HELP TICKETS */}
//           <Section title="Help Ticket Analytics" accent="bg-indigo-600">
//             <div className="col-span-full border-b border-slate-100 pb-2 mb-2">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned Tickets</span>
//             </div>
//             <Card title="Total" value={dashboardData?.helpTicket?.assigned?.totalWork || 0} theme="slate" />
//             <Card title="Completed" value={dashboardData?.helpTicket?.assigned?.completedWork || 0} theme="emerald" />
//             <Card title="On Time" value={dashboardData?.helpTicket?.assigned?.onTimeWork || 0} theme="cyan" />
//             <Card title="Pending" value={dashboardData?.helpTicket?.assigned?.pendingWork || 0} theme="amber" />
//             <Card title="Pending %" value={formatPercent(dashboardData?.helpTicket?.assigned?.pendingPercent)} theme="indigo" />
//             <Card title="Delay %" value={formatPercent(dashboardData?.helpTicket?.assigned?.delayPercent)} theme="rose" />

//             <div className="col-span-full border-b border-slate-100 pb-2 mb-2 mt-4">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created Tickets</span>
//             </div>
//             <Card title="Total" value={dashboardData?.helpTicket?.created?.totalWork || 0} theme="slate" />
//             <Card title="Completed" value={dashboardData?.helpTicket?.created?.completedWork || 0} theme="emerald" />
//             <Card title="On Time" value={dashboardData?.helpTicket?.created?.onTimeWork || 0} theme="cyan" />
//             <Card title="Pending" value={dashboardData?.helpTicket?.created?.pendingWork || 0} theme="amber" />
//             <Card title="Pending %" value={formatPercent(dashboardData?.helpTicket?.created?.pendingPercent)} theme="indigo" />
//             <Card title="Delay %" value={formatPercent(dashboardData?.helpTicket?.created?.delayPercent)} theme="rose" />
//           </Section>

//           {/* SUPPORT TICKETS */}
//           <Section title="Support Ticket Analytics" accent="bg-rose-600">
//             <div className="col-span-full border-b border-slate-100 pb-2 mb-2">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned Tickets</span>
//             </div>
//             <Card title="Total" value={dashboardData?.supportTicket?.assigned?.totalWork || 0} theme="slate" />
//             <Card title="Completed" value={dashboardData?.supportTicket?.assigned?.completedWork || 0} theme="emerald" />
//             <Card title="On Time" value={dashboardData?.supportTicket?.assigned?.onTimeWork || 0} theme="cyan" />
//             <Card title="Pending" value={dashboardData?.supportTicket?.assigned?.pendingWork || 0} theme="amber" />
//             <Card title="Pending %" value={formatPercent(dashboardData?.supportTicket?.assigned?.pendingPercent)} theme="indigo" />
//             <Card title="Delay %" value={formatPercent(dashboardData?.supportTicket?.assigned?.delayPercent)} theme="rose" />

//             <div className="col-span-full border-b border-slate-100 pb-2 mb-2 mt-4">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created Tickets</span>
//             </div>
//             <Card title="Total" value={dashboardData?.supportTicket?.created?.totalWork || 0} theme="slate" />
//             <Card title="Completed" value={dashboardData?.supportTicket?.created?.completedWork || 0} theme="emerald" />
//             <Card title="On Time" value={dashboardData?.supportTicket?.created?.onTimeWork || 0} theme="cyan" />
//             <Card title="Pending" value={dashboardData?.supportTicket?.created?.pendingWork || 0} theme="amber" />
//             <Card title="Pending %" value={formatPercent(dashboardData?.supportTicket?.created?.pendingPercent)} theme="indigo" />
//             <Card title="Delay %" value={formatPercent(dashboardData?.supportTicket?.created?.delayPercent)} theme="rose" />
//           </Section>

//           {/* Overall Section - Optional, can be added if needed */}
//           {dashboardData?.overall && (
//             <Section title="Overall Performance" accent="bg-purple-600">
//               <Card title="Total Work" value={dashboardData.overall.totalWork || 0} theme="slate" />
//               <Card title="Completed" value={dashboardData.overall.totalCompleted || 0} theme="emerald" />
//               <Card title="On Time" value={dashboardData.overall.totalOnTime || 0} theme="cyan" />
//               <Card title="Pending" value={dashboardData.overall.totalPending || 0} theme="amber" />
//               <Card title="Pending %" value={formatPercent(dashboardData.overall.pendingPercent)} theme="indigo" />
//               <Card title="Delay %" value={formatPercent(dashboardData.overall.delayPercent)} theme="rose" />
//               <Card title="Overall Score" value={formatPercent(dashboardData.overall.overallScore)} theme="purple" />
//             </Section>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- FULL WIDTH STYLED COMPONENTS ---

// function Section({ title, accent, children }) {
//   return (
//     <div className="w-full bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
//       <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex items-center gap-3">
//         <div className={`w-1 h-5 ${accent} rounded-full`}></div>
//         <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest">{title}</h2>
//       </div>
//       <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         {children}
//       </div>
//     </div>
//   );
// }

// const THEMES = {
//   blue: "bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700",
//   amber: "bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600",
//   emerald: "bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700",
//   cyan: "bg-cyan-600 text-white shadow-cyan-100 hover:bg-cyan-700",
//   indigo: "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700",
//   rose: "bg-rose-600 text-white shadow-rose-100 hover:bg-rose-700",
//   slate: "bg-slate-700 text-white shadow-slate-100 hover:bg-slate-800",
//   purple: "bg-purple-600 text-white shadow-purple-100 hover:bg-purple-700"
// };

// function Card({ title, value, theme }) {
//   return (
//     <div className={`${THEMES[theme]} p-5 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl cursor-default group`}>
//       <h3 className="text-[9px] font-black uppercase tracking-tighter mb-2 opacity-80 group-hover:opacity-100 text-center leading-none">
//         {title}
//       </h3>
//       <p className="text-2xl font-black leading-none drop-shadow-md">
//         {value || 0}
//       </p>
//     </div>
//   );
// }


import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  console.log("user:", user);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });

  // Single state to hold all dashboard data
  const [dashboardData, setDashboardData] = useState(null);

  // ================= LOAD DASHBOARD DATA =================
  const loadDashboardData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setIsUpdating(true);

      const response = await axios.get("/allDashboard/all-dashboard", {
        params: {
          month: selectedMonth,
          week: selectedWeek === "all" ? "" : selectedWeek,
          selectedName: user?.name || user?.key || user?.email,
        },
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const userData = response.data.data?.[0] || {};
      
      setDashboardData(userData);
      setWeekRange({
        start: response.data.weekStart || "N/A",
        end: response.data.weekEnd || "N/A",
      });

      setLoading(false);
      setIsUpdating(false);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => { 
    loadDashboardData(true); 
  }, []);

  useEffect(() => { 
    if (!loading) {
      loadDashboardData(false); 
    }
  }, [selectedMonth, selectedWeek]);

  // ================= CALCULATE WITHOUT DELEGATION DATA =================
  const calculateWithoutDelegation = () => {
    if (!dashboardData) return null;
    
    const checklist = dashboardData.checklist || {};
    const helpAssigned = dashboardData.helpTicket?.assigned || {};
    const supportAssigned = dashboardData.supportTicket?.assigned || {};

    const totalWork = (checklist.totalWork || 0) + 
                     (helpAssigned.totalWork || 0) + 
                     (supportAssigned.totalWork || 0);
    
    const completedWork = (checklist.completedWork || 0) + 
                         (helpAssigned.completedWork || 0) + 
                         (supportAssigned.completedWork || 0);
    
    const pendingWork = (checklist.pendingWork || 0) + 
                       (helpAssigned.pendingWork || 0) + 
                       (supportAssigned.pendingWork || 0);
    
    const onTimeWork = (checklist.onTimeWork || 0) + 
                      (helpAssigned.onTimeWork || 0) + 
                      (supportAssigned.onTimeWork || 0);

    const pendingPercent = totalWork > 0 ? ((pendingWork / totalWork) * 100).toFixed(2) : "0.00";
    const delayPercent = totalWork > 0 ? (((totalWork - onTimeWork) / totalWork) * 100).toFixed(2) : "0.00";
    
    const overallScore = ((parseFloat(pendingPercent) * 0.80) + (parseFloat(delayPercent) * 0.20)).toFixed(2);

    return {
      totalWork,
      completedWork,
      pendingWork,
      onTimeWork,
      pendingPercent: `-${pendingPercent}`,
      delayPercent: `-${delayPercent}`,
      overallScore: `-${overallScore}`
    };
  };

  // ================= FORMAT PERCENTAGES WITH MINUS SIGN =================
  const formatPercent = (value) => {
    if (!value && value !== 0) return "-0.00%";
    const num = parseFloat(value);
    if (isNaN(num)) return "-0.00%";
    return `-${num.toFixed(2)}%`;
  };

  // ================= CALCULATE DELEGATION OVERALL SCORE =================
  const calculateDelegationOverall = () => {
    if (!dashboardData?.delegation) return "-0.00";
    const del = dashboardData.delegation;
    const pendingPercent = parseFloat(del.pendingPercent || 0);
    const delayPercent = parseFloat(del.delayPercent || 0);
    const score = ((pendingPercent * 0.80) + (delayPercent * 0.20)).toFixed(2);
    return `-${score}`;
  };

  // ================= CHECK IF EM DOER =================
  const isEMDoer = () => {
    const withoutDel = calculateWithoutDelegation();
    if (!withoutDel) return false;
    
    const woOverallNum = parseFloat(withoutDel.overallScore.replace("-", "") || 0);
    const delOverallNum = parseFloat(calculateDelegationOverall().replace("-", "") || 0);
    
    return (woOverallNum > 10 || delOverallNum > 10);
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-100">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 font-bold text-[10px]">DATA</div>
      </div>
      <p className="mt-4 text-slate-600 font-black text-xs animate-pulse uppercase tracking-widest">
        LOADING DASHBOARD...
      </p>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-800 text-white px-4 py-3 md:px-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex flex-col">
            <h1 className="font-black uppercase text-base md:text-lg leading-tight tracking-wider">
              {user?.name || "Dashboard"}
            </h1>
            <p className="text-[10px] md:text-xs text-blue-400 font-bold">
              {weekRange.start || "Loading..."} — {weekRange.end || "Loading..."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="grid grid-cols-2 sm:flex items-center bg-slate-900 rounded-xl p-2 gap-2 w-full sm:w-auto border border-slate-700">
              
              <div className="flex items-center px-2">
                <span className="text-[8px] font-black text-slate-500 uppercase mr-2">Month</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1} className="text-black">
                      {new Date(0, i).toLocaleString("default", { month: "short" })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center px-2 border-l border-slate-700">
                <span className="text-[8px] font-black text-slate-500 uppercase mr-2">Week</span>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
                >
                  <option value="all" className="text-black">All</option>
                  {[1, 2, 3, 4, 5].map((w) => (
                    <option key={w} value={w} className="text-black">W{w}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
        
        {/* Loading Overlay */}
        {isUpdating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-sm z-50">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 font-bold text-[10px]">WA</div>
            </div>
            <p className="mt-4 text-slate-600 font-black text-xs animate-pulse uppercase tracking-widest">
              Updating Data...
            </p>
          </div>
        )}

        {/* No Data State */}
        {!dashboardData || Object.keys(dashboardData).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-slate-300">
            <div className="text-7xl mb-4">📊</div>
            <p className="text-slate-400 font-bold uppercase tracking-widest">
              No Data Found for {user?.name || "this employee"}
            </p>
            <p className="text-xs text-slate-300 mt-2">
              Week {selectedWeek} • {new Date(0, selectedMonth-1).toLocaleString("default", { month: "long" })}
            </p>
          </div>
        ) : (
          // Data Display - Single Employee View styled like first dashboard
          <div className="space-y-6 animate-fadeIn">
            
            {/* Employee Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
              
              {/* Employee Header */}
              <div className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-blue-50 group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
                <div className="flex justify-between items-center">
                  <h2 className="font-black uppercase text-lg text-slate-700 group-hover:text-blue-700">
                    {user?.name || "Employee"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      Your Dashboard
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isEMDoer() ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {isEMDoer() ? '⚠️ EM Required' : '✅ Good Performance'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Three Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 cursor-default">
                
                {/* Delegation Section */}
                <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-white hover:shadow-md transition-all duration-300 hover:border-blue-300">
                  <h3 className="font-black text-sm uppercase text-center mb-4 text-slate-600 border-b pb-3">
                    Delegation
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniCard title="Total Work" value={dashboardData?.delegation?.totalWork || 0} theme="slate" />
                    <MiniCard title="Completed" value={dashboardData?.delegation?.completedWork || 0} theme="emerald" />
                    <MiniCard title="On Time" value={dashboardData?.delegation?.onTimeWork || 0} theme="cyan" />
                    <MiniCard title="Pending" value={dashboardData?.delegation?.pendingWork || 0} theme="amber" />
                    <MiniCard title="Pending %" value={formatPercent(dashboardData?.delegation?.pendingPercent)} theme="indigo" />
                    <MiniCard title="Delay %" value={formatPercent(dashboardData?.delegation?.delayPercent)} theme="rose" />
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-500">Delegation Score</span>
                      <p className="text-xl font-black text-blue-600">{calculateDelegationOverall()}</p>
                    </div>
                  </div>
                </div>

                {/* Without Delegation Section */}
                <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-all duration-300 hover:border-blue-300">
                  <h3 className="font-black text-sm uppercase text-center mb-4 text-blue-600 border-b pb-3">
                    Without Delegation
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniCard title="Total Work" value={calculateWithoutDelegation()?.totalWork || 0} theme="slate" />
                    <MiniCard title="Completed" value={calculateWithoutDelegation()?.completedWork || 0} theme="emerald" />
                    <MiniCard title="On Time" value={calculateWithoutDelegation()?.onTimeWork || 0} theme="cyan" />
                    <MiniCard title="Pending" value={calculateWithoutDelegation()?.pendingWork || 0} theme="amber" />
                    <MiniCard title="Pending %" value={calculateWithoutDelegation()?.pendingPercent + "%" || "-0.00%"} theme="indigo" />
                    <MiniCard title="Delay %" value={calculateWithoutDelegation()?.delayPercent + "%" || "-0.00%"} theme="rose" />
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-500">Without Delegation Score</span>
                      <p className="text-xl font-black text-blue-600">{calculateWithoutDelegation()?.overallScore || "-0.00"}</p>
                    </div>
                  </div>
                </div>

                {/* Overall Section */}
                <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50 to-white hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                  <h3 className="font-black text-sm uppercase text-center mb-4 text-emerald-600 border-b pb-3">
                    Overall
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniCard title="Total Work" value={dashboardData?.overall?.totalWork || 0} theme="slate" />
                    <MiniCard title="Completed" value={dashboardData?.overall?.totalCompleted || 0} theme="emerald" />
                    <MiniCard title="On Time" value={dashboardData?.overall?.totalOnTime || 0} theme="cyan" />
                    <MiniCard title="Pending" value={dashboardData?.overall?.totalPending || 0} theme="amber" />
                    <MiniCard title="Pending %" value={formatPercent(dashboardData?.overall?.pendingPercent)} theme="indigo" />
                    <MiniCard title="Delay %" value={formatPercent(dashboardData?.overall?.delayPercent)} theme="rose" />
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-500">Overall Score</span>
                      <p className="text-xl font-black text-emerald-600">{formatPercent(dashboardData?.overall?.overallScore)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Sections - Help Tickets */}
            <AdditionalSection 
              title="Help Tickets" 
              data={dashboardData?.helpTicket}
              formatPercent={formatPercent}
            />

            {/* Additional Sections - Support Tickets */}
            <AdditionalSection 
              title="Support Tickets" 
              data={dashboardData?.supportTicket}
              formatPercent={formatPercent}
            />

            {/* Checklist Section */}
            {dashboardData?.checklist && (
              <AdditionalSection 
                title="Checklist" 
                data={{ assigned: dashboardData.checklist }}
                formatPercent={formatPercent}
                singleSection={true}
              />
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ================= COMPONENTS =================

const THEMES = {
  blue: "bg-blue-600 text-white",
  amber: "bg-amber-500 text-white",
  emerald: "bg-emerald-600 text-white",
  cyan: "bg-cyan-600 text-white",
  indigo: "bg-indigo-600 text-white",
  rose: "bg-rose-600 text-white",
  slate: "bg-slate-700 text-white",
};

// Mini Card for grid layout
function MiniCard({ title, value, theme }) {
  return (
    <div className={`${THEMES[theme]} p-3 rounded-lg text-center shadow transition-all duration-300 hover:scale-105`}>
      <h3 className="text-[9px] uppercase font-black opacity-90">{title}</h3>
      <p className="text-lg font-black mt-1">{value || 0}</p>
    </div>
  );
}

// Additional Section for tickets
function AdditionalSection({ title, data, formatPercent, singleSection = false }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
      <div className="px-6 py-3 border-b bg-slate-50 group-hover:bg-indigo-50 transition-colors">
        <h2 className="font-black uppercase text-slate-700 group-hover:text-indigo-700">{title}</h2>
      </div>
      
      {singleSection ? (
        // Single section (like Checklist)
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
        // Assigned and Created sections
        <div className="p-6 space-y-6">
          {/* Assigned */}
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

          {/* Created */}
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
}

// Card component
function Card({ title, value, theme }) {
  return (
    <div className={`${THEMES[theme]} p-4 rounded-xl text-center shadow transition-all duration-300 hover:scale-105 hover:rotate-1`}>
      <h3 className="text-[10px] uppercase font-black opacity-80">{title}</h3>
      <p className="text-xl font-black">{value || 0}</p>
    </div>
  );
}