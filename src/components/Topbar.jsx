// Ultimate Responsive Dark Topbar.js (Mobile + Tablet + Desktop Responsive)

import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaBars, FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import axios from "../api/axios";
import dayjs from "dayjs";

export default function Topbar() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const fileInputRef = useRef();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Form state for profile update
  const [profileForm, setProfileForm] = useState({
    companyName: "",
    designation: "",
    joiningDate: "",
    dateOfBirth: "",
    donorName: "",
    profilePicture: null,
    profilePicturePreview: null
  });

  // Status state
  const [status, setStatus] = useState("Idle");
  const [statusOpen, setStatusOpen] = useState(false);
  const [workingTime, setWorkingTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [lunchTime, setLunchTime] = useState(0);
  const [idleTime, setIdleTime] = useState(0);

  // Load user profile data and employees list
  useEffect(() => {
    loadUserProfile();
    loadEmployees();
  }, []);

  const loadUserProfile = async () => {
    try {
      const authHeader = { headers: { Authorization: `Bearer ${user?.token}` } };
      const res = await axios.get("/employee/profile", authHeader);
      const profile = res.data || {};
      
      console.log("Profile data from API:", profile); // Debug log
      
      setProfileForm({
        companyName: profile.companyName || "",
        designation: profile.designation || "",
        joiningDate: profile.joiningDate || "",
        dateOfBirth: profile.dateOfBirth || "",
        donorName: profile.donorName || "",
        profilePicture: null,
        // ✅ Cloudinary URL direct use karo - koi baseURL nahi lagana
        profilePicturePreview: profile.profilePicture || null
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const loadEmployees = async () => {
    try {
      const authHeader = { headers: { Authorization: `Bearer ${user?.token}` } };
      const res = await axios.get("/employee/all", authHeader);
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview for selected file
      const previewUrl = URL.createObjectURL(file);
      setProfileForm(prev => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: previewUrl
      }));
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const authHeader = { headers: { Authorization: `Bearer ${user?.token}` } };
      const formData = new FormData();
      
      if (profileForm.companyName) formData.append("companyName", profileForm.companyName);
      if (profileForm.designation) formData.append("designation", profileForm.designation);
      if (profileForm.joiningDate) formData.append("joiningDate", profileForm.joiningDate);
      if (profileForm.dateOfBirth) formData.append("dateOfBirth", profileForm.dateOfBirth);
      if (profileForm.donorName) formData.append("donorName", profileForm.donorName);
      if (profileForm.profilePicture) formData.append("profilePicture", profileForm.profilePicture);

      const res = await axios.put("/employee/update-profile", formData, {
        headers: { ...authHeader.headers, "Content-Type": "multipart/form-data" }
      });

      console.log("Update response:", res.data);

      // Update context with new user data
      if (updateUser) {
        updateUser({
          ...user,
          companyName: profileForm.companyName,
          designation: profileForm.designation,
          joiningDate: profileForm.joiningDate,
          dateOfBirth: profileForm.dateOfBirth,
          donorName: profileForm.donorName,
          profilePicture: res.data.profilePicture
        });
      }

      // Update profile form with new picture URL
      setProfileForm(prev => ({
        ...prev,
        profilePicturePreview: res.data.profilePicture,
        profilePicture: null
      }));

      setShowEditModal(false);
      alert("Profile updated successfully!");
      
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.error || "Failed to update profile");
    }
    setLoading(false);
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profileForm.dateOfBirth);

  // ===== FESTIVALS DATA =====
  const festivals = [
    { name: "Guru Gobind Singh Jayanti", month: 0, startDay: 5, endDay: 5, message: "⚔️ Guru Gobind Singh Jayanti - Warrior Saint! ⚔️", bgColor: "#f97316", textColor: "#ffffff", icon: "⚔️" },
    { name: "Lohri", month: 0, startDay: 13, endDay: 13, message: "🔥 Happy Lohri! Harvest Festival Celebration! 🔥", bgColor: "#f97316", textColor: "#ffffff", icon: "🔥" },
    { name: "Makar Sankranti", month: 0, startDay: 14, endDay: 14, message: "🪁 Happy Makar Sankranti! Kite Flying Festival! 🪁", bgColor: "#fbbf24", textColor: "#1e293b", icon: "🪁" },
    { name: "Vasant Panchmi", month: 0, startDay: 23, endDay: 23, message: "📚 Happy Vasant Panchmi! Goddess Saraswati Puja! 📚", bgColor: "#fde68a", textColor: "#1e293b", icon: "📚" },
    { name: "Republic Day", month: 0, startDay: 26, endDay: 26, message: "🇮🇳 Happy Republic Day 2026! Jai Hind! 🇮🇳", bgColor: "#f97316", textColor: "#ffffff", icon: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" },
    { name: "Mahashivratri", month: 1, startDay: 15, endDay: 15, message: "🕉️ Happy Mahashivratri! Har Har Mahadev! 🕉️", bgColor: "#a855f7", textColor: "#ffffff", icon: "🕉️" },
    { name: "Holi", month: 2, startDay: 4, endDay: 4, message: "🌈 Happy Holi! Festival of Colors! 🌈", bgColor: "#f43f5e", textColor: "#ffffff", icon: "🌈" },
    { name: "Gudi Padwa", month: 2, startDay: 19, endDay: 19, message: "🏵️ Happy Gudi Padwa! Marathi New Year! 🏵️", bgColor: "#f59e0b", textColor: "#ffffff", icon: "🏵️" },
    { name: "Eid", month: 2, startDay: 20, endDay: 20, message: "🌙 Eid Mubarak! Peace & Prosperity! 🌙", bgColor: "#059669", textColor: "#ffffff", icon: "🌙" },
    { name: "Ram Navmi", month: 2, startDay: 26, endDay: 26, message: "🕊️ Happy Ram Navmi! Jai Shri Ram! 🕊️", bgColor: "#d97706", textColor: "#ffffff", icon: "🕊️" },
    { name: "Hanuman Jayanti", month: 3, startDay: 2, endDay: 2, message: "🙏 Happy Hanuman Jayanti! Jai Bajrang Bali! 🙏", bgColor: "#ea580c", textColor: "#ffffff", icon: "🙏" },
    { name: "Baisakhi", month: 3, startDay: 14, endDay: 14, message: "🌾 Happy Baisakhi! Punjabi New Year! 🌾", bgColor: "#fbbf24", textColor: "#1e293b", icon: "🌾" },
    { name: "Ambedkar Jayanti", month: 3, startDay: 14, endDay: 14, message: "📚 Dr. B.R. Ambedkar Jayanti - Equality & Justice! 📚", bgColor: "#3b82f6", textColor: "#ffffff", icon: "📚" },
    { name: "Akshay Tritya", month: 3, startDay: 19, endDay: 19, message: "💰 Happy Akshay Tritya - Auspicious Day! 💰", bgColor: "#f59e0b", textColor: "#ffffff", icon: "💰" },
    { name: "Independence Day", month: 7, startDay: 15, endDay: 15, message: "🇮🇳 Happy Independence Day! Celebrate Freedom! 🇮🇳", bgColor: "#16a34a", textColor: "#ffffff", icon: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" },
    { name: "Raksha Bandhan", month: 7, startDay: 28, endDay: 28, message: "🎀 Happy Raksha Bandhan! Bond of Love! 🎀", bgColor: "#db2777", textColor: "#ffffff", icon: "🎀" },
    { name: "Janmashtami", month: 8, startDay: 4, endDay: 4, message: "🎶 Happy Janmashtami! Jai Shri Krishna! 🎶", bgColor: "#3b82f6", textColor: "#ffffff", icon: "🎶" },
    { name: "Ganesh Chaturthi", month: 8, startDay: 14, endDay: 14, message: "🐘 Ganpati Bappa Morya! Happy Ganesh Chaturthi! 🐘", bgColor: "#f97316", textColor: "#ffffff", icon: "🐘" },
    { name: "Dussehra", month: 9, startDay: 20, endDay: 20, message: "🏹 Happy Dussehra! Victory of Good over Evil! 🏹", bgColor: "#fbbf24", textColor: "#1e293b", icon: "🏹" },
    { name: "Diwali", month: 10, startDay: 8, endDay: 8, message: "🪔 Happy Diwali! Festival of Lights! 🪔", bgColor: "#fbbf24", textColor: "#1e293b", icon: "🪔" },
    { name: "Guru Nanak Jayanti", month: 10, startDay: 14, endDay: 14, message: "🙏 Guru Nanak Jayanti - Waheguru! 🙏", bgColor: "#fbbf24", textColor: "#1e293b", icon: "🙏" },
    { name: "Merry Christmas", month: 11, startDay: 25, endDay: 25, message: "🎄 Merry Christmas! Joy to the World! 🎄", bgColor: "#dc2626", textColor: "#ffffff", icon: "🎅" },
    { name: "New Year", month: 0, startDay: 1, endDay: 1, message: "🎉 Happy New Year 2027! Welcome 2027! 🎉", bgColor: "#2563eb", textColor: "#ffffff", icon: "🎊" }
  ];

  const getCurrentFestival = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    const currentYear = today.getFullYear();

    for (let festival of festivals) {
      if (festival.name === "New Year") {
        if (currentYear === 2026 && currentMonth === 11 && currentDate >= festival.startDay && currentDate <= 31) return festival;
        if (currentYear === 2027 && currentMonth === 0 && currentDate >= 1 && currentDate <= festival.endDay) return festival;
      } else if (currentMonth === festival.month && currentDate >= festival.startDay && currentDate <= festival.endDay) {
        return festival;
      }
    }
    return null;
  };

  const currentFestival = getCurrentFestival();

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      switch (status) {
        case "Working": setWorkingTime((t) => t + 1); break;
        case "Break": setBreakTime((t) => t + 1); break;
        case "Lunch": setLunchTime((t) => t + 1); break;
        case "Idle": setIdleTime((t) => t + 1); break;
        default: break;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setStatusOpen(false);
  };

  const theme = {
    primary: "#0EA5E9",
    primarySoft: "#1E293B",
    border: "#334155",
    text: "#F1F5F9",
    subtext: "#94A3B8",
    bg: "#2d3548ff",
  };

  return (
    <header className="w-full border-b sticky top-0 z-50" style={{ background: theme.bg, borderColor: theme.border }}>
      {/* ===== TOPBAR MAIN ===== */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-xl text-white mr-2" onClick={() => setMobileMenu(!mobileMenu)}>
            <FaBars />
          </button>
          <div className="flex flex-col leading-tight">
            <h1 className="text-base font-semibold" style={{ color: theme.text, padding: "10px 15px 0 15px", fontSize: "16px" }}>
              Task Management
            </h1>
            <span className="text-[11px] hidden sm:block" style={{ color: theme.subtext }}>
              Monitor all tasks assigned to you
            </span>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 sm:gap-7">
          <div className="flex items-center gap-3 justify-end">
            <span className="w-3.5 h-3.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 text-sm sm:text-base font-bold tracking-wide">Active</span>
          </div>

          {/* PROFILE BUTTON */}
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setStatusOpen(false);
            }}
            className="flex items-center gap-2 text-xs sm:text-sm hover:opacity-80"
            style={{ color: theme.text }}
          >
            {profileForm.profilePicturePreview ? (
              <img 
                src={profileForm.profilePicturePreview} 
                alt="profile" 
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", profileForm.profilePicturePreview);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <FaUserCircle className={`w-6 h-6 ${profileForm.profilePicturePreview ? 'hidden' : 'block'}`} />
            <span className="font-medium hidden sm:block">{user?.name}</span>
            <FaChevronDown className="w-3 h-3 opacity-70" />
          </button>
        </div>
      </div>

      {/* =============== STATUS DROPDOWN =============== */}
      {statusOpen && (
        <div className="absolute right-4 sm:right-20 top-16 w-48 sm:w-64 rounded-xl shadow-lg border" style={{ background: theme.primarySoft, borderColor: theme.border }}>
          <div className="py-1">
            {["Working", "Break", "Lunch", "Idle", "Leave"].map((item) => (
              <button key={item} onClick={() => handleStatusChange(item)} className="w-full text-left px-4 py-2 text-sm rounded transition hover:bg-slate-600" style={{ background: status === item ? theme.primary : "transparent", color: theme.text }}>
                {item}
              </button>
            ))}
          </div>
          <div className="w-full" style={{ borderTop: `1px solid ${theme.border}` }}></div>
          <div className="px-4 py-3 text-xs sm:text-sm" style={{ color: theme.text }}>
            {[
              { label: "🟢 Working", value: workingTime },
              { label: "🟡 Break", value: breakTime },
              { label: "🟠 Lunch", value: lunchTime },
              { label: "⚪ Idle", value: idleTime },
            ].map((row) => (
              <div key={row.label} className="flex justify-between py-[3px] text-xs">
                <span>{row.label}</span>
                <span>{formatTime(row.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =============== PROFILE DROPDOWN =============== */}
      {profileOpen && (
        <div className="absolute right-4 top-16 w-72 sm:w-96 rounded-xl shadow-lg border" style={{ background: theme.primarySoft, borderColor: theme.border }}>
          {/* Profile Header with Picture */}
          <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: theme.border }}>
            {profileForm.profilePicturePreview ? (
              <img 
                src={profileForm.profilePicturePreview} 
                alt="profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <FaUserCircle className={`w-12 h-12 text-gray-400 ${profileForm.profilePicturePreview ? 'hidden' : 'block'}`} />
            <div>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>{user?.name}</p>
              <p className="text-xs" style={{ color: theme.subtext }}>{user?.department || "No Department"}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-4 py-2 border-b" style={{ borderColor: theme.border }}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-400">Company</p>
                <p className="text-white">{profileForm.companyName || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400">Designation</p>
                <p className="text-white">{profileForm.designation || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400">Joining Date</p>
                <p className="text-white">{profileForm.joiningDate ? dayjs(profileForm.joiningDate).format("DD MMM YYYY") : "-"}</p>
              </div>
              <div>
                <p className="text-gray-400">Date of Birth</p>
                <p className="text-white">{profileForm.dateOfBirth ? `${dayjs(profileForm.dateOfBirth).format("DD MMM YYYY")} (${age} yrs)` : "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Doer Name</p>
                <p className="text-white">{profileForm.donorName || "-"}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => {
              setShowEditModal(true);
              setProfileOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-600"
            style={{ color: theme.text }}
          >
            <FaEdit className="text-blue-400" /> Edit Profile
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-600 rounded-b-xl"
            style={{ color: "#F87171" }}
          >
            <FaSignOutAlt className="text-red-400" /> Logout
          </button>
        </div>
      )}

      {/* ====== MOBILE MENU ====== */}
      {mobileMenu && (
        <div className="lg:hidden w-full border-t p-4 flex flex-col gap-3" style={{ background: theme.primarySoft, borderColor: theme.border }}>
          <button className="text-left text-white" onClick={() => setMobileMenu(false)}>Dashboard</button>
          <button className="text-left text-white">Tasks</button>
          <button className="text-left text-white">Support</button>
        </div>
      )}

      {/* ===== EDIT PROFILE MODAL ===== */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: theme.primarySoft, borderColor: theme.border }}>
            <div className="flex justify-between items-center p-4 border-b sticky top-0" style={{ background: theme.primarySoft, borderColor: theme.border }}>
              <h2 className="text-lg font-semibold" style={{ color: theme.text }}>Update Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {profileForm.profilePicturePreview ? (
                    <img src={profileForm.profilePicturePreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" />
                  ) : (
                    <FaUserCircle className="w-24 h-24 text-gray-400" />
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700"
                  >
                    <FaCamera className="w-4 h-4 text-white" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.subtext }}>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={profileForm.companyName}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ background: "#0f172a", borderColor: theme.border, color: theme.text }}
                  placeholder="Enter company name"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.subtext }}>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={profileForm.designation}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ background: "#0f172a", borderColor: theme.border, color: theme.text }}
                  placeholder="Enter designation"
                />
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.subtext }}>Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={profileForm.joiningDate}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ background: "#0f172a", borderColor: theme.border, color: theme.text }}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.subtext }}>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileForm.dateOfBirth}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ background: "#0f172a", borderColor: theme.border, color: theme.text }}
                />
                {age && (
                  <p className="text-xs mt-1 text-green-400">Age: {age} years</p>
                )}
              </div>

              {/* Doer Name - Select from employees */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.subtext }}>Doer Name</label>
                <select
                  name="donorName"
                  value={profileForm.donorName}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ background: "#0f172a", borderColor: theme.border, color: theme.text }}
                >
                  <option value="">Select Doer</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeID || emp.name} value={emp.name}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t" style={{ borderColor: theme.border }}>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition"
                style={{ background: "#334155", color: theme.text }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                style={{ background: loading ? "#475569" : "#0EA5E9", color: "white" }}
              >
                {loading ? "Saving..." : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FESTIVAL BANNER ===== */}
      <div className="w-full overflow-hidden border-t" style={{ background: currentFestival ? currentFestival.bgColor : "#f1f5f9", borderColor: theme.border }}>
        <div className="flex w-max whitespace-nowrap py-1 text-sm font-bold items-center" style={{ color: currentFestival ? currentFestival.textColor : "#0f172a", animation: "scroll-left 10s linear infinite", gap: "25px" }}>
          {(() => {
            if (currentFestival) {
              const messages = [currentFestival.message, `✨ ${currentFestival.name} ✨`, currentFestival.message];
              return [...messages, ...messages].map((msg, i) => (
                <React.Fragment key={i}>
                  <span className="flex items-center gap-2">
                    {typeof currentFestival.icon === 'string' && currentFestival.icon.startsWith('http') ? (
                      <img src={currentFestival.icon} alt={currentFestival.name} style={{ width: "20px", height: "12px", display: "inline-block" }} />
                    ) : (
                      <span style={{ fontSize: "1.2rem" }}>{currentFestival.icon}</span>
                    )}
                    <span>{msg}</span>
                    {typeof currentFestival.icon === 'string' && currentFestival.icon.startsWith('http') ? (
                      <img src={currentFestival.icon} alt={currentFestival.name} style={{ width: "20px", height: "12px", display: "inline-block" }} />
                    ) : (
                      <span style={{ fontSize: "1.2rem" }}>{currentFestival.icon}</span>
                    )}
                  </span>
                </React.Fragment>
              ));
            } else {
              const alertMessages = ["🔄 Refresh the portal before adding a task", "⚠️ If issues continue, log out/in or raise a support ticket", "📢 System Update: Regular maintenance"];
              return [...alertMessages, ...alertMessages].map((msg, i) => (
                <span key={i} className="px-4">{msg}</span>
              ));
            }
          })()}
        </div>
        <style>{`@keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>
    </header>
  );
}