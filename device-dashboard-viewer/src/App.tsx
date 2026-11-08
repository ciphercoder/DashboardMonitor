import { useEffect, useState } from 'react'

type ViewState = 'idle' | 'connecting' | 'live'

const devices = [
  { id: 'workbench', name: 'Workshop meter', place: 'Workbench', online: true },
  { id: 'boiler', name: 'Boiler panel', place: 'Utility room', online: false },
]

function App() {
  const [selected, setSelected] = useState(devices[0].id)
  const [streamState, setStreamState] = useState<ViewState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [notice, setNotice] = useState('')
  const activeDevice = devices.find((device) => device.id === selected)!

  useEffect(() => {
    if (streamState !== 'live') return
    const timer = window.setInterval(() => setElapsed((time) => time + 1), 1000)
    return () => window.clearInterval(timer)
  }, [streamState])

  function startStream() {
    if (!activeDevice.online) {
      setNotice('This camera is offline. Check that it is connected to your Wi-Fi.')
      return
    }
    setStreamState('connecting')
    window.setTimeout(() => {
      setElapsed(0)
      setStreamState('live')
    }, 900)
  }

  function stopStream() {
    setStreamState('idle')
    setElapsed(0)
  }

  const time = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="GaugeView home"><span className="brand-mark">◉</span>Gauge<span>View</span></a>
        <div className="network-status"><i /> Local network <b>•</b> Secured</div>
      </header>

      <section className="content" id="top">
        <div className="intro">
          <p className="eyebrow">DEVICE MONITORING</p>
          <h1>See the reading.<br /><em>Wherever you are.</em></h1>
          <p className="subcopy">Request a live view from a spare phone pointed at your device dashboard.</p>
        </div>

        <div className="dashboard">
          <aside className="device-panel">
            <div className="panel-heading"><div><span className="label">YOUR CAMERAS</span><h2>Devices</h2></div><button onClick={() => setNotice('Device pairing will be connected to the camera app later.')}>＋</button></div>
            <div className="device-list">
              {devices.map((device) => (
                <button key={device.id} className={`device ${device.id === selected ? 'selected' : ''}`} onClick={() => { setSelected(device.id); stopStream() }}>
                  <span className="camera-icon">⌁</span>
                  <span className="device-copy"><strong>{device.name}</strong><small>{device.place}</small></span>
                  <i className={device.online ? 'online' : 'offline'} />
                </button>
              ))}
            </div>
            <div className="privacy-note"><span>⌘</span><p><strong>Private by design</strong>Your video stays on your local network.</p></div>
          </aside>

          <section className="viewer-panel" aria-label="Live camera viewer">
            <div className="viewer-topline"><div><span className="label">ACTIVE CAMERA</span><h2>{activeDevice.name}</h2></div><span className={`status-pill ${streamState === 'live' ? 'is-live' : ''}`}><i /> {streamState === 'live' ? 'LIVE' : streamState === 'connecting' ? 'CONNECTING' : 'STANDBY'}</span></div>
            <div className={`video-frame ${streamState === 'live' ? 'streaming' : ''}`}>
              {streamState === 'live' && <><span className="rec-dot" /><span className="elapsed">{time}</span><div className="screen-glow" /><div className="meter"><span>VOLT</span><strong>24.8</strong><small>V</small><i /><b>OUTPUT STABLE</b></div><div className="focus-corners" /></>}
              {streamState === 'connecting' && <div className="connecting"><span className="spinner" />Connecting to camera…</div>}
              {streamState === 'idle' && <div className="empty-view"><span className="camera-large">⌁</span><h3>Camera is standing by</h3><p>Start a live view when you need to check the dashboard.</p></div>}
            </div>
            <div className="viewer-actions">
              <span>{streamState === 'live' ? 'Live feed from your home Wi-Fi' : 'No camera connection active'}</span>
              {streamState === 'live' ? <button className="stop-button" onClick={stopStream}><i /> End live view</button> : <button className="start-button" onClick={startStream} disabled={streamState === 'connecting'}>{streamState === 'connecting' ? 'Connecting…' : 'Start live view'} <span>→</span></button>}
            </div>
          </section>
        </div>

        <section className="how-it-works">
          <div><span className="label">HOW IT WORKS</span><h2>One tap to check in.</h2></div>
          <ol><li><span>1</span><p><strong>Your spare phone waits.</strong>It stays pointed at the device display.</p></li><li><span>2</span><p><strong>You request a view.</strong>The camera wakes and connects through Wi-Fi.</p></li><li><span>3</span><p><strong>You see the reading.</strong>Check the live display, then end the session.</p></li></ol>
        </section>
      </section>
      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}
    </main>
  )
}

export default App
