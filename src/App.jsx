import { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, BatteryCharging, CalendarDays,
  ChevronDown, CircleHelp, Command, Download, Gauge, LayoutDashboard,
  Lightbulb, Menu, Settings2, Sun, SunMedium, Target, Wifi, X, Zap
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

const dayData = [
  { time: '06:00', output: 8 }, { time: '07:00', output: 24 },
  { time: '08:00', output: 51 }, { time: '09:00', output: 78 },
  { time: '10:00', output: 112 }, { time: '11:00', output: 138 },
  { time: '12:00', output: 151 }, { time: '13:00', output: 143 },
  { time: '14:00', output: 126 }, { time: '15:00', output: 98 },
  { time: '16:00', output: 61 }, { time: '17:00', output: 29 },
  { time: '18:00', output: 7 }
];
const weekData = [
  { time: 'Mon', output: 720 }, { time: 'Tue', output: 840 },
  { time: 'Wed', output: 680 }, { time: 'Thu', output: 910 },
  { time: 'Fri', output: 780 }, { time: 'Sat', output: 960 },
  { time: 'Sun', output: 865 }
];

function MetricCard({ label, value, unit, icon: Icon, note, trend, trendUp = true }) {
  return <article className="metric-card">
    <div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={17} strokeWidth={1.8}/></span></div>
    <div className="metric-value">{value}<span>{unit}</span></div>
    <div className="metric-bottom"><span className={trend ? (trendUp ? 'trend positive' : 'trend negative') : 'muted'}>{trend && (trendUp ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>)}{trend}</span><span className="muted">{note}</span></div>
  </article>;
}

function Sidebar({ active, setActive, open, close }) {
  const links = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Energy analytics', icon: Activity },
    { label: 'Solar tracking', icon: SunMedium },
    { label: 'Device settings', icon: Settings2 }
  ];
  return <>
    {open && <button className="scrim" aria-label="Close menu" onClick={close}/>}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Sun size={19}/></span><span>adaptive<span className="brand-light">solar</span></span><button className="icon-button mobile-close" onClick={close} aria-label="Close navigation"><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switch"><span className="workspace-avatar">S</span><span className="workspace-text"><strong>Solar Lab</strong><small>Personal workspace</small></span><ChevronDown size={15}/></button>
      <div className="nav-label">MONITORING</div>
      <nav className="nav-list">{links.map(({label, icon: Icon}) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => {setActive(label); close();}}><Icon size={17} strokeWidth={1.8}/><span>{label}</span>{label === 'Solar tracking' && <span className="nav-live-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="device-mini"><div className="device-mini-head"><span className="device-led"/> <span>ESP32 controller</span></div><strong>Waiting for device</strong><small>Hardware not connected</small></div>
        <button className="nav-item help-link" onClick={() => setActive('Help & documentation')}><CircleHelp size={17}/><span>Help & documentation</span></button>
        <div className="profile"><div className="profile-avatar">PA</div><div className="profile-copy"><strong>Project workspace</strong><small>Prototype · v0.1</small></div><Command size={16} className="profile-more"/></div>
      </div>
    </aside>
  </>;
}

export default function App() {
  const [active, setActive] = useState('Overview');
  const [period, setPeriod] = useState('Today');
  const [menuOpen, setMenuOpen] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const chartData = useMemo(() => period === '7 days' ? weekData : dayData, [period]);
  const chartUnit = period === '7 days' ? 'Wh' : 'mW';
  const pageTitle = active === 'Overview' ? 'Energy overview' : active;
  const isOverview = active === 'Overview';

  return <div className="app-shell">
    <Sidebar active={active} setActive={setActive} open={menuOpen} close={() => setMenuOpen(false)}/>
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="icon-button menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20}/></button><span className="breadcrumb">Solar Lab</span><span className="breadcrumb-separator">/</span><span className="breadcrumb-current">{pageTitle}</span></div>
        <div className="topbar-right"><span className="connection-pill"><span className="status-dot"/>Demo mode</span><button className="icon-button" aria-label="Settings" onClick={() => setActive('Device settings')}><Settings2 size={18}/></button><div className="top-avatar">PA</div></div>
      </header>
      <div className="page-content">
        <section className="page-heading">
          <div><div className="eyebrow">SOLAR MONITORING <span>·</span> PROTOTYPE</div><h1>{pageTitle}</h1><p className="page-subtitle">{isOverview ? 'A clear view of your panel performance and tracking system.' : `Manage and review your ${active.toLowerCase()} workspace.`}</p></div>
          <div className="heading-actions"><button className="button button-secondary" onClick={() => window.print()}><Download size={15}/> Export report</button><button className="button button-primary" onClick={() => setActive('Device settings')}><Settings2 size={15}/> Configure device</button></div>
        </section>
        {showNotice && <div className="demo-notice"><span className="notice-icon"><Lightbulb size={16}/></span><div><strong>Preview data is being shown</strong><p>These sample readings are for layout preview only. Connect the ESP32 and API to display measured values.</p></div><button className="icon-button notice-close" onClick={() => setShowNotice(false)} aria-label="Dismiss notice"><X size={16}/></button></div>}
        {isOverview ? <>
          <section className="metrics-grid">
            <MetricCard label="Energy generated" value="0.84" unit=" Wh" icon={Zap} trend="12.8%" note="vs. previous day" />
            <MetricCard label="Current power" value="142" unit=" mW" icon={Activity} trend="Live preview" note="sample reading" />
            <MetricCard label="Panel voltage" value="5.18" unit=" V" icon={Gauge} note="sample reading" />
            <MetricCard label="Panel current" value="27.4" unit=" mA" icon={BatteryCharging} note="sample reading" />
          </section>
          <section className="content-grid">
            <article className="panel chart-panel">
              <div className="panel-header"><div><h2>Energy production</h2><p>Output across the selected period</p></div><div className="segmented-control"><button className={period === 'Today' ? 'selected' : ''} onClick={() => setPeriod('Today')}>Today</button><button className={period === '7 days' ? 'selected' : ''} onClick={() => setPeriod('7 days')}>7 days</button></div></div>
              <div className="chart-summary"><strong>{period === 'Today' ? '0.84 Wh' : '5.76 Wh'}</strong><span><span className="trend positive"><ArrowUpRight size={14}/> 8.4%</span> <span className="muted">compared with previous period</span></span></div>
              <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}><defs><linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c5d8a4" stopOpacity={0.52}/><stop offset="95%" stopColor="#c5d8a4" stopOpacity={0.03}/></linearGradient></defs><CartesianGrid stroke="#e9e9e4" vertical={false} strokeDasharray="3 4"/><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#92938c', fontSize: 11 }} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#92938c', fontSize: 11 }} tickFormatter={v => v} /><Tooltip contentStyle={{border:'1px solid #e8e8e1',borderRadius:8,fontSize:12,boxShadow:'0 4px 16px #0000000a'}} formatter={(v) => [`${v} ${chartUnit}`, 'Output']}/><Area type="monotone" dataKey="output" stroke="#718a4d" strokeWidth={2} fill="url(#energyFill)" activeDot={{r:4,stroke:'#718a4d',strokeWidth:2,fill:'#fff'}}/></AreaChart></ResponsiveContainer></div>
              <div className="chart-footer"><span><span className="legend-dot"/> {period === 'Today' ? 'Power output' : 'Daily energy'}</span><span><CalendarDays size={14}/> {period === 'Today' ? 'Today, sample timeline' : 'Last 7 days, sample data'}</span></div>
            </article>
            <article className="panel tracking-panel">
              <div className="panel-header"><div><h2>Solar tracking</h2><p>Dual-axis positioning</p></div><span className={`small-status ${tracking ? 'status-on' : ''}`}><span/> {tracking ? 'Enabled' : 'Standby'}</span></div>
              <div className="tracking-visual"><div className="sun-path"><span className="sun-position"><Sun size={28}/></span><span className="path-line"/></div><div className="panel-illustration"><div className="solar-grid"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div></div><div className="mount-line"/></div>
              <div className="angle-grid"><div><span>Horizontal angle</span><strong>042°</strong></div><div><span>Vertical angle</span><strong>018°</strong></div></div>
              <div className="tracking-control"><div><strong>Automatic tracking</strong><small>{tracking ? 'Control preview enabled' : 'Awaiting controller connection'}</small></div><button className={`toggle ${tracking ? 'toggle-on' : ''}`} onClick={() => setTracking(!tracking)} aria-label="Toggle automatic tracking" aria-pressed={tracking}><span/></button></div>
              <p className="control-footnote">Control is simulated until the ESP32 is connected.</p>
            </article>
          </section>
          <section className="bottom-grid">
            <article className="panel sensor-panel"><div className="panel-header"><div><h2>Light sensors</h2><p>Relative LDR readings</p></div><span className="text-tag">4 sensors</span></div><div className="sensor-list">{[['Top left','LDR 01',68],['Top right','LDR 02',74],['Bottom left','LDR 03',51],['Bottom right','LDR 04',59]].map(([label,id,val])=><div className="sensor-row" key={id}><div className="sensor-name"><span className="sensor-symbol"><SunMedium size={15}/></span><div><strong>{label}</strong><small>{id}</small></div></div><div className="sensor-bar"><span style={{width:val+'%'}}/></div><strong className="sensor-value">{val}<small>%</small></strong></div>)}</div><div className="panel-footnote"><span className="status-dot"/> Sample values · not connected to hardware</div></article>
            <article className="panel device-panel"><div className="panel-header"><div><h2>Device status</h2><p>Controller health and connectivity</p></div><button className="icon-button" aria-label="Device settings" onClick={() => setActive('Device settings')}><Settings2 size={17}/></button></div><div className="device-state"><div className="device-icon"><Wifi size={21}/></div><div><strong>ESP32 controller</strong><p>Not connected</p></div><span className="state-badge">Offline</span></div><div className="device-details"><div><span>Connection</span><strong>Wi-Fi · unavailable</strong></div><div><span>Last received</span><strong>—</strong></div><div><span>Firmware</span><strong>Not detected</strong></div><div><span>API endpoint</span><strong>Not configured</strong></div></div><button className="button button-secondary full-button" onClick={() => setActive('Device settings')}>Set up connection <span>→</span></button></article>
          </section>
        </> : <section className="panel secondary-page"><div className="secondary-icon">{active === 'Solar tracking' ? <Target size={23}/> : active === 'Energy analytics' ? <Activity size={23}/> : <Settings2 size={23}/>}</div><h2>{active}</h2><p>This section is part of the dashboard shell. The hardware integration and detailed controls will be implemented after the overview and API contract are established.</p><button className="button button-primary" onClick={() => setActive('Overview')}>Back to overview</button></section>}
        <footer className="page-footer"><span>Adaptive Solar <span className="footer-separator">/</span> Prototype dashboard</span><span>Hardware connection pending <span className="footer-dot"/></span></footer>
      </div>
    </main>
  </div>;
}