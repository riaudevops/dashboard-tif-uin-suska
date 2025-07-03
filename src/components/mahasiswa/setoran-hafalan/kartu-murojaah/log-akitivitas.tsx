import { useMemo } from "react";

// --- Helper Functions & Components ---
interface LogDataProps {
  id: number;
  keterangan: string;
  ip: string;
  aksi: string;
  user_agent: string;
  timestamp: string;
  dosen_yang_mengesahkan: {
    nama: string;
    email: string;
  };
}

// Icon for the card header
const ActionIcon = ({ aksi }: { aksi: string }) => {
  if (aksi === "VALIDASI") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-green-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

// Icon for the timeline anchor point
const DotIcon = ({ aksi }: { aksi: string }) => {
  if (aksi === "VALIDASI") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

// Lucide Icons
const NetworkIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
    <path d="M12 12V8" />
  </svg>
);
const LaptopIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.28 20H3.72a1 1 0 0 1-.98-1.45L4 16Z" />
  </svg>
);
const SmartphoneIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);
const ServerIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
    <line x1="6" x2="6.01" y1="6" y2="6" />
    <line x1="6" x2="6.01" y1="18" y2="18" />
  </svg>
);

// Other specific icons
const DeviceIcon = ({ Icon }: { Icon: any }) => <Icon className="h-4 w-4" />;
const PostmanIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.5 13.25c.96 0 1.75.79 1.75 1.75s-.79 1.75-1.75 1.75-1.75-.79-1.75-1.75.79-1.75 1.75-1.75m-3.5-3.5c.96 0 1.75.79 1.75 1.75s-.79 1.75-1.75 1.75-1.75-.79-1.75-1.75.79-1.75 1.75-1.75m-5.25 1.75c0 .96.79 1.75 1.75 1.75s1.75-.79 1.75-1.75-.79-1.75-1.75-1.75-1.75.79-1.75 1.75m-5.25-1.75c.96 0 1.75.79 1.75 1.75s-.79 1.75-1.75 1.75S3 12.46 3 11.5s.79-1.75 1.75-1.75m1.75 7c.96 0 1.75.79 1.75 1.75s-.79 1.75-1.75 1.75-1.75-.79-1.75-1.75.79-1.75 1.75-1.75m3.5 3.5c.96 0 1.75.79 1.75 1.75s-.79 1.75-1.75 1.75-1.75-.79-1.75-1.75.79-1.75 1.75-1.75M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2Z" />
  </svg>
);

// Function to format timestamp
const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
  });
};

// Function to parse user agent for display
const parseUserAgent = (userAgent: string) => {
  if (userAgent.includes("PostmanRuntime"))
    return { name: "Postman", Icon: PostmanIcon };
  if (userAgent.includes("Android"))
    return { name: "Android", Icon: SmartphoneIcon };
  if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
    return { name: "iOS Device", Icon: SmartphoneIcon };
  if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS X"))
    return { name: "macOS", Icon: LaptopIcon };
  if (
    userAgent.includes("Linux") ||
    userAgent.includes("Ubuntu") ||
    userAgent.includes("Debian")
  )
    return { name: "Linux", Icon: ServerIcon };
  if (userAgent.includes("Windows"))
    return { name: "Windows PC", Icon: LaptopIcon };
  return { name: "Desktop", Icon: LaptopIcon };
};

// A single timeline item component
// A single timeline item component
const TimelineItem = ({ item }: { item: LogDataProps }) => {
  // Determine styles based on action
  const actionDetails = useMemo(() => {
    const device = parseUserAgent(item.user_agent);
    if (item.aksi === "VALIDASI") {
      return {
        device,
        borderColor: "dark:border-green-500/50 border-green-500/30",
        bgColor: "bg-green-500",
        gradientConnector: "from-green-500/70",
        gradientFrom:
          "from-green-400/20 via-teal-500/20 to-cyan-500/20 dark:from-green-400/50 dark:via-teal-500/50 dark:to-cyan-500/50",
        badgeBg: "bg-gradient-to-r from-green-500 to-emerald-600",
        badgeText: "text-green-100 font-bold",
      };
    }
    return {
      device,
      borderColor: "dark:border-red-500/50 border-red-500/30",
      bgColor: "bg-red-500",
      gradientConnector: "from-red-500/70",
      gradientFrom:
        "from-red-500/20 via-orange-500/20 to-amber-500/20 dark:from-red-500/50 dark:via-orange-500/50 dark:to-amber-500/50",
      badgeBg: "bg-gradient-to-r from-red-500 to-rose-600",
      badgeText: "text-red-100 font-bold",
    };
  }, [item.aksi, item.user_agent]);

  return (
    <div className="relative pl-16 md:pl-20 pb-10">
      {/* The anchor point with a slightly smaller pulsing effect */}
      <div
        className={`absolute left-[20px] md:left-[24px] top-5 -translate-x-1/2 z-20 flex items-center justify-center`}
      >
        <span
          className={`absolute inline-flex h-7 w-7 rounded-full ${actionDetails.bgColor} opacity-75 animate-ping`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-7 w-7 ${actionDetails.bgColor} items-center justify-center shadow-lg`}
        >
          <DotIcon aksi={item.aksi} />
        </span>
      </div>

      <div
        className={`absolute left-7 md:left-8 top-9 h-px w-9 md:w-12 bg-gradient-to-r ${actionDetails.gradientConnector} to-transparent z-10`}
      ></div>

			<div
				className={`relative z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border ${actionDetails.borderColor} rounded-2xl shadow-lg dark:shadow-black/20 overflow-hidden transition-all duration-300 hover:bg-white dark:hover:bg-gray-700/60 hover:shadow-2xl`}
			>
				<div className={`p-4 bg-gradient-to-r ${actionDetails.gradientFrom}`}>
					<div className="flex items-center justify-between mb-3">
						<span
							className={`px-3 py-1 text-xs md:text-sm ${actionDetails.badgeText} ${actionDetails.badgeBg} rounded-full shadow-lg`}
						>
							{item.aksi}
						</span>
						<div className="ml-5 flex overflow-hidden items-center space-x-2 text-gray-500 dark:text-gray-400">
							<ActionIcon aksi={item.aksi} />
							<span className="truncate font-mono text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">
								ID: {item.id}
							</span>
						</div>
					</div>
					<p className="text-sm md:text-lg text-gray-900 dark:text-gray-100">
						{item.keterangan}
					</p>
				</div>
				<div className="p-4 bg-black/5 dark:bg-black/20">
					<div className="flex items-center space-x-1.5 md:space-x-2 text-gray-500 dark:text-gray-400 mb-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="md:h-4 md:w-4 h-3 w-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="text-[0.65rem] md:text-sm">
							{formatTimestamp(item.timestamp)}
						</span>
					</div>
					<div className="border-t border-black/10 dark:border-white/10 pt-3">
						<p className="text-sm font-medium text-gray-600 dark:text-gray-300">
							Disahkan oleh:
						</p>
						<div className="flex items-center md:space-x-3 space-x-2 mt-2">
							<img
								src={`https://placehold.co/40x40/7c3aed/ffffff?text=${item.dosen_yang_mengesahkan.nama.charAt(
									0
								)}`}
								className="rounded-full md:h-10 md:w-10 h-7 w-7 border-2 border-indigo-500"
								alt="Avatar"
								onError={(e: any) => {
									e.target.onerror = null;
									e.target.src =
										"https://placehold.co/40x40/1f2937/ffffff?text=?";
								}}
							/>
							<div className="overflow-hidden">
								<p className="truncate text-sm md:text-base font-semibold text-gray-900 dark:text-white">
									{item.dosen_yang_mengesahkan.nama}
								</p>
								<p className="truncate text-xs text-gray-500 dark:text-gray-400">
									{item.dosen_yang_mengesahkan.email}
								</p>
							</div>
						</div>
					</div>
					<div className="border-t border-black/10 dark:border-white/10 pt-3 mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-gray-500 dark:text-gray-400 text-xs space-y-2 sm:space-y-0">
						<div className="flex items-center space-x-2">
							<NetworkIcon className="h-3.5 w-3.5" />
							<span className="font-mono">{item.ip}</span>
						</div>
						<div className="relative group flex items-center space-x-2">
							<DeviceIcon Icon={actionDetails.device.Icon} />
							<span>{actionDetails.device.name}</span>
							<div className="absolute bottom-full left-1 sm:left-auto sm:right-0 mb-2 w-max md:max-w-xs max-w-[12rem] p-2 bg-gray-900 text-white md:text-xs text-[0.65rem] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 break-all">
								{item.user_agent}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// --- Main App Component ---
export default function LogAktivitas({ logData }: { logData: LogDataProps[] }) {
  return (
    <div className="bg-transparent">
      <div className="relative max-h-[65vh] overflow-y-auto pr-2 md:pr-4 -mr-2 md:-mr-4 custom-scrollbar">
        <div className="relative">
          {/* The sleek, solid, and modern timeline */}
          <div className="absolute top-0 left-[20px] md:left-[24px] -translate-x-1/2 w-px h-full z-0 bg-gray-300 dark:bg-gray-700"></div>

					{logData?.map((item) => (
						<TimelineItem key={item.id} item={item} />
					))}
				</div>
			</div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(129, 140, 248, 0.5); }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(79, 70, 229, 0.5); }
            `}</style>
    </div>
  );
}
