# GaugeView viewer

The viewer frontend for a local Wi-Fi device-display monitor. It currently uses simulated camera state and meter content so the user interface can be developed without a camera server.

## Run locally

```bash
npm install
npm run dev
```

## Integration boundary

Replace the simulated `startStream` and `stopStream` functions in `src/App.tsx` with requests to the camera-phone service. The viewer needs a device list, a stream URL, and a stream status response.
