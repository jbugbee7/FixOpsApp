
import { useState, useEffect } from 'react';

interface AnimatedRepairBotProps {
  className?: string;
}

const AnimatedRepairBot = ({ className }: AnimatedRepairBotProps) => {
  const [wrenchAngle, setWrenchAngle] = useState(0);
  const [sparkVisible, setSparkVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWrenchAngle(prev => prev === 0 ? -15 : 0);
      setSparkVisible(prev => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Robot Body */}
        <rect
          x="30"
          y="40"
          width="40"
          height="35"
          rx="4"
          className="fill-blue-500 stroke-blue-600 stroke-2"
        />
        
        {/* Robot Head */}
        <rect
          x="35"
          y="20"
          width="30"
          height="25"
          rx="3"
          className="fill-blue-400 stroke-blue-500 stroke-2"
        />
        
        {/* Robot Eyes */}
        <circle cx="42" cy="30" r="2.5" className="fill-white" />
        <circle cx="58" cy="30" r="2.5" className="fill-white" />
        <circle cx="42" cy="30" r="1" className="fill-blue-800 animate-pulse" />
        <circle cx="58" cy="30" r="1" className="fill-blue-800 animate-pulse" />
        
        {/* Robot Mouth - Happy expression */}
        <path d="M 45 37 Q 50 40 55 37" className="stroke-blue-800 stroke-2 fill-none" />
        
        {/* Left Arm - Static */}
        <rect
          x="20"
          y="45"
          width="8"
          height="20"
          rx="4"
          className="fill-blue-400 stroke-blue-500 stroke-2"
        />
        
        {/* Right Arm - Animated with wrench */}
        <g transform={`rotate(${wrenchAngle} 78 55)`}>
          <rect
            x="72"
            y="45"
            width="8"
            height="20"
            rx="4"
            className="fill-blue-400 stroke-blue-500 stroke-2"
          />
          
          {/* Wrench in hand */}
          <g transform="translate(76, 65)">
            <rect
              x="-1"
              y="0"
              width="2"
              height="12"
              className="fill-gray-600"
            />
            <rect
              x="-3"
              y="10"
              width="6"
              height="4"
              rx="1"
              className="fill-gray-600"
            />
          </g>
        </g>
        
        {/* Robot Legs */}
        <rect
          x="38"
          y="75"
          width="6"
          height="15"
          rx="3"
          className="fill-blue-400 stroke-blue-500 stroke-2"
        />
        <rect
          x="56"
          y="75"
          width="6"
          height="15"
          rx="3"
          className="fill-blue-400 stroke-blue-500 stroke-2"
        />
        
        {/* Gear being fixed */}
        <g transform="translate(85, 35)">
          <circle
            cx="0"
            cy="0"
            r="6"
            className="fill-gray-400 stroke-gray-600 stroke-1"
          />
          {/* Gear teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <rect
              key={index}
              x="-0.5"
              y="-8"
              width="1"
              height="3"
              className="fill-gray-600"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="2" className="fill-gray-600" />
        </g>
        
        {/* Sparks Animation */}
        {sparkVisible && (
          <g>
            <circle cx="82" cy="32" r="1" className="fill-yellow-400 animate-ping" />
            <circle cx="88" cy="38" r="0.5" className="fill-orange-400 animate-ping" style={{ animationDelay: '0.1s' }} />
            <circle cx="80" cy="40" r="0.5" className="fill-yellow-300 animate-ping" style={{ animationDelay: '0.2s' }} />
          </g>
        )}
        
        {/* Robot Antenna */}
        <line x1="50" y1="20" x2="50" y2="15" className="stroke-blue-600 stroke-2" />
        <circle cx="50" cy="13" r="2" className="fill-blue-500 animate-pulse" />
        
        {/* Tool box */}
        <rect
          x="10"
          y="80"
          width="15"
          height="8"
          rx="1"
          className="fill-gray-500 stroke-gray-600 stroke-1"
        />
        <rect
          x="12"
          y="78"
          width="11"
          height="2"
          className="fill-gray-600"
        />
      </svg>
    </div>
  );
};

export default AnimatedRepairBot;
