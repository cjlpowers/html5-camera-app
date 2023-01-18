import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import logo from './logo.svg';
import './App.css';

type DeviceInfo = {
  label: string;
  value: string;
}

let video1Element: HTMLMediaElement;
let selectedDeviceId: string | undefined;

function getVideoInputDevices() {
  return navigator.mediaDevices.enumerateDevices().then(devices => devices.filter(x => x.kind === 'videoinput'));
}

function listDevices() {
  getVideoInputDevices()
    .then(devices => {
      console.table(devices);
      devices.forEach(device => {
        navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: device.deviceId
          }
        })
          .then(mediaStream => mediaStream.getVideoTracks())
          .then(tracks => {
            tracks.forEach(track => {
              const trackCapabilities = track.getCapabilities();
              console.table(trackCapabilities)
            });
          });
      });
    })
}

function startCamera() {
  navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: selectedDeviceId,
    }
  }).then(mediaStream => {
    let streamSettings = mediaStream.getVideoTracks()[0].getSettings();
    console.table(streamSettings);
    video1Element.srcObject = mediaStream;
    video1Element.controls = true;
    video1Element.play();
    video1Element.hidden = false;
  })
}

function stopCamera() {
  video1Element.srcObject = null;
  video1Element.hidden = true;
}

function App() {
  const [devices, setDevices] = useState<DeviceInfo[]>();

  useEffect(() => {
    // locate the video element
    video1Element = document.getElementById("video1") as HTMLMediaElement;
    if (!video1Element) {
      throw new Error("Video element not found on page.")
    }

    // load the devices
    getVideoInputDevices().then(x =>
      setDevices(
        x.map(y => ({
          label: y.label,
          value: y.deviceId,
        })))
    );
  });

  function handleChange(selectedOption: SingleValue<DeviceInfo>) {
    selectedDeviceId = selectedOption?.value;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={listDevices}>
          List Devices
        </button>
        <Select options={devices} onChange={handleChange}
        />
        <button onClick={startCamera}>
          Start Video
        </button>
        <button onClick={stopCamera}>
          Stop Video
        </button>
        <video id="video1"></video>
      </header>
    </div>
  );
}

export default App;
