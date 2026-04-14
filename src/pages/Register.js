import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    department: "",
    companyName: "",
    designation: "",
    joiningDate: "",
    dateOfBirth: "",
    doerName: ""
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/register`, formData);
      setMsg(`✅ Registered Successfully! Your EmployeeID: ${res.data.EmployeeID}`);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Register to get started</p>

        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">{error}</div>}
        {msg && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
              <input type="text" name="name" placeholder="Enter full name" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Mobile Number *</label>
              <input type="tel" name="mobile" placeholder="Enter mobile number" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" value={formData.mobile} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Department *</label>
              <input type="text" name="department" placeholder="Enter department" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" value={formData.department} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password *</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter password" className="w-full border border-gray-300 p-2 rounded-lg pr-10 focus:ring-2 focus:ring-blue-400 outline-none" value={formData.password} onChange={handleChange} required />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
            {showAdvanced ? "▼ Hide Advanced Options" : "▶ Show Advanced Options (Profile Details)"}
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Profile Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Company Name</label>
                  <input type="text" name="companyName" placeholder="Enter company name" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" value={formData.companyName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Designation</label>
                  <input type="text" name="designation" placeholder="Enter designation" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" value={formData.designation} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Joining Date</label>
                  <input type="date" name="joiningDate" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" value={formData.joiningDate} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm mb-1">Doer Name (Reporting To)</label>
                  <input type="text" name="doerName" placeholder="Enter doer/reporting manager name" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" value={formData.doerName} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200 flex justify-center items-center">
            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <button onClick={() => navigate("/")} className="text-blue-600 font-semibold hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
}