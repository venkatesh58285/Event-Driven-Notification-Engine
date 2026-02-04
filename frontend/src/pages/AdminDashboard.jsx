import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard() {
  const [data, setData] = useState({ dueUsers: [], logs: [] });
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    message: "",
    delayMs: 0,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDashboard();
    // Refresh data every 5 seconds
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "delayMs" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.post("/notification", formData);
      setSuccessMessage(
        `✅ Notification scheduled! Job ID: ${response.data.jobId} (Delay: ${response.data.delaySeconds}s)`,
      );

      // Reset form
      setFormData({
        userId: "",
        email: "",
        message: "",
        delayMs: 0,
      });

      // Refresh dashboard
      setTimeout(fetchDashboard, 1000);
    } catch (error) {
      setErrorMessage(
        `❌ Error: ${error.response?.data?.error || error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const delaySeconds = formData.delayMs / 1000;
  let delayDisplay = "Now";
  if (delaySeconds > 0) {
    if (delaySeconds < 60) delayDisplay = `${delaySeconds}s`;
    else if (delaySeconds < 3600)
      delayDisplay = `${(delaySeconds / 60).toFixed(1)}m`;
    else delayDisplay = `${(delaySeconds / 3600).toFixed(1)}h`;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>📬 Notification Dashboard</h1>

      {/* Create Notification Form */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "2px solid #ddd",
        }}
      >
        <h2>Create & Schedule Email</h2>

        {successMessage && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              User ID
            </label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              placeholder="Enter user ID"
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              placeholder="Enter recipient email"
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter notification message"
              required
              rows="3"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
                fontFamily: "Arial",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Delay: {delayDisplay}
            </label>
            <input
              type="range"
              name="delayMs"
              min="0"
              max="3600000"
              step="1000"
              value={formData.delayMs}
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <small style={{ color: "#666" }}>0ms to 60 minutes</small>
            <br />
            <input
              type="number"
              name="delayMs"
              value={formData.delayMs}
              onChange={handleInputChange}
              placeholder="Delay in milliseconds"
              min="0"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
                marginTop: "8px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {loading ? "Scheduling..." : "📤 Schedule Notification"}
          </button>
        </form>
      </div>

      {/* Due Users Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2>👥 Due Users ({data.dueUsers.length})</h2>
        {data.dueUsers.length > 0 ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {data.dueUsers.map((u) => (
              <div
                key={u._id}
                style={{
                  backgroundColor: "#fff3cd",
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid #ffc107",
                }}
              >
                <strong>{u.name}</strong> - {u.email}
                <br />
                <small>
                  Service Date: {new Date(u.nextServiceDate).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#999" }}>No due users</p>
        )}
      </div>

      {/* Notification Logs Section */}
      <div>
        <h2>📋 Notification Logs ({data.logs.length})</h2>
        {data.logs.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
              }}
            >
              <thead style={{ backgroundColor: "#f0f0f0" }}>
                <tr>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Channel
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Error
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.logs.map((l, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>
                      {l.channel === "email" && "📧"}
                      {l.channel === "sms" && "📱"}
                      {l.channel === "push" && "🔔"}
                      {l.channel === "webhook" && "🪝"} {l.channel}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        color: l.status === "success" ? "#28a745" : "#dc3545",
                        fontWeight: "bold",
                      }}
                    >
                      {l.status === "success" ? "✅" : "❌"} {l.status}
                    </td>
                    <td style={{ padding: "10px", color: "#666" }}>
                      {l.error || "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        color: "#999",
                        fontSize: "12px",
                      }}
                    >
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "#999" }}>No logs yet</p>
        )}
      </div>
    </div>
  );
}
