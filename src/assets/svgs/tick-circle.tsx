import { CommonSVGProps } from "@/interfaces/assets/svgs/common.interface";

const TickCircle = ({ className }: CommonSVGProps) => {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1622_10417)">
        <g filter="url(#filter0_b_1622_10417)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M56.5674 79.8897C74.4219 75.4032 85.2588 57.2923 80.7723 39.4379C76.2858 21.5835 58.175 10.7466 40.3205 15.233C22.4661 19.7195 11.6292 37.8304 16.1157 55.6848C20.6021 73.5393 38.713 84.3761 56.5674 79.8897Z"
            fill="#FF0004"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M56.5674 79.8897C74.4219 75.4032 85.2588 57.2923 80.7723 39.4379C76.2858 21.5835 58.175 10.7466 40.3205 15.233C22.4661 19.7195 11.6292 37.8304 16.1157 55.6848C20.6021 73.5393 38.713 84.3761 56.5674 79.8897Z"
            stroke="url(#paint0_linear_1622_10417)"
            stroke-linecap="round"
          />
        </g>
        <g filter="url(#filter1_d_1622_10417)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M68.3186 43.3404C69.4365 42.53 69.6858 40.9669 68.8754 39.849C68.065 38.7311 66.5018 38.4819 65.384 39.2923L51.7524 49.1744C48.9902 51.1768 47.1319 52.5165 45.6182 53.3155C44.1762 54.0765 43.4113 54.1449 42.7854 54.0093C42.1595 53.8737 41.4914 53.495 40.4936 52.2054C39.4462 50.8517 38.3089 48.8631 36.6229 45.8972L34.4764 42.1211C33.7941 40.9208 32.2679 40.5009 31.0675 41.1832C29.8672 41.8655 29.4473 43.3917 30.1296 44.592L32.3678 48.5294C33.9381 51.292 35.2478 53.5962 36.5391 55.2652C37.9051 57.0306 39.4918 58.4118 41.7269 58.8959C43.962 59.3801 45.978 58.7793 47.9521 57.7373C49.8183 56.7524 51.9641 55.1966 54.5368 53.3315L68.3186 43.3404Z"
            fill="url(#paint1_linear_1622_10417)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_b_1622_10417"
          x="-9.39648"
          y="-10.28"
          width="115.682"
          height="115.683"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="12" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_1622_10417"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_1622_10417"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_1622_10417"
          x="26.8027"
          y="35.8162"
          width="55.5488"
          height="36.2498"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="5" dy="5" />
          <feGaussianBlur stdDeviation="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.176471 0 0 0 0 0.556863 0 0 0 0 0.678431 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1622_10417"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1622_10417"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1622_10417"
          x1="7.99219"
          y1="23.3565"
          x2="88.9203"
          y2="71.7252"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" stop-opacity="0.25" />
          <stop offset="1" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1622_10417"
          x1="44.9871"
          y1="65.0517"
          x2="86.2255"
          y2="25.0309"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" />
          <stop offset="1" stop-color="white" stop-opacity="0.2" />
        </linearGradient>
        <clipPath id="clip0_1622_10417">
          <rect
            width="80"
            height="80"
            fill="white"
            transform="translate(17.8184) rotate(12.222)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TickCircle;
