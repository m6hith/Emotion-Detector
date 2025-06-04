// src/components/WebCapture.jsx
import React, { useRef } from "react";
import axios from "axios";

function WebCapture({ setResults, setLoading }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "snapshot.jpg");

      setLoading(true);
      try {
        const response = await axios.post(
          "https://emotion-detection-backend-drwx.onrender.com/analyze/",
          formData
        );
        setResults(response.data);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-md flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        className="rounded-lg w-full h-64 object-cover mb-4"
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-4">
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
        >
          Start Camera
        </button>
        <button
          onClick={captureImage}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
        >
          Capture & Analyze
        </button>
      </div>
    </div>
  );
}

export default WebCapture;
