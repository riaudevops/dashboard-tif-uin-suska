import { type FC } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const ConvertToStringTimeFormat = (dateTimeStr: string) => {
  const dateTime = new Date(dateTimeStr);
  return dateTime
    ? dateTime.toLocaleTimeString(
        "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }
      ).replace(".", ":")
    : "Waktu belum ditentukan";
}

interface JadwalSeminar {
  id: string;
  mahasiswa: {
    nama: string;
    nim: string;
    semester: number;
  };
  status_kp: "Baru" | "Lanjut";
  ruangan: string;
  waktu_mulai: string;
  waktu_selesai: string;
  tanggal: string;
  dosen_penguji: string;
  dosen_pembimbing: string;
  instansi: string;
  pembimbing_instansi: string;
  status: "Menunggu" | "Selesai" | "Jadwal_Ulang";
  durasi?: number;
  jam?: string;
  jam_selesai?: string;
}

const ScheduleTableContent: FC<{
  rooms: string[];
  headerSlots: string[];
  currentData: { [key: string]: JadwalSeminar[] };
  activeTab: "semua" | "hari_ini" | "minggu_ini";
  getRowHeight: (room: string) => number;
  roomColumnWidth: number;
  getStatusColor: (status: string) => string;
  handleMouseEnter: (item: JadwalSeminar, event: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  formatHeaderDate: (dateStr: string) => string;
  getSchedulesByDate: (
    roomSchedules: JadwalSeminar[],
    targetDate: string
  ) => JadwalSeminar[];
  getSchedulesByDay: (
    roomSchedules: JadwalSeminar[],
    targetDay: string
  ) => JadwalSeminar[];
  getSchedulesByTime: (
    roomSchedules: JadwalSeminar[],
    targetTime: string
  ) => JadwalSeminar[];
  sortSchedulesByTime: (schedules: JadwalSeminar[]) => JadwalSeminar[];
  isToday: (dateStr: string) => boolean;
  onEdit: (seminar: JadwalSeminar) => void;
}> = ({
  rooms,
  headerSlots,
  currentData,
  activeTab,
  getRowHeight,
  roomColumnWidth,
  getStatusColor,
  handleMouseEnter,
  handleMouseLeave,
  formatHeaderDate,
  getSchedulesByDate,
  getSchedulesByDay,
  sortSchedulesByTime,
  isToday,
  onEdit,
}) => {
  // Calculate the minimum height for a row with no schedules (based on one card's height)
  const baseCardHeight = 60; // Approximate height of one card in pixels

  // Enhanced dark mode status colors
  const getDarkModeStatusColor = (status: string) => {
    const baseColors = getStatusColor(status);

    // Subtle border colors for better appearance
    if (baseColors.includes("yellow")) {
      return "border-yellow-200 bg-yellow-50 dark:border-yellow-600/50 dark:bg-yellow-900/20 dark:text-yellow-100";
    }
    if (baseColors.includes("green")) {
      return "border-green-200 bg-green-50 dark:border-green-600/50 dark:bg-green-900/20 dark:text-green-100";
    }
    if (baseColors.includes("red")) {
      return "border-red-200 bg-red-50 dark:border-red-600/50 dark:bg-red-900/20 dark:text-red-100";
    }
    if (baseColors.includes("blue")) {
      return "border-blue-200 bg-blue-50 dark:border-blue-600/50 dark:bg-blue-900/20 dark:text-blue-100";
    }

    // Default subtle colors
    return "border-gray-200 bg-gray-50 dark:border-gray-600/50 dark:bg-gray-800/30 dark:text-gray-100";
  };

  // Function to format date for "minggu_ini" tab
  const formatDateWithYear = (dateStr: string) => {
    if (activeTab === "minggu_ini") {
      // Assuming dateStr is in format like "Senin", "Selasa", etc.
      const today = new Date();
      const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const dayIndex = dayNames.indexOf(dateStr);

      if (dayIndex !== -1) {
        // Calculate the date for this day of the current week
        const currentDay = today.getDay();
        const diff = dayIndex - currentDay;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        const options: Intl.DateTimeFormatOptions = {
          day: "numeric",
          month: "short",
          year: "numeric",
        };
        return targetDate.toLocaleDateString("id-ID", options);
      }
    }
    return "";
  };

  // Function to check if a day is today for "minggu_ini" tab
  const isDayToday = (dayStr: string) => {
    if (activeTab === "minggu_ini") {
      const today = new Date();
      const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const todayDayName = dayNames[today.getDay()];
      return dayStr === todayDayName;
    }
    return isToday(dayStr);
  };

  // Function to calculate actual row height based on content
  const calculateRowHeight = (room: string) => {
    const roomSchedules = currentData[room] || [];
    if (roomSchedules.length === 0) {
      return baseCardHeight; // Minimum height for empty rooms
    }

    // For "hari_ini" tab, calculate height based on number of overlapping schedules
    if (activeTab === "hari_ini") {
      const cardHeight = 52; // Fixed card height
      const cardVerticalSpacing = 4; // Space between cards vertically
      const containerPadding = 12; // Top and bottom padding

      return Math.max(
        baseCardHeight,
        roomSchedules.length * (cardHeight + cardVerticalSpacing) +
          containerPadding
      );
    }

    // For "semua" tab, calculate height based on maximum schedules in any date slot
    if (activeTab === "semua") {
      let maxSchedulesInSlot = 0;

      headerSlots.forEach((slot) => {
        const scheduleItems = getSchedulesByDate(roomSchedules, slot);
        const schedulesInGrid = Math.ceil(scheduleItems.length / 2); // Since we use grid-cols-2
        maxSchedulesInSlot = Math.max(maxSchedulesInSlot, schedulesInGrid);
      });

      // Calculate height: each row of cards (2 cards per row) needs about 70px
      const cardRowHeight = 70; // Height for one row of cards
      const padding = 16; // Top and bottom padding
      return Math.max(
        baseCardHeight,
        maxSchedulesInSlot * cardRowHeight + padding
      );
    }

    return getRowHeight(room);
  };

  return (
    <Card className="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      {activeTab === "semua" ? (
        <div className="flex">
          <div
            className="flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700"
            style={{ width: `${roomColumnWidth}px` }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                Ruangan
              </span>
            </div>
            {rooms.map((room) => {
              // const roomSchedules = currentData[room] || [];
              const rowHeight = calculateRowHeight(room);
              return (
                <div
                  key={room}
                  className="flex items-center justify-center border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  style={{
                    height: `${rowHeight}px`,
                  }}
                >
                  <div className="p-2 flex flex-col justify-center text-center">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap">
                      {room}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex-1 overflow-x-auto">
            <div
              className="flex flex-col"
              style={{
                width: "100%",
                minWidth: "100%",
              }}
            >
              <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {headerSlots.map((slot) => (
                  <div
                    key={slot}
                    className={`flex-1 p-4 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 relative transition-colors duration-200 ${
                      isDayToday(slot)
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {formatHeaderDate(slot)}
                    </span>
                    {isDayToday(slot) && (
                      <div className="absolute top-0 right-2">
                        <span className="inline-flex items-center px-1 py-1 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                      </div>
                    )}
                  </div>
                ))}
                {headerSlots.length === 0 && (
                  <div className="flex-1 p-4 text-center border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"></div>
                )}
              </div>
              {rooms.map((room) => {
                const roomSchedules = currentData[room] || [];
                const rowHeight = calculateRowHeight(room);
                return (
                  <div
                    key={room}
                    className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    style={{
                      height: `${rowHeight}px`,
                    }}
                  >
                    {headerSlots.map((slot) => {
                      const scheduleItems = sortSchedulesByTime(
                        getSchedulesByDate(roomSchedules, slot)
                      );
                      return (
                        <div
                          key={slot}
                          className="flex-1 border-r border-gray-200 dark:border-gray-700 last:border-r-0 p-2 flex items-center justify-center"
                        >
                          <div className="grid grid-cols-2 gap-2 items-center justify-items-center w-full">
                            {scheduleItems.map((item) => (
                              <div
                                key={item.id}
                                className={`rounded-lg border-2 ${getDarkModeStatusColor(
                                  item.status
                                )} flex flex-col p-2 cursor-pointer text-xs overflow-hidden w-full transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/50`}
                                onClick={() => onEdit(item)}
                                onMouseEnter={(e) => handleMouseEnter(item, e)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                  maxWidth: "100%",
                                  height: "fit-content",
                                  transition: "transform 0.2s, box-shadow 0.2s",
                                  transform: "scale(1)",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform =
                                    "scale(0.97)";
                                  e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(0, 0, 0, 0.15)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = "scale(1)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                <div className="flex items-start mb-1">
                                  <span className="font-semibold text-xs leading-tight truncate text-gray-800 dark:text-gray-100">
                                    {item.mahasiswa.nama}
                                  </span>
                                </div>
                                <div className="flex items-center whitespace-nowrap">
                                  <span className="text-xs truncate text-gray-600 dark:text-gray-200">
                                    {ConvertToStringTimeFormat(item.waktu_mulai)} - {ConvertToStringTimeFormat(item.waktu_selesai)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {headerSlots.length === 0 && (
                      <div className="flex-1 border-r border-gray-200 dark:border-gray-700 last:border-r-0 p-2"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div
                className="flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                style={{ width: `${roomColumnWidth}px` }}
              >
                <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  Ruangan
                </span>
              </div>
              <div className="flex-1 relative">
                <div className="flex items-center">
                  {headerSlots.map((slot) => (
                    <div
                      key={slot}
                      className={`flex-1 p-4 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 relative transition-colors duration-200 ${
                        isDayToday(slot)
                          ? "bg-blue-100 dark:bg-blue-900/50"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {formatHeaderDate(slot)}
                        </span>
                        {activeTab === "minggu_ini" && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDateWithYear(slot)}
                          </span>
                        )}
                      </div>
                      {isDayToday(slot) && (
                        <div className="absolute top-0 right-2">
                          <span className="inline-flex items-center px-1 py-1 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {headerSlots.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-500" />
                <p>Tidak ada jadwal seminar yang tersedia</p>
              </div>
            )}
            {headerSlots.length > 0 &&
              rooms.map((room) => {
                const roomSchedules = currentData[room] || [];
                return (
                  <div
                    key={room}
                    className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    style={{
                      minHeight: `${baseCardHeight}px`, // Set minimum height for rows with no schedules
                    }}
                  >
                    <div
                      className="flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center"
                      style={{ width: `${roomColumnWidth}px` }}
                    >
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap text-center">
                        {room}
                      </div>
                    </div>
                    <div className="flex-1 relative bg-white dark:bg-gray-900">
                      {activeTab === "hari_ini" ? (
                        <div className="absolute inset-0">
                          {/* Background grid lines - positioned to match header exactly */}
                          <div className="absolute inset-0 flex">
                            {headerSlots.map((slot, index) => (
                              <div
                                key={slot}
                                className="flex-1 relative"
                                style={{
                                  borderRight:
                                    index < headerSlots.length - 1
                                      ? "1px solid rgb(229, 231, 235)"
                                      : "none",
                                }}
                              >
                                {/* Sub-grid lines for hour divisions */}
                                <div className="absolute inset-0 grid grid-cols-4">
                                  {[0, 1, 2, 3].map((subCol) => (
                                    <div
                                      key={subCol}
                                      className={`${
                                        subCol < 3
                                          ? "border-r border-gray-100 dark:border-gray-700"
                                          : ""
                                      }`}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Schedule items positioned on top of grid */}
                          <div className="absolute inset-0">
                            {sortSchedulesByTime(roomSchedules).map(
                              (item, itemIndex) => {
                                const [startHour, startMinute] =
                                  ConvertToStringTimeFormat(item.waktu_mulai).split(":").map(Number);
                                const [endHour, endMinute] = ConvertToStringTimeFormat(item.waktu_selesai)
                                  .split(":")
                                  .map(Number);
                                const firstDisplayHour = Number.parseInt(
                                  headerSlots[0]?.split(":")[0] || "8"
                                );
                                const lastDisplayHour = Number.parseInt(
                                  headerSlots[headerSlots.length - 1]?.split(
                                    ":"
                                  )[0] || "17"
                                );
                                if (
                                  startHour < firstDisplayHour ||
                                  startHour > lastDisplayHour
                                )
                                  return null;
                                const startMinutesFromFirst =
                                  (startHour - firstDisplayHour) * 60 +
                                  startMinute;
                                const endMinutesFromFirst =
                                  (endHour - firstDisplayHour) * 60 + endMinute;
                                const durationMinutes =
                                  endMinutesFromFirst - startMinutesFromFirst;
                                const totalDisplayMinutes =
                                  (lastDisplayHour - firstDisplayHour + 1) * 60;
                                const startPositionPercent =
                                  (startMinutesFromFirst /
                                    totalDisplayMinutes) *
                                  100;
                                const widthPercent =
                                  (durationMinutes / totalDisplayMinutes) * 100;

                                // Calculate proper spacing and positioning
                                const cardSpacing = 6; // Space from edges
                                const cardHeight = 52; // Fixed card height
                                const cardVerticalSpacing = 4; // Space between cards vertically

                                return (
                                  <div
                                    key={item.id}
                                    className={`absolute rounded-lg border-2 ${getDarkModeStatusColor(
                                      item.status
                                    )} flex flex-col items-center justify-center p-2 cursor-pointer text-xs overflow-hidden shadow-sm dark:shadow-gray-900/30 transition-all duration-200`}
                                    style={{
                                      left: `calc(${startPositionPercent}% + ${cardSpacing}px)`,
                                      width: `calc(${Math.max(
                                        widthPercent,
                                        10
                                      )}% - ${cardSpacing * 2}px)`,
                                      top: `${
                                        itemIndex *
                                          (cardHeight + cardVerticalSpacing) +
                                        cardSpacing
                                      }px`,
                                      height: `${cardHeight}px`,
                                      maxHeight: `${cardHeight}px`,
                                      transition:
                                        "transform 0.2s, box-shadow 0.2s",
                                      transform: "scale(1)",
                                      zIndex: 10,
                                    }}
                                    onClick={() => onEdit(item)}
                                    onMouseEnter={(e) =>
                                      handleMouseEnter(item, e)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.transform =
                                        "scale(1.02)";
                                      e.currentTarget.style.boxShadow =
                                        "0 4px 12px rgba(0, 0, 0, 0.15)";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.transform =
                                        "scale(1)";
                                      e.currentTarget.style.boxShadow =
                                        "0 1px 3px rgba(0, 0, 0, 0.1)";
                                    }}
                                  >
                                    <div className="flex items-center justify-center mb-1 w-full overflow-hidden">
                                      <span className="font-semibold text-xs leading-tight truncate text-gray-800 dark:text-gray-100 text-center">
                                        {item.mahasiswa.nama}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-center w-full overflow-hidden">
                                      <span className="text-xs truncate text-gray-600 dark:text-gray-200 text-center">
                                        {ConvertToStringTimeFormat(item.waktu_mulai)} -{" "}
                                        {ConvertToStringTimeFormat(item.waktu_selesai)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full">
                          {headerSlots.map((slot, index) => {
                            const scheduleItems = sortSchedulesByTime(
                              getSchedulesByDay(roomSchedules, slot)
                            );
                            return (
                              <div
                                key={slot}
                                className={`flex-1 p-2 h-full ${
                                  index < headerSlots.length - 1
                                    ? "border-r border-gray-200 dark:border-gray-700"
                                    : ""
                                }`}
                              >
                                <div className="flex flex-col gap-2">
                                  {scheduleItems.map((item) => (
                                    <div
                                      key={item.id}
                                      className={`rounded-lg border-2 ${getDarkModeStatusColor(
                                        item.status
                                      )} flex flex-col items-start p-2 cursor-pointer text-xs overflow-hidden transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/50`}
                                      onClick={() => onEdit(item)}
                                      onMouseEnter={(e) =>
                                        handleMouseEnter(item, e)
                                      }
                                      onMouseLeave={handleMouseLeave}
                                      style={{
                                        transition:
                                          "transform 0.2s, box-shadow 0.2s",
                                        transform: "scale(1)",
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.transform =
                                          "scale(0.97)";
                                        e.currentTarget.style.boxShadow =
                                          "0 4px 12px rgba(0, 0, 0, 0.1)";
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.transform =
                                          "scale(1)";
                                        e.currentTarget.style.boxShadow =
                                          "none";
                                      }}
                                    >
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-xs leading-tight truncate text-gray-800 dark:text-gray-100">
                                          {item.mahasiswa.nama}
                                        </span>
                                      </div>
                                      <div className="flex items-center whitespace-nowrap">
                                        <span className="text-xs truncate text-gray-600 dark:text-gray-200">
                                          {ConvertToStringTimeFormat(item.waktu_mulai)} -{" "}
                                          {ConvertToStringTimeFormat(
                                            item.waktu_selesai
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ScheduleTableContent;
