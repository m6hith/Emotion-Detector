import React, { useRef, useState } from "react";
import ResultDisplay from "./components/ResultDisplay";

const App = () => {
  const videoRef = useRef(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const startCamera = async () => {
    if (!cameraOn) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } else {
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const captureImage = async () => {
    setLoading(true);
    setResult(null);
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setImage(dataUrl);

    try {
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append("file", blob, "capture.jpg");

      const response = await fetch("https://emotion-detection-backend-drwx.onrender.com/analyze/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Server Error");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold text-white mb-6 text-center drop-shadow-xl">
        Emotion Detection App
      </h1>
      <div className="glassmorphic p-6 w-[95%] max-w-md flex flex-col items-center">
        <video
          ref={videoRef}
          autoPlay
          className="w-full rounded-lg mb-4 shadow-lg"
        />
        <div className="flex gap-4">
          <button
            onClick={startCamera}
            className={`px-4 py-2 rounded font-semibold ${
              cameraOn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition`}
          >
            {cameraOn ? "Stop Camera" : "Start Camera"}
          </button>
          <button
            onClick={captureImage}
            disabled={!cameraOn || loading}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Capture & Analyze"
            )}
          </button>
        </div>
      </div>

      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default App;
