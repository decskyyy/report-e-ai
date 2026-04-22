import { useState, useEffect, useRef } from "react";

const formatDate = (date) => {
  const d = new Date(date);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const today = new Date().toISOString().split("T")[0];

const defaultIssues = [
  { platform: "HR Platform", subIssue: "Sync Failure", impact: "Menghambat proses submit & sinkronisasi data HR", status: "Resolved", resolution: "user diarahkan retry setelah fix dikonfirmasi" },
  { platform: "Middleware", subIssue: "Pending Orders Backlog", impact: "Potensi delay operasional akibat order tidak terproses", status: "Resolved", resolution: "manual push" },
  { platform: "CDS", subIssue: "In Used", impact: "Gangguan display operasional outlet", status: "Resolved", resolution: "rebind device, mengarahkan setup ulang" },
];

const StatusBadge = ({ status }) => {
  const colors = {
    Resolved: { bg: "#0d2e1a", border: "#22c55e", text: "#4ade80" },
    "In Progress": { bg: "#1a1a0d", border: "#eab308", text: "#facc15" },
    Escalated: { bg: "#2e0d0d", border: "#ef4444", text: "#f87171" },
    Monitoring: { bg: "#0d1a2e", border: "#3b82f6", text: "#60a5fa" },
  };
  const c = colors[status] || colors["Monitoring"];
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
      letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace"
    }}>{status}</span>
  );
};

function TypewriterText({ text, speed = 8, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    setDisplayed("");
    idx.current = 0;
    if (!text) return;
    const interval = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}</span>;
}

export default function App() {
  const [step, setStep] = useState("form"); // form | generating | report
  const [progress, setProgress] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    date: today,
    overview: "Platform dalam kondisi stabil dan terkendali, dengan mayoritas isu berhasil diselesaikan pada hari yang sama tanpa eskalasi kritikal.",
    totalTickets: "9",
    issues: defaultIssues,
    highlights: "Operasional didominasi oleh high-volume request POS, namun tetap terkendali dengan response time yang baik untuk semua app yang di pegang.",
  });

  const updateIssue = (i, field, val) => {
    const issues = [...form.issues];
    issues[i] = { ...issues[i], [field]: val };
    setForm({ ...form, issues });
  };

  const addIssue = () => setForm({ ...form, issues: [...form.issues, { platform: "", subIssue: "", impact: "", status: "Resolved", resolution: "" }] });
  const removeIssue = (i) => setForm({ ...form, issues: form.issues.filter((_, idx) => idx !== i) });

  const generateReport = () => {
    setStep("generating");
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => { setStep("report"); setShowReport(true); }, 400); }
      setProgress(Math.min(p, 100));
    }, 120);
  };

  const reportText = `PLATFORM OPERATIONS REPORT
${formatDate(form.date)}

1. OVERVIEW
${form.overview}
Total Freescout tickets : ${form.totalTickets}

2. KEY ISSUES
${form.issues.map(iss => `${iss.platform}${iss.subIssue ? ` — ${iss.subIssue}` : ""}
Impact : ${iss.impact}
Status : ${iss.status}${iss.resolution ? ` (${iss.resolution})` : ""}`).join("\n\n")}

3. HIGHLIGHTS & INSIGHTS
${form.highlights}`;

  const copyReport = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusOptions = ["Resolved", "In Progress", "Escalated", "Monitoring"];

  const inputStyle = {
    background: "#0a0f1a",
    border: "1px solid #1e2d45",
    color: "#c8d8f0",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = { color: "#4a7fa8", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 4, display: "block", fontFamily: "'JetBrains Mono', monospace" };

  return (
    <div style={{
      minHeight: "100vh", background: "#060b14",
      fontFamily: "'JetBrains Mono', monospace",
      color: "#c8d8f0",
      backgroundImage: "radial-gradient(ellipse at 20% 0%, #0a1628 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, #081020 0%, transparent 60%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: #2563eb !important; box-shadow: 0 0 0 2px rgba(37,99,235,0.15); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0f1a; } ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 2px; }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes scanline { 0%{top:-10%;} 100%{top:110%;} }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
        .issue-card { animation: fadeSlideUp 0.4s ease both; }
        .report-section { animation: fadeSlideUp 0.5s ease both; }
        .btn-primary:hover { background: #1d4ed8 !important; transform: translateY(-1px); }
        .btn-danger:hover { background: #7f1d1d !important; }
        .btn-ghost:hover { background: #0a1628 !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #0f1d30", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(6,11,20,0.95)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", boxShadow: "0 0 10px #2563eb" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, letterSpacing: 3, color: "#e2eaf5", textTransform: "uppercase" }}>OpsReport</span>
          <span style={{ color: "#1e3a5c", fontSize: 11 }}>///</span>
          <span style={{ color: "#3b5c80", fontSize: 11, letterSpacing: 1 }}>Platform Operations System</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#22c55e", fontSize: 10, letterSpacing: 2 }}>LIVE</span>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px" }}>

        {/* FORM STEP */}
        {step === "form" && (
          <div style={{ animation: "fadeSlideUp 0.5s ease" }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ color: "#1e3a5c", fontSize: 10, letterSpacing: 4, marginBottom: 6 }}>// NEW REPORT</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#e2eaf5", margin: 0, letterSpacing: -0.5 }}>
                Platform Operations<br /><span style={{ color: "#2563eb" }}>Report Generator</span>
              </h1>
            </div>

            {/* Date & Tickets */}
            <div style={{ background: "#080e1a", border: "1px solid #0f1d30", borderRadius: 10, padding: 24, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Tanggal Laporan</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Total Freescout Tickets</label>
                  <input type="number" value={form.totalTickets} onChange={e => setForm({...form, totalTickets: e.target.value})} style={inputStyle} placeholder="e.g. 9" />
                </div>
              </div>
            </div>

            {/* Overview */}
            <div style={{ background: "#080e1a", border: "1px solid #0f1d30", borderRadius: 10, padding: 24, marginBottom: 16 }}>
              <label style={labelStyle}>1. Overview</label>
              <textarea value={form.overview} onChange={e => setForm({...form, overview: e.target.value})} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} placeholder="Deskripsi kondisi platform hari ini..." />
            </div>

            {/* Key Issues */}
            <div style={{ background: "#080e1a", border: "1px solid #0f1d30", borderRadius: 10, padding: 24, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>2. Key Issues</label>
                <button onClick={addIssue} className="btn-ghost" style={{ background: "#0a1628", border: "1px solid #1e2d45", color: "#4a7fa8", borderRadius: 6, padding: "5px 14px", fontSize: 11, cursor: "pointer", letterSpacing: 1, transition: "all 0.2s" }}>+ ADD ISSUE</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {form.issues.map((iss, i) => (
                  <div key={i} className="issue-card" style={{ background: "#060b14", border: "1px solid #0f1d30", borderRadius: 8, padding: 16, position: "relative", animationDelay: `${i * 0.07}s` }}>
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <button onClick={() => removeIssue(i)} className="btn-danger" style={{ background: "transparent", border: "1px solid #7f1d1d", color: "#f87171", borderRadius: 4, padding: "2px 8px", fontSize: 10, cursor: "pointer", transition: "all 0.2s" }}>✕</button>
                    </div>
                    <div style={{ color: "#1e3a5c", fontSize: 10, letterSpacing: 3, marginBottom: 12 }}>ISSUE #{String(i + 1).padStart(2, "0")}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={labelStyle}>Platform</label>
                        <input value={iss.platform} onChange={e => updateIssue(i, "platform", e.target.value)} style={inputStyle} placeholder="e.g. HR Platform" />
                      </div>
                      <div>
                        <label style={labelStyle}>Sub Issue</label>
                        <input value={iss.subIssue} onChange={e => updateIssue(i, "subIssue", e.target.value)} style={inputStyle} placeholder="e.g. Sync Failure" />
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={labelStyle}>Impact</label>
                      <textarea value={iss.impact} onChange={e => updateIssue(i, "impact", e.target.value)} rows={2} style={{ ...inputStyle, resize: "none" }} placeholder="Deskripsi dampak issue..." />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Status</label>
                        <select value={iss.status} onChange={e => updateIssue(i, "status", e.target.value)} style={{ ...inputStyle }}>
                          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Resolution / Notes</label>
                        <input value={iss.resolution} onChange={e => updateIssue(i, "resolution", e.target.value)} style={inputStyle} placeholder="Langkah penyelesaian..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div style={{ background: "#080e1a", border: "1px solid #0f1d30", borderRadius: 10, padding: 24, marginBottom: 28 }}>
              <label style={labelStyle}>3. Highlights & Insights</label>
              <textarea value={form.highlights} onChange={e => setForm({...form, highlights: e.target.value})} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} placeholder="Catatan operasional hari ini..." />
            </div>

            <button onClick={generateReport} className="btn-primary" style={{
              width: "100%", padding: "14px", background: "#2563eb", border: "none", color: "#fff",
              borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: 3, cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", transition: "all 0.2s",
              boxShadow: "0 4px 24px rgba(37,99,235,0.3)"
            }}>⚡ Generate Report</button>
          </div>
        )}

        {/* GENERATING STEP */}
        {step === "generating" && (
          <div style={{ textAlign: "center", paddingTop: 80, animation: "fadeSlideUp 0.4s ease" }}>
            <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #0f1d30" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#2563eb", animation: "spin 1s linear infinite" }} />
              <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "1px solid transparent", borderTopColor: "#3b82f6", animation: "spin 0.6s linear infinite reverse" }} />
              <span style={{ fontSize: 24 }}>⚡</span>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#e2eaf5", marginBottom: 8 }}>Generating Report...</div>
            <div style={{ color: "#3b5c80", fontSize: 11, letterSpacing: 2, marginBottom: 32 }}>MEMPROSES DATA OPERASIONAL</div>
            <div style={{ width: 280, margin: "0 auto", background: "#080e1a", border: "1px solid #0f1d30", borderRadius: 100, height: 6, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 100, transition: "width 0.15s ease",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #2563eb, #60a5fa)",
                boxShadow: "0 0 10px rgba(37,99,235,0.5)"
              }} />
            </div>
            <div style={{ marginTop: 12, color: "#2563eb", fontSize: 12 }}>{Math.round(progress)}%</div>
          </div>
        )}

        {/* REPORT STEP */}
        {step === "report" && showReport && (
          <div style={{ animation: "fadeSlideUp 0.5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ color: "#1e3a5c", fontSize: 10, letterSpacing: 4, marginBottom: 4 }}>// REPORT GENERATED</div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#e2eaf5", margin: 0 }}>Platform Operations Report</h2>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setStep("form"); setShowReport(false); }} className="btn-ghost" style={{ background: "#080e1a", border: "1px solid #1e2d45", color: "#4a7fa8", borderRadius: 6, padding: "8px 16px", fontSize: 11, cursor: "pointer", letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s" }}>← EDIT</button>
                <button onClick={copyReport} style={{
                  background: copied ? "#14532d" : "#2563eb", border: "none", color: "#fff", borderRadius: 6, padding: "8px 16px", fontSize: 11, cursor: "pointer", letterSpacing: 1,
                  fontFamily: "'JetBrains Mono', monospace", transition: "all 0.3s", fontWeight: 700
                }}>{copied ? "✓ COPIED!" : "⎘ COPY TEXT"}</button>
              </div>
            </div>

            {/* Report Card */}
            <div style={{
              background: "#080e1a", border: "1px solid #0f1d30", borderRadius: 12, overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.05)"
            }}>
              {/* Report Header */}
              <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d1f3c 100%)", padding: "28px 32px", borderBottom: "1px solid #0f1d30", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ color: "#3b5c80", fontSize: 10, letterSpacing: 4, marginBottom: 8 }}>PLATFORM OPERATIONS</div>
                      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#e2eaf5", margin: "0 0 4px" }}>
                        <TypewriterText text="OPERATIONS REPORT" speed={35} />
                      </h2>
                      <div style={{ color: "#4a7fa8", fontSize: 12, letterSpacing: 1 }}>{formatDate(form.date)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#3b5c80", fontSize: 10, letterSpacing: 2, marginBottom: 4 }}>TOTAL TICKETS</div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: "#2563eb", lineHeight: 1 }}>{form.totalTickets}</div>
                      <div style={{ color: "#3b5c80", fontSize: 10 }}>FREESCOUT</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: 32 }}>
                {/* Section 1 */}
                <div className="report-section" style={{ marginBottom: 32, animationDelay: "0.1s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ background: "#0d1f3c", border: "1px solid #1e3a5c", borderRadius: 4, padding: "2px 10px", color: "#4a7fa8", fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>01</div>
                    <div style={{ color: "#e2eaf5", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Overview</div>
                    <div style={{ flex: 1, height: 1, background: "#0f1d30" }} />
                  </div>
                  <div style={{ color: "#a0b8d0", fontSize: 13, lineHeight: 1.8, paddingLeft: 12, borderLeft: "2px solid #1e3a5c" }}>
                    {form.overview}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                    <div style={{ background: "#0d1f3c", border: "1px solid #1e3a5c", borderRadius: 6, padding: "8px 16px", fontSize: 11 }}>
                      <span style={{ color: "#3b5c80" }}>Total Tickets </span>
                      <span style={{ color: "#60a5fa", fontWeight: 700 }}>{form.totalTickets}</span>
                    </div>
                    <div style={{ background: "#0d2e1a", border: "1px solid #166534", borderRadius: 6, padding: "8px 16px", fontSize: 11 }}>
                      <span style={{ color: "#4ade80", fontWeight: 700 }}>✓ Stable</span>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="report-section" style={{ marginBottom: 32, animationDelay: "0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <div style={{ background: "#0d1f3c", border: "1px solid #1e3a5c", borderRadius: 4, padding: "2px 10px", color: "#4a7fa8", fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>02</div>
                    <div style={{ color: "#e2eaf5", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Key Issues</div>
                    <div style={{ flex: 1, height: 1, background: "#0f1d30" }} />
                    <div style={{ color: "#3b5c80", fontSize: 10, letterSpacing: 1 }}>{form.issues.length} ITEM{form.issues.length !== 1 ? "S" : ""}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {form.issues.map((iss, i) => (
                      <div key={i} className="report-section" style={{
                        background: "#060b14", border: "1px solid #0f1d30", borderRadius: 8, padding: 18,
                        animationDelay: `${0.25 + i * 0.1}s`, position: "relative", overflow: "hidden"
                      }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: iss.status === "Resolved" ? "#22c55e" : iss.status === "Escalated" ? "#ef4444" : iss.status === "In Progress" ? "#eab308" : "#3b82f6", borderRadius: "4px 0 0 4px" }} />
                        <div style={{ paddingLeft: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                            <div>
                              <span style={{ color: "#e2eaf5", fontWeight: 700, fontSize: 13 }}>{iss.platform}</span>
                              {iss.subIssue && <span style={{ color: "#3b5c80" }}> — </span>}
                              {iss.subIssue && <span style={{ color: "#60a5fa", fontSize: 13 }}>{iss.subIssue}</span>}
                            </div>
                            <StatusBadge status={iss.status} />
                          </div>
                          <div style={{ marginBottom: 6 }}>
                            <span style={{ color: "#3b5c80", fontSize: 11 }}>Impact </span>
                            <span style={{ color: "#a0b8d0", fontSize: 12 }}>: {iss.impact}</span>
                          </div>
                          {iss.resolution && (
                            <div>
                              <span style={{ color: "#3b5c80", fontSize: 11 }}>Resolution </span>
                              <span style={{ color: "#a0b8d0", fontSize: 12 }}>: {iss.resolution}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3 */}
                <div className="report-section" style={{ animationDelay: "0.5s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ background: "#0d1f3c", border: "1px solid #1e3a5c", borderRadius: 4, padding: "2px 10px", color: "#4a7fa8", fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>03</div>
                    <div style={{ color: "#e2eaf5", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Highlights & Insights</div>
                    <div style={{ flex: 1, height: 1, background: "#0f1d30" }} />
                  </div>
                  <div style={{ background: "#060b14", border: "1px solid #1e3a5c", borderLeft: "3px solid #2563eb", borderRadius: "0 8px 8px 0", padding: 18 }}>
                    <div style={{ color: "#2563eb", fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>◈ INSIGHT</div>
                    <div style={{ color: "#a0b8d0", fontSize: 13, lineHeight: 1.8 }}>{form.highlights}</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ borderTop: "1px solid #0f1d30", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#060b14" }}>
                <div style={{ color: "#1e3a5c", fontSize: 10, letterSpacing: 2 }}>GENERATED {new Date().toLocaleTimeString("id-ID")}</div>
                <div style={{ color: "#1e3a5c", fontSize: 10, letterSpacing: 2 }}>PLATFORM OPS /// CONFIDENTIAL</div>
              </div>
            </div>

            {/* Raw text */}
            <div style={{ marginTop: 20, background: "#080e1a", border: "1px solid #0f1d30", borderRadius: 10, padding: 20 }}>
              <div style={{ color: "#3b5c80", fontSize: 10, letterSpacing: 3, marginBottom: 12 }}>// RAW TEXT OUTPUT</div>
              <pre style={{ color: "#4a7fa8", fontSize: 11, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace" }}>{reportText}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
