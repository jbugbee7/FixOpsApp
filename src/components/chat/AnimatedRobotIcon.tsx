
interface AnimatedRobotIconProps {
  className?: string;
}

const AnimatedRobotIcon = ({ className }: AnimatedRobotIconProps) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 64 64"
      className="w-full h-full animate-pulse"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot Head */}
      <rect
        x="16"
        y="12"
        width="32"
        height="24"
        rx="4"
        className="fill-blue-500 stroke-blue-600 stroke-2"
      />
      
      {/* Robot Eyes */}
      <circle cx="24" cy="22" r="3" className="fill-white animate-bounce" style={{ animationDelay: '0s' }} />
      <circle cx="40" cy="22" r="3" className="fill-white animate-bounce" style={{ animationDelay: '0.1s' }} />
      <circle cx="24" cy="22" r="1.5" className="fill-blue-800" />
      <circle cx="40" cy="22" r="1.5" className="fill-blue-800" />
      
      {/* Robot Mouth */}
      <rect x="28" y="28" width="8" height="2" rx="1" className="fill-blue-800" />
      
      {/* Robot Body */}
      <rect
        x="20"
        y="36"
        width="24"
        height="20"
        rx="2"
        className="fill-blue-400 stroke-blue-500 stroke-2"
      />
      
      {/* Robot Arms */}
      <rect
        x="12"
        y="40"
        width="6"
        height="12"
        rx="3"
        className="fill-blue-400 stroke-blue-500 stroke-2 animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <rect
        x="46"
        y="40"
        width="6"
        height="12"
        rx="3"
        className="fill-blue-400 stroke-blue-500 stroke-2 animate-pulse"
        style={{ animationDelay: '0.7s' }}
      />
      
      {/* Robot Antenna */}
      <line x1="32" y1="12" x2="32" y2="8" className="stroke-blue-600 stroke-2" />
      <circle cx="32" cy="6" r="2" className="fill-blue-500 animate-ping" />
    </svg>
  </div>
);

export default AnimatedRobotIcon;
