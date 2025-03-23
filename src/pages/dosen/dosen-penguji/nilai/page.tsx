import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, LayoutGrid, LayoutList } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WelcomeHeader = () => {
  return (
    <div className="bg-[#5A6D5A] rounded-lg p-10 flex justify-between items-center relative overflow-visible mt-10">
      <div className="text-white">
        <h1 className="text-2xl font-semibold mb-2">
          Riwayat Seminar KP Mahasiswa
        </h1>
        <p className="text-sm opacity-90">
          Kamu sudah menguji 9 mahasiswa yang Seminar KP. Segera beri mereka
          nilai seminarnnya, So Lets do it!
        </p>
      </div>
      <div className="absolute -top-[28%] size-48 right-4 ">
        <img
          src="/student.svg"
          alt="Student illustration"
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
};

interface StudentCardProps {
  name: string;
  type: string;
  ruangan: string;
  time: string;
  date: string;
}

const StudentCard: React.FC<StudentCardProps> = ({
  name,
  type,
  ruangan,
  time,
  date,
}) => {
  return (
    <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-900 dark:text-white mb-4">
      <h3 className="font-semibold text-lg mb-2">{name}</h3>
      <div className="text-gray-600 dark:text-gray-300 mb-2">
        {type} | {ruangan} | {time}
      </div>
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
        <CalendarIcon className="w-4 h-4 mr-2" />
        {date}
      </div>
    </div>

    // <Card>
    //   <CardHeader>
    //     <CardTitle className="font-semibold text-lg mb-2">{name}</CardTitle>
    //   </CardHeader>
    //   <CardContent className="text-gray-600 mb-2">
    //     {type} | {ruangan} | {time}
    //   </CardContent>
    //   <CardFooter className="flex items-center text-gray-500 text-sm">
    //     <CalendarIcon className="w-4 h-4 mr-2" />
    //     {date}
    //   </CardFooter>
    // </Card>
  );
};

export default function DosenPengujiNilaiPage() {
  const [isGridView, setIsGridView] = useState(true);

  const students = [
    {
      name: "Muh Zaki Erbai Syas",
      type: "Seminar KP",
      ruangan: "FST.302",
      time: "8.00 WIB",
      date: "13 Februari 2025",
    },
    {
      name: "Abmi Sukma Edri",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "09.00 WIB",
      date: "13 Februari 2025",
    },
    {
      name: "Muhammad Farhan Aulia Pratama",
      type: "Seminar KP",
      ruangan: "FST.301",
      time: "10.00 WIB",
      date: "13 Februari 2025",
    },
    {
      name: "M Nabil Dawami",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "09.00 WIB",
      date: "14 Februari 2025",
    },
    {
      name: "Hafidz Alhadid",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "10.00 WIB",
      date: "14 Februari 2025",
    },
    {
      name: "Muhammad Rafly Wirayudha",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "11.00 WIB",
      date: "17 Februari 2025",
    },
    {
      name: "Gilang Ramadhan Indra",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "09.00 WIB",
      date: "13 Februari 2025",
    },
    {
      name: "Farhan Fadilla",
      type: "Seminar KP",
      ruangan: "FST.304",
      time: "10.00 WIB",
      date: "13 Februari 2025",
    },
    {
      name: "Ahmad Kurniawan",
      type: "Seminar KP",
      ruangan: "FST.304",
      time: "11.00 WIB",
      date: "13 Februari 2025",
    },
  ];

  const ViewToggleButton = () => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsGridView(!isGridView)}
      className="flex items-center gap-2"
    >
      {isGridView ? (
        <>
          <LayoutList size={20} />
          List
        </>
      ) : (
        <>
          <LayoutGrid size={20} />
          Grid
        </>
      )}
    </Button>
  );

  return (
    <>
      <DashboardLayout>
        <WelcomeHeader />
        <div>
          <Tabs defaultValue="belumDinilai" className="w-full">
            <div className="flex justify-between items-center w-full ">
              <TabsList className="grid w-fit grid-cols-2 gap-2">
                <TabsTrigger
                  value="belumDinilai"
                  className="transition-all duration-300 ease-in-out data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-50"
                >
                  Belum Dinilai
                </TabsTrigger>
                <TabsTrigger
                  value="dinilai"
                  className="transition-all duration-300 ease-in-out data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-50"
                >
                  Dinilai
                </TabsTrigger>
              </TabsList>

              <ViewToggleButton />
            </div>
            <TabsContent value="belumDinilai" className="mt-5">
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Daftar Mahasiswa Pasca Seminar KP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`grid gap-4 ${
                      isGridView
                        ? "md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {students.map((student, index) => (
                      <StudentCard key={index} {...student} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <h3>---pagination---</h3>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="dinilai" className="mt-5">
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Daftar Mahasiswa Pasca Seminar KP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`grid gap-4 ${
                      isGridView
                        ? "md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {students.map((student, index) => (
                      <StudentCard key={index} {...student} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end ">
                  <h3 className="">---pagination---</h3>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}
