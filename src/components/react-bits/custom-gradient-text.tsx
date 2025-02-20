import { NavLink } from "react-router-dom";

interface GradientTextProps {
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  onContinueWithKeycloakClicked: () => void;
  isAuthenticated: boolean;
  dashboardURL: string;
}

export default function CustomGradientText({
  className = "",
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 8,
  showBorder = false,
  onContinueWithKeycloakClicked,
  isAuthenticated,
  dashboardURL,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div
      className={`animated-gradient-text ${className}`}
    >
      {showBorder && (
        <div className="gradient-overlay" style={gradientStyle}></div>
      )}
      <div className="text-content" style={gradientStyle}>
        {!isAuthenticated ? (
          <div onClick={onContinueWithKeycloakClicked}>Mulai Sekarang</div>
        ) : (
          <NavLink to={dashboardURL}>
            <div>Pergi Ke Dashboard</div>
          </NavLink>
        )}
      </div>
    </div>
  );
}
