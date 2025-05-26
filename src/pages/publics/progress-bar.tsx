import { useState, useEffect } from "react";

const ProgressChart = ({ targetProgress}: { targetProgress: number}) => {
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Dummy data - bisa diganti sesuai kebutuhan 
  // Konfigurasi circle
  const radius = 60;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Hitung stroke dash offset berdasarkan progress
  const strokeDashoffset =
    circumference - (currentProgress / 100) * circumference;

  // Simulasi loading dan animasi progress
  useEffect(() => {
    // Simulasi loading
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Animasi progress setelah loading selesai
    const progressTimer = setTimeout(() => {
      if (!loading) {
        const interval = setInterval(() => {
          setCurrentProgress((prev) => {
            if (prev >= targetProgress) {
              clearInterval(interval);
              return targetProgress;
            }
            return prev + 1;
          });
        }, 30);
      }
    }, 1200);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(progressTimer);
    };
  }, [loading, targetProgress]);

  // Skeleton component untuk loading state
 const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`}></div>
);

  return (
    <div className="flex flex-col items-center">
      {/* Progress Chart Section */}
      <div className="relative flex items-center justify-center">
        {loading ? (
          <Skeleton className="w-20 h-20 rounded-full" />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Glowing background effect */}
            <div className="absolute inset-0 rounded-full opacity-70 animate-pulse"></div>
            {/* Background Circle with light gray */}
            <svg
              height={radius * 2}
              width={radius * 2}
              className="drop-shadow-md"
            >
              <defs>
                <linearGradient
                  id="bgGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle
                stroke="url(#bgGradient)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />

              {/* Progress Circle with multi-color gradient */}
              <defs>
                <linearGradient
                  id="progressGradient"
                  gradientUnits="userSpaceOnUse"
                  x1="60"
                  y1="0"
                  x2="80"
                  y2="160"
                >
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="33%" stopColor="#84CC16" />
                  <stop offset="66%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                {/* Add shimmer effect */}
                <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  <animate
                    attributeName="x1"
                    from="-100%"
                    to="100%"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    from="0%"
                    to="200%"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>
              <circle
                stroke="url(#progressGradient)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + " " + circumference}
                style={{
                  strokeDashoffset,
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                  transition: "stroke-dashoffset 1.5s ease-in-out",
                }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                filter="url(#glow)"
              />

              {/* Add shimmer overlay */}
              <circle
                stroke="url(#shimmer)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + " " + circumference}
                style={{
                  strokeDashoffset,
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                opacity="0.5"
              />
            </svg>

            {/* Percentage Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative">
                <span className="text-2xl font-bold text-gray-900">
                  {currentProgress}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
