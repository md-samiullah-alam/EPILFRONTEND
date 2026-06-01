import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    mobile: "",
    password: "",
    department: "",
    companyName: "",
    designation: "",
    joiningDate: "",
    dateOfBirth: "",
    doerName: "",
    gender: "",
    
    // Personal Details
    fatherName: "",
    motherName: "",
    spouseName: "",
    spouseDob: "",
    motherInLawName: "",
    fatherInLawName: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    permanentAddress: "",
    currentAddress: "",
    
    // Job Details
    employeeType: "Permanent",
    workLocation: "",
    employeeStatus: "Active",
    
    // Shift Details
    shiftName: "Day",
    shiftStartTime: "09:00",
    shiftEndTime: "18:00",
    totalWorkingHours: "9",
    lunchBreak: "60",
    weeklyOff: "Sunday",
    overtimeApplicable: "No",
    overtimeRate: "",
    
    // Salary Details
    basicSalary: "",
    petrolAllowance: "No",
    petrolAmount: "",
    foodAllowance: "No",
    foodAmount: "",
    workingDays: "26",
    pfApplicable: "No",
    ptApplicable: "No",
    advanceAllowed: "No",
    advanceLimit: "",
    
    // Attendance
    biometricId: "",
    graceTime: "15",
    lateMarkAfter: "30",
    halfDayAfter: "4",
    minWorkingHours: "8",
    punchRequired: "2",
    autoAbsentAfter: "",
    
    // Leave Details
    paidLeave: "12",
    casualLeave: "12",
    sickLeave: "12",
    earnedLeave: "0",
    leaveCarryForward: "No",
    leaveCarryMax: "30",
    
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    pfNumber: "",
    esicNumber: "",
    
    // Documents
    aadhaarNumber: "",
    panNumber: "",
    
    // Education
    highestQualification: "",
    passingYear: "",
    
    // Experience
    previousCompany: "",
    previousDesignation: "",
    totalExperience: ""
  });

  const [files, setFiles] = useState({
    profilePicture: null,
    aadhaarCard: null,
    panCard: null,
    bankPassbook: null,
    educationCert: null,
    experienceCert: null
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles({ ...files, [name]: fileList[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const submitData = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append all files
      if (files.profilePicture) submitData.append("profilePicture", files.profilePicture);
      if (files.aadhaarCard) submitData.append("aadhaarCard", files.aadhaarCard);
      if (files.panCard) submitData.append("panCard", files.panCard);
      if (files.bankPassbook) submitData.append("bankPassbook", files.bankPassbook);
      if (files.educationCert) submitData.append("educationCert", files.educationCert);
      if (files.experienceCert) submitData.append("experienceCert", files.experienceCert);
      
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/register`,
        submitData
      );
      
      setMsg(`✅ Registered Successfully! Employee ID: ${res.data.EmployeeID}`);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Error:", err.response?.data);
      setError(err.response?.data?.error || "Registration failed");
    }
    setLoading(false);
  };

  const tabs = ["Basic Info", "Job & Shift", "Salary & Leave", "Bank & Docs", "Personal Details"];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800">Employee Registration</h2>
          <p className="text-center text-gray-500 mt-1">Work Force Management Portal</p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === idx
                  ? "border-b-2 border-blue-500 text-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">
            ❌ {error}
          </div>
        )}
        
        {msg && (
          <div className="mx-6 mt-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded">
            ✅ {msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[600px] overflow-y-auto">
            
            {/* ========== TAB 0: BASIC INFO ========== */}
            {activeTab === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobile" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" value={formData.mobile} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Gender</label>
                  <select name="gender" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Department <span className="text-red-500">*</span></label>
                  <input type="text" name="department" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" value={formData.department} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Designation</label>
                  <input type="text" name="designation" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" value={formData.designation} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Joining Date</label>
                  <input type="date" name="joiningDate" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" value={formData.joiningDate} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Company Name</label>
                  <input type="text" name="companyName" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" value={formData.companyName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Reporting Manager</label>
                  <input type="text" name="doerName" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400" value={formData.doerName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" className="w-full border border-gray-300 p-2 rounded-lg pr-10 focus:ring-2 focus:ring-blue-400" value={formData.password} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Profile Picture</label>
                  <input type="file" name="profilePicture" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleFileChange} accept="image/*" />
                  {files.profilePicture && <p className="text-xs text-green-600 mt-1">✅ File selected: {files.profilePicture.name}</p>}
                </div>
              </div>
            )}

            {/* ========== TAB 1: JOB & SHIFT ========== */}
            {activeTab === 1 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-gray-700 border-b pb-2">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Employee Type</label>
                    <select name="employeeType" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>Permanent</option>
                      <option>Contract</option>
                      <option>Trainee</option>
                      <option>Consultant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Work Location</label>
                    <input type="text" name="workLocation" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.workLocation} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Employee Status</label>
                    <select name="employeeStatus" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Probation</option>
                    </select>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mt-4">Shift Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Shift Name</label>
                    <select name="shiftName" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>Day</option>
                      <option>Night</option>
                      <option>General</option>
                      <option>Rotational</option>
                      <option>Morning</option>
                      <option>Evening</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Shift Start Time</label>
                    <input type="time" name="shiftStartTime" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.shiftStartTime} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Shift End Time</label>
                    <input type="time" name="shiftEndTime" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.shiftEndTime} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Total Working Hours</label>
                    <input type="number" name="totalWorkingHours" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.totalWorkingHours} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Lunch Break (minutes)</label>
                    <input type="number" name="lunchBreak" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.lunchBreak} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Weekly Off</label>
                    <select name="weeklyOff" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>Sunday</option>
                      <option>Saturday</option>
                      <option>Friday</option>
                      <option>Monday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Overtime Applicable</label>
                    <select name="overtimeApplicable" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  {formData.overtimeApplicable === "Yes" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Overtime Rate (₹/hr)</label>
                      <input type="number" name="overtimeRate" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.overtimeRate} onChange={handleChange} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========== TAB 2: SALARY & LEAVE ========== */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-gray-700 border-b pb-2">Salary Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Basic Salary (₹)</label>
                    <input type="number" name="basicSalary" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.basicSalary} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Working Days/Month</label>
                    <input type="number" name="workingDays" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.workingDays} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Petrol Allowance</label>
                    <select name="petrolAllowance" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  {formData.petrolAllowance === "Yes" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Petrol Amount (₹)</label>
                      <input type="number" name="petrolAmount" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.petrolAmount} onChange={handleChange} />
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Food Allowance</label>
                    <select name="foodAllowance" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  {formData.foodAllowance === "Yes" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Food Amount (₹)</label>
                      <input type="number" name="foodAmount" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.foodAmount} onChange={handleChange} />
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">PF Applicable</label>
                    <select name="pfApplicable" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">PT Applicable</label>
                    <select name="ptApplicable" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Advance Allowed</label>
                    <select name="advanceAllowed" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  {formData.advanceAllowed === "Yes" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Advance Limit (₹)</label>
                      <input type="number" name="advanceLimit" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.advanceLimit} onChange={handleChange} />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mt-4">Attendance Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Biometric ID</label>
                    <input type="text" name="biometricId" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.biometricId} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Grace Time (minutes)</label>
                    <input type="number" name="graceTime" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.graceTime} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Late Mark After (minutes)</label>
                    <input type="number" name="lateMarkAfter" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.lateMarkAfter} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Half Day After (hours)</label>
                    <input type="number" name="halfDayAfter" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.halfDayAfter} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Minimum Working Hours</label>
                    <input type="number" name="minWorkingHours" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.minWorkingHours} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Punch Required</label>
                    <select name="punchRequired" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>1</option>
                      <option>2</option>
                      <option>4</option>
                    </select>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mt-4">Leave Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Paid Leave (PL)</label>
                    <input type="number" name="paidLeave" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.paidLeave} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Casual Leave (CL)</label>
                    <input type="number" name="casualLeave" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.casualLeave} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Sick Leave (SL)</label>
                    <input type="number" name="sickLeave" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.sickLeave} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Earned Leave (EL)</label>
                    <input type="number" name="earnedLeave" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.earnedLeave} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Leave Carry Forward</label>
                    <select name="leaveCarryForward" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  {formData.leaveCarryForward === "Yes" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Max Carry Forward (days)</label>
                      <input type="number" name="leaveCarryMax" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.leaveCarryMax} onChange={handleChange} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========== TAB 3: BANK & DOCUMENTS ========== */}
            {activeTab === 3 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-gray-700 border-b pb-2">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Bank Name</label>
                    <input type="text" name="bankName" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.bankName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Account Number</label>
                    <input type="text" name="accountNumber" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.accountNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">IFSC Code</label>
                    <input type="text" name="ifscCode" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.ifscCode} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">PF Number</label>
                    <input type="text" name="pfNumber" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.pfNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">ESIC Number</label>
                    <input type="text" name="esicNumber" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.esicNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Bank Passbook</label>
                    <input type="file" name="bankPassbook" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                    {files.bankPassbook && <p className="text-xs text-green-600 mt-1">✅ File selected: {files.bankPassbook.name}</p>}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mt-4">Government Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Aadhaar Number</label>
                    <input type="text" name="aadhaarNumber" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.aadhaarNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Aadhaar Card Upload</label>
                    <input type="file" name="aadhaarCard" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                    {files.aadhaarCard && <p className="text-xs text-green-600 mt-1">✅ File selected: {files.aadhaarCard.name}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">PAN Number</label>
                    <input type="text" name="panNumber" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.panNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">PAN Card Upload</label>
                    <input type="file" name="panCard" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                    {files.panCard && <p className="text-xs text-green-600 mt-1">✅ File selected: {files.panCard.name}</p>}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mt-4">Education Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Highest Qualification</label>
                    <input type="text" name="highestQualification" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.highestQualification} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Passing Year</label>
                    <input type="text" name="passingYear" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.passingYear} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Education Certificate</label>
                    <input type="file" name="educationCert" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                    {files.educationCert && <p className="text-xs text-green-600 mt-1">✅ File selected: {files.educationCert.name}</p>}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mt-4">Previous Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Previous Company</label>
                    <input type="text" name="previousCompany" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.previousCompany} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Previous Designation</label>
                    <input type="text" name="previousDesignation" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.previousDesignation} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Total Experience</label>
                    <input type="text" name="totalExperience" placeholder="e.g., 5 years 2 months" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.totalExperience} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Experience Certificate</label>
                    <input type="file" name="experienceCert" className="w-full border border-gray-300 p-2 rounded-lg" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                    {files.experienceCert && <p className="text-xs text-green-600 mt-1">✅ File selected: {files.experienceCert.name}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ========== TAB 4: PERSONAL DETAILS ========== */}
            {activeTab === 4 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-gray-700 border-b pb-2">Family Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Father's Name</label>
                    <input type="text" name="fatherName" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.fatherName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Mother's Name</label>
                    <input type="text" name="motherName" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.motherName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Spouse Name</label>
                    <input type="text" name="spouseName" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.spouseName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Spouse Date of Birth</label>
                    <input type="date" name="spouseDob" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.spouseDob} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Mother-in-law Name</label>
                    <input type="text" name="motherInLawName" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.motherInLawName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Father-in-law Name</label>
                    <input type="text" name="fatherInLawName" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.fatherInLawName} onChange={handleChange} />
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mt-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Contact Person Name</label>
                    <input type="text" name="emergencyContactName" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.emergencyContactName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                    <input type="tel" name="emergencyContactNumber" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.emergencyContactNumber} onChange={handleChange} />
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mt-4">Address Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Permanent Address</label>
                    <textarea name="permanentAddress" rows="3" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.permanentAddress} onChange={handleChange} placeholder="Enter permanent address"></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Current Address</label>
                    <textarea name="currentAddress" rows="3" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.currentAddress} onChange={handleChange} placeholder="Enter current address"></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 0 
                  ? "bg-gray-200 cursor-not-allowed" 
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
              disabled={activeTab === 0}
            >
              ← Previous
            </button>
            
            {activeTab < tabs.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Registering...
                  </>
                ) : (
                  "✓ Register Employee"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}