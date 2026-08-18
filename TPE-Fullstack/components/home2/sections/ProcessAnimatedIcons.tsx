import React from "react";

type ProcessAnimatedIconProps = {
  id: string;
};

export function ProcessAnimatedIcon({ id }: ProcessAnimatedIconProps) {
  switch (id) {
    case "no-die-plate":
      return (
        <div className="home2-picon home2-picon--die">
          <div className="home2-picon__glow" />
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="home2-picon__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Die Plate Frame */}
            <rect
              x="6"
              y="6"
              width="36"
              height="36"
              rx="8"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="home2-picon__stroke-dash"
            />
            {/* Inner Shield / Stamp */}
            <path
              d="M24 12L34 16.5V25C34 31 29.5 36.5 24 38C18.5 36.5 14 31 14 25V16.5L24 12Z"
              fill="rgba(52, 173, 120, 0.15)"
              stroke="#34ad78"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Zero fee text / Check mark */}
            <path
              d="M19 25L22.5 28.5L29.5 20.5"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="home2-picon__check"
            />
            {/* Sparkle */}
            <circle cx="36" cy="12" r="2" fill="#34ad78" className="home2-picon__sparkle" />
          </svg>
        </div>
      );

    case "offset-printing":
      return (
        <div className="home2-picon home2-picon--print">
          <div className="home2-picon__glow" />
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="home2-picon__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Printer Top Roller */}
            <rect
              x="10"
              y="8"
              width="28"
              height="8"
              rx="4"
              stroke="#34ad78"
              strokeWidth="2"
              fill="rgba(52, 173, 120, 0.2)"
            />
            {/* Printer Body */}
            <rect
              x="6"
              y="16"
              width="36"
              height="18"
              rx="5"
              stroke="currentColor"
              strokeWidth="2"
              fill="rgba(20, 26, 34, 0.8)"
            />
            {/* Color CMYK dots */}
            <circle cx="12" cy="22" r="1.8" fill="#00E5FF" />
            <circle cx="17" cy="22" r="1.8" fill="#FF4081" />
            <circle cx="22" cy="22" r="1.8" fill="#FFD600" />
            <circle cx="27" cy="22" r="1.8" fill="#34ad78" />
            {/* Laser Print Sheet Scanning Out */}
            <g className="home2-picon__sheet">
              <path
                d="M12 28H36V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V28Z"
                fill="rgba(52, 173, 120, 0.25)"
                stroke="#34ad78"
                strokeWidth="2"
              />
              <line x1="16" y1="33" x2="32" y2="33" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="16" y1="37" x2="26" y2="37" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    case "turnaround":
      return (
        <div className="home2-picon home2-picon--clock">
          <div className="home2-picon__glow" />
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="home2-picon__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stopwatch Outer Ring */}
            <circle
              cx="24"
              cy="26"
              r="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="rgba(52, 173, 120, 0.08)"
            />
            {/* Stopwatch Top Button */}
            <path d="M22 6H26V10H22V6Z" fill="#34ad78" />
            <path d="M34 11L36.5 13.5" stroke="#34ad78" strokeWidth="2" strokeLinecap="round" />
            {/* Clock Ticks */}
            <line x1="24" y1="14" x2="24" y2="16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="34" y1="26" x2="36" y2="26" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="36" x2="24" y2="38" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="26" x2="14" y2="26" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            {/* Rotating Needle */}
            <g className="home2-picon__needle">
              <line
                x1="24"
                y1="26"
                x2="24"
                y2="17"
                stroke="#34ad78"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="24" cy="26" r="3" fill="#ffffff" />
            </g>
            {/* Lightning bolt badge */}
            <path
              d="M36 28L32 35H36L34 42L41 33H37L39 28H36Z"
              fill="#FFD600"
              className="home2-picon__flash"
            />
          </svg>
        </div>
      );

    case "moq":
      return (
        <div className="home2-picon home2-picon--box">
          <div className="home2-picon__glow" />
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="home2-picon__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 3D Isometric Box Stack */}
            <g className="home2-picon__box-main">
              <path
                d="M24 10L38 18V32L24 40L10 32V18L24 10Z"
                fill="rgba(52, 173, 120, 0.12)"
                stroke="#34ad78"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M24 10L38 18L24 26L10 18L24 10Z"
                fill="rgba(52, 173, 120, 0.35)"
                stroke="#34ad78"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <line x1="24" y1="26" x2="24" y2="40" stroke="#34ad78" strokeWidth="2" />
              {/* Box Flap highlight */}
              <path
                d="M24 10L31 6L38 10"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="home2-picon__flap"
              />
            </g>
            {/* Badge "100" */}
            <rect
              x="26"
              y="26"
              width="18"
              height="11"
              rx="4"
              fill="#34ad78"
              className="home2-picon__num-badge"
            />
            <text
              x="35"
              y="34.5"
              fill="#ffffff"
              fontSize="7.5"
              fontWeight="800"
              textAnchor="middle"
              className="home2-picon__badge-text"
            >
              100+
            </text>
          </svg>
        </div>
      );

    case "style":
      return (
        <div className="home2-picon home2-picon--style">
          <div className="home2-picon__glow" />
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="home2-picon__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Geometric Multi-Shape Style Transformer */}
            <g className="home2-picon__shape-rotate">
              <rect
                x="14"
                y="14"
                width="20"
                height="20"
                rx="4"
                stroke="#4f8fe8"
                strokeWidth="2"
                fill="rgba(79, 143, 232, 0.15)"
              />
              <circle
                cx="24"
                cy="24"
                r="10"
                stroke="#34ad78"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            </g>
            {/* Sparkles on corners */}
            <path
              d="M10 12L12 8L14 12L18 14L14 16L12 20L10 16L6 14L10 12Z"
              fill="#FFD600"
              className="home2-picon__sparkle-a"
            />
            <circle cx="38" cy="36" r="2.5" fill="#4f8fe8" className="home2-picon__sparkle-b" />
          </svg>
        </div>
      );

    case "competitive-price":
      return (
        <div className="home2-picon home2-picon--price">
          <div className="home2-picon__glow" />
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="home2-picon__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Price Tag Outline */}
            <g className="home2-picon__tag-bounce">
              <path
                d="M12 24L26 10H38V22L24 36L12 24Z"
                fill="rgba(52, 173, 120, 0.18)"
                stroke="#34ad78"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="33" cy="15" r="2.5" fill="#ffffff" />
              {/* Dollar / Percent Symbol */}
              <text
                x="23"
                y="27"
                fill="#ffffff"
                fontSize="11"
                fontWeight="800"
                textAnchor="middle"
                className="home2-picon__curr"
              >
                $
              </text>
            </g>
            {/* Downward trend / best price arrow */}
            <path
              d="M32 30L38 36M38 36L33 36M38 36L38 31"
              stroke="#00E5FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="home2-picon__arrow-down"
            />
          </svg>
        </div>
      );

    case "design-support":
      return (
        <div className="home2-picon home2-picon--design">
          <div className="home2-picon__glow" />
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="home2-picon__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Vector Pen Drawing Bezier Curve */}
            <path
              d="M8 38C14 26 24 36 38 18"
              stroke="#34ad78"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="2 3"
              className="home2-picon__bezier"
            />
            {/* Bezier Nodes */}
            <circle cx="8" cy="38" r="3" fill="#ffffff" stroke="#34ad78" strokeWidth="1.5" />
            <circle cx="38" cy="18" r="3" fill="#ffffff" stroke="#34ad78" strokeWidth="1.5" />
            {/* Digital Stylus Pen */}
            <g className="home2-picon__pen">
              <path
                d="M26 14L32 8L40 16L34 22L26 14Z"
                fill="#34ad78"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M26 14L20 20L24 24L30 18L26 14Z" fill="#1f9a66" />
              <path d="M20 20L15 25L20 26L24 24L20 20Z" fill="#fff" />
              <circle cx="15" cy="25" r="1.5" fill="#FFD600" />
            </g>
          </svg>
        </div>
      );

    case "free-shipping":
      return (
        <div className="home2-picon home2-picon--shipping">
          <div className="home2-picon__glow" />
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="home2-picon__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Speed Wind Lines */}
            <g className="home2-picon__wind">
              <line x1="4" y1="20" x2="10" y2="20" stroke="#34ad78" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="26" x2="8" y2="26" stroke="#34ad78" strokeWidth="2" strokeLinecap="round" />
              <line x1="5" y1="32" x2="11" y2="32" stroke="#34ad78" strokeWidth="2" strokeLinecap="round" />
            </g>
            {/* Cargo Delivery Truck */}
            <g className="home2-picon__truck">
              <path
                d="M12 16H28V32H12V16Z"
                fill="rgba(52, 173, 120, 0.25)"
                stroke="#34ad78"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M28 20H36L41 26V32H28V20Z"
                fill="rgba(255, 255, 255, 0.15)"
                stroke="#34ad78"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="18" cy="34" r="3.5" fill="#ffffff" stroke="#34ad78" strokeWidth="2" className="home2-picon__wheel" />
              <circle cx="35" cy="34" r="3.5" fill="#ffffff" stroke="#34ad78" strokeWidth="2" className="home2-picon__wheel" />
            </g>
            {/* Free Tag badge */}
            <rect x="14" y="19" width="10" height="6" rx="2" fill="#34ad78" />
            <text x="19" y="24" fill="#fff" fontSize="4.5" fontWeight="800" textAnchor="middle">
              FREE
            </text>
          </svg>
        </div>
      );

    default:
      return null;
  }
}
