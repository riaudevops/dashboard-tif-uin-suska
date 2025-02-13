import HeaderLandingPageComponent from "@/components/globals/headers/header-landing-page";
import LoadingComponent from "@/components/globals/loading";
import BlurText from "@/components/react-bits/blur-text";
import SplitText from "@/components/react-bits/split-text";
import { handleGoToDashboard } from "@/utils/pages/publics/landing.page.util";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import TickCircle from "@/assets/svgs/tick-circle";
import Document from "@/assets/svgs/document";
import Chart from "@/assets/svgs/chart";
import Award from "@/assets/svgs/award";
import { useTheme } from "@/components/themes/theme-provider";
import TopRightDark from "@/assets/svgs/top-right-dark";
import TopRightLight from "@/assets/svgs/top-right-light";
import TopLeftDark from "@/assets/svgs/top-left-dark";
import TopLeftLight from "@/assets/svgs/top-left-light";
import BottomLeftDark from "@/assets/svgs/bottom-left-dark";
import BottomLeftLight from "@/assets/svgs/bottom-left-light";
import BottomRightLigth from "@/assets/svgs/bottom-right-light";
import BottomRightDark from "@/assets/svgs/bottom-rigth-dark";
import CircularGallery from "@/components/react-bits/circular-gallery";
import { motion } from "framer-motion";
import AnimatedContent from "@/components/react-bits/animated-content";
import { RetroGrid } from "@/components/magic-ui/retro-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PhoneCall, Mail, MapPin } from "lucide-react";
import DarkLogoUSR from "@/assets/svgs/dark-logo-usr";
import LightLogoUSR from "@/assets/svgs/light-logo-usr";
import Particles from "@/components/react-bits/particles";
import { WarpBackground } from "@/components/magic-ui/warp-background";
import { BentoCard, BentoGrid } from "@/components/magic-ui/bento-grid";
import { HashLink } from "react-router-hash-link";
import CustomGradientText from "@/components/react-bits/custom-gradient-text";
import GradientText from "@/components/react-bits/gradient-text";
import Ballpit from "@/components/react-bits/ballpit";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magic-ui/terminal";

const features = [
  {
    name: "Setoran Hafalan",
    description: "📖 Memudahkan penyetoran hafalan.",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Terminal>
        <TypingAnimation>&gt; tif setoran-hafalan@latest</TypingAnimation>
        <AnimatedSpan delay={1500} className="text-green-500">
          <span>✔ Memeriksa modul.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={2000} className="text-green-500">
          <span>✔ Menginisialisasi modul hafalan.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={2500} className="text-green-500">
          <span>✔ Memuat database surah.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={3000} className="text-green-500">
          <span>✔ Menginstall komponen setoran.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={3500} className="text-green-500">
          <span>✔ Memperbarui komponen setoran.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={4000} className="text-green-500">
          <span>✔ Menyiapkan sistem.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={4500} className="py-2 text-blue-500">
          <span>ℹ Updated 1 file:</span>
          <span className="pl-2">- lib/setoran-hafalan.ts</span>
        </AnimatedSpan>
        <TypingAnimation delay={5000} className="text-yellow-500">
          Alhamdulillah! Sistem siap digunakan.
        </TypingAnimation>
        <TypingAnimation delay={5500} className="text-muted-foreground">
          Silakan mulai setoran hafalan Anda.
        </TypingAnimation>
      </Terminal>
    ),
  },
  {
    name: "Kerja Praktik",
    description: "🧑‍💻 Mengintegrasikan proses pendaftaran kerja praktik.",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Terminal>
        <TypingAnimation>&gt; tif kerja-praktik@latest</TypingAnimation>
        <AnimatedSpan delay={1500} className="text-green-500">
          <span>✔ Memeriksa modul.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={2000} className="text-green-500">
          <span>✔ Menginisialisasi modul kerja praktik.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={2500} className="text-green-500">
          <span>✔ Memuat database kerja praktik.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={3000} className="text-green-500">
          <span>✔ Menginstall komponen kerja praktik.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={3500} className="text-green-500">
          <span>✔ Memperbarui komponen kerja praktik.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={4000} className="text-green-500">
          <span>✔ Menyiapkan sistem.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={4500} className="py-2 text-blue-500">
          <span>ℹ Updated 1 file:</span>
          <span className="pl-2">- lib/kerja-praktik.ts</span>
        </AnimatedSpan>
        <TypingAnimation delay={5000} className="text-yellow-500">
          Success! Sistem siap digunakan.
        </TypingAnimation>
        <TypingAnimation delay={5500} className="text-muted-foreground">
          Silakan mulai kerja praktik Anda.
        </TypingAnimation>
      </Terminal>
    ),
  },
  {
    name: "Seminar",
    description:
      "⏰ Mengintegrasikan proses pendaftaran seminar kerja praktik.",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Terminal>
        <TypingAnimation>&gt; tif seminar@latest</TypingAnimation>
        <AnimatedSpan delay={1500} className="text-green-500">
          <span>✔ Memeriksa modul.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={2000} className="text-green-500">
          <span>✔ Menginisialisasi modul seminar.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={2500} className="text-green-500">
          <span>✔ Menginstall komponen seminar.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={3000} className="text-green-500">
          <span>✔ Menyiapkan sistem.</span>
        </AnimatedSpan>
        <AnimatedSpan delay={3500} className="py-2 text-blue-500">
          <span>ℹ Updated 1 file:</span>
          <span className="pl-2">- lib/seminar.ts</span>
        </AnimatedSpan>
        <TypingAnimation delay={4000} className="text-yellow-500">
          Success! Sistem siap digunakan.
        </TypingAnimation>
        <TypingAnimation delay={4500} className="text-muted-foreground">
          Silakan mulai seminar Anda.
        </TypingAnimation>
      </Terminal>
    ),
  },
  {
    name: "Coming soon...",
    description: "🚀 Nantikan fitur-fitur menarik lainnya.",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Terminal>
        <TypingAnimation>&gt; tif update --all </TypingAnimation>
        <TypingAnimation delay={1500} className="pt-4 text-muted-foreground">
          Up-to-date
        </TypingAnimation>
      </Terminal>
    ),
  },
];

const LandingPage = () => {
  const auth = useAuth();
  const { theme } = useTheme();

  const handleKeycloakAuth = () =>
    auth.isAuthenticated
      ? void auth.signoutRedirect()
      : void auth.signinPopup();

  const [dashboardURL, setDashboardURL] = useState("/");

  useEffect(() => {
    if (auth.isAuthenticated)
      setDashboardURL(handleGoToDashboard({ token: auth.user!.access_token }));
  }, [auth.isAuthenticated]);

  const v1FloatingAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const v2FloatingAnimation = {
    animate: {
      y: [0, 15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="w-screen h-screen">
      {auth.isLoading && (
        <LoadingComponent className="absolute z-50 w-screen h-screen bg-black bg-opacity-60" />
      )}
      <HeaderLandingPageComponent
        isAuthenticated={auth.isAuthenticated}
        onContinueWithKeycloakClicked={handleKeycloakAuth}
        dashboardURL={dashboardURL}
      />
      <div className="w-full h-full">
        <div
          id="beranda"
          className="flex items-center justify-center w-screen h-screen text-center lg:pt-8"
        >
          <RetroGrid />
          <div className="absolute w-full top-0 bg-gradient-to-t from-background to-transparent to-90% dark:from-background pointer-events-none h-[55%]" />
          <div className="relative">
            <motion.div
              className="absolute hidden left-1 lg:-top-32 lg:block"
              animate={v1FloatingAnimation.animate}
            >
              <AnimatedContent
                distance={50}
                direction="horizontal"
                reverse={true}
                config={{ tension: 80, friction: 20 }}
                animateOpacity
                scale={0.5}
                threshold={0.2}
                delay={2500}
              >
                <div className="flex flex-col items-center">
                  {theme === "dark" ? <TopLeftDark /> : <TopLeftLight />}
                  <TickCircle />
                </div>
              </AnimatedContent>
            </motion.div>

            <motion.div
              className="absolute right-0 hidden lg:-top-32 lg:block"
              animate={v2FloatingAnimation.animate}
            >
              <AnimatedContent
                distance={50}
                direction="horizontal"
                reverse={false}
                config={{ tension: 80, friction: 20 }}
                animateOpacity
                scale={0.5}
                threshold={0.2}
                delay={3000}
              >
                <div className="flex flex-col items-center">
                  {theme === "dark" ? <TopRightDark /> : <TopRightLight />}
                  <Document />
                </div>
              </AnimatedContent>
            </motion.div>

            <motion.div
              className="absolute hidden lg:left-24 lg:-bottom-14 lg:block"
              animate={v2FloatingAnimation.animate}
            >
              <AnimatedContent
                distance={50}
                direction="horizontal"
                reverse={true}
                config={{ tension: 80, friction: 20 }}
                animateOpacity
                scale={0.5}
                threshold={0.2}
                delay={3500}
              >
                <div className="flex flex-col items-center">
                  {theme === "dark" ? <BottomLeftDark /> : <BottomLeftLight />}
                  <Chart className="mt-4" />
                </div>
              </AnimatedContent>
            </motion.div>

            <motion.div
              className="absolute hidden lg:right-[88px] lg:-bottom-14 lg:block"
              animate={v1FloatingAnimation.animate}
            >
              <AnimatedContent
                distance={50}
                direction="horizontal"
                reverse={false}
                config={{ tension: 80, friction: 20 }}
                animateOpacity
                scale={0.5}
                threshold={0.2}
                delay={4000}
              >
                <div className="flex flex-col items-center">
                  {theme === "dark" ? (
                    <BottomRightDark />
                  ) : (
                    <BottomRightLigth />
                  )}
                  <Award className="mt-2" />
                </div>
              </AnimatedContent>
            </motion.div>

            <BlurText
              text="App Integrasi Pelayanan Administrasi TIF"
              delay={200}
              animateBy="words"
              direction="top"
              className="mx-auto mb-8 text-5xl font-extrabold md:px-12 lg:px-32 lg:text-7xl md:max-w-7xl "
            />

            <AnimatedContent
              distance={50}
              direction="vertical"
              reverse={false}
              config={{ tension: 80, friction: 20 }}
              animateOpacity
              threshold={0.2}
              delay={1500}
            >
              <SplitText
                text="Mudah, Cepat, Informatif dan Terintegrasi Banyak Layanan Bisa Diselesaikan dalam Satu Waktu."
                className="max-w-2xl px-2 mx-auto mb-8 text-xl font-medium md:text-2xl"
                delay={55}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                threshold={0.2}
                rootMargin="-50px"
              />
            </AnimatedContent>

            <AnimatedContent
              distance={50}
              direction="vertical"
              reverse={false}
              config={{ tension: 80, friction: 20 }}
              animateOpacity
              threshold={0.2}
              delay={3750}
            >
              <div className="flex items-center justify-center transition duration-300 hover:-translate-y-1">
                <CustomGradientText
                  colors={[
                    "#A07CFE",
                    "#FE8FB5",
                    "#FFBE7B",
                    "#A07CFE",
                    "#FE8FB5",
                  ]}
                  animationSpeed={6}
                  showBorder={true}
                  className="px-8 py-4 text-xl"
                  isAuthenticated={auth.isAuthenticated}
                  onContinueWithKeycloakClicked={handleKeycloakAuth}
                  dashboardURL={dashboardURL}
                />
              </div>
            </AnimatedContent>
          </div>
        </div>
        <div
          id="fitur-kami"
          className="flex items-center justify-center w-screen h-auto py-16 text-center"
        >
          <Particles
            particleColors={[
              "#A07CFE",
              "#FE8FB5",
              "#FFBE7B",
              "#40ffaa",
              "#4079ff",
            ]}
            particleCount={250}
            particleSpread={10}
            speed={0.2}
            particleBaseSize={100}
            moveParticlesOnHover={false}
            alphaParticles={false}
            disableRotation={false}
          />
          <div className="relative">
            <BlurText
              text="Fitur Unggulan Kami"
              delay={200}
              animateBy="words"
              direction="top"
              className="max-w-4xl mx-auto mb-12 text-5xl font-extrabold md:mb-16 lg:text-7xl"
            />
            <BentoGrid>
              {features.map((feature, idx) => (
                <BentoCard
                  href={""}
                  cta={""}
                  Icon={"symbol"}
                  key={idx}
                  {...feature}
                />
              ))}
            </BentoGrid>
          </div>
        </div>
        <div
          id="kontributor"
          className="flex flex-col items-center justify-center w-screen h-screen pt-16"
        >
          <Particles
            particleColors={[
              "#A07CFE",
              "#FE8FB5",
              "#FFBE7B",
              "#40ffaa",
              "#4079ff",
            ]}
            particleCount={250}
            particleSpread={10}
            speed={0.2}
            particleBaseSize={100}
            moveParticlesOnHover={false}
            alphaParticles={false}
            disableRotation={false}
          />
          <GradientText
            colors={["#A07CFE", "#FE8FB5", "#FFBE7B", "#A07CFE", "#FE8FB5"]}
            animationSpeed={6}
            showBorder={true}
            className="p-4 text-xl pointer-events-none"
          >
            Presenting
          </GradientText>
          <BlurText
            text="Kontributor"
            delay={200}
            animateBy="words"
            direction="top"
            className="max-w-4xl mx-auto mt-6 mb-8 text-5xl font-extrabold lg:text-7xl"
          />
          <CircularGallery bend={3} textColor="#FFBE7B" borderRadius={0.05} />
          <div className="h-20" />
        </div>
        <WarpBackground id="faqs">
          <div className="flex flex-col items-center justify-center w-screen h-screen text-center">
            <BlurText
              text="Our FAQs."
              delay={200}
              animateBy="words"
              direction="top"
              className="max-w-4xl mx-auto mb-8 text-5xl font-extrabold lg:text-7xl"
            />
            <SplitText
              text="Mudah, Cepat, Informatif dan Terintegrasi Banyak Layanan Bisa Diselesaikan dalam Satu Waktu."
              className="max-w-2xl px-2 mx-auto mb-12 text-xl font-medium text-gray-400 md:mb-16 md:text-2xl"
              delay={50}
              animationFrom={{
                opacity: 0,
                transform: "translate3d(0,50px,0)",
              }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              threshold={0.2}
              rootMargin="-50px"
            />
            <Accordion
              type="single"
              collapsible
              className="w-3/4 space-y-4 lg:w-2/3"
            >
              <AccordionItem
                value="item-1"
                className="px-4 shadow-md rounded-xl bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
              >
                <AccordionTrigger className="text-xl">
                  Is it accessible?
                </AccordionTrigger>
                <AccordionContent className="text-lg">
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-2"
                className="px-4 shadow-md rounded-xl bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
              >
                <AccordionTrigger className="text-xl">
                  Is it styled?
                </AccordionTrigger>
                <AccordionContent className="text-lg">
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-3"
                className="px-4 shadow-md rounded-xl bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
              >
                <AccordionTrigger className="text-xl">
                  Is it animated?
                </AccordionTrigger>
                <AccordionContent className="text-lg">
                  Yes. It's animated by default, but you can disable it if you
                  prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </WarpBackground>
        <footer className="flex flex-col border-t">
          <div className="z-10 px-16 pt-14">
            <div className="grid grid-cols-1 gap-8 text-center md:text-start md:grid-cols-3">
              {/* Logo and Copyright Section */}
              <div className="flex flex-col items-center space-y-4 md:items-start">
                <div className="flex items-center gap-1.5 rounded-xl">
                  {theme === "dark" ? (
                    <DarkLogoUSR className="w-8 h-8" />
                  ) : (
                    <LightLogoUSR className="w-8 h-8" />
                  )}
                  <span className="text-base font-semibold">
                    dashboard
                    <span className="italic font-medium">.tif-usr</span>
                  </span>
                </div>
                <p className="text-sm">
                  Teknik Informatika. 2025. All rights reserved.
                </p>
              </div>

              {/* Pages Section */}
              <div>
                <ul className="space-y-2">
                  <li>
                    <HashLink smooth to="/#beranda">
                      Beranda
                    </HashLink>
                  </li>
                  <li>
                    <HashLink smooth to="/#fitur-kami">
                      Fitur Unggulan Kami
                    </HashLink>
                  </li>
                  <li>
                    <HashLink smooth to="/#kontributor">
                      Kontributor
                    </HashLink>
                  </li>
                  <li>
                    <HashLink smooth to="/#faqs">
                      FAQs
                    </HashLink>
                  </li>
                </ul>
              </div>

              {/* Contact Section */}
              <div>
                <div className="flex flex-col items-center space-y-4 md:items-start">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 " />
                    <span className="">+62878-6868-5950</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 " />
                    <a target="_blank" href="mailto:tif@uin-suska.ac.id">
                      tif@uin-suska.ac.id
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 " />
                    <p className="">Jl. HR. Soebrantas No.155 KM 18</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center gap-4 mt-8 md:justify-end ">
              <a href="#">
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#">
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a target="_blank" href="https://www.instagram.com/tifuinsuska/">
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              overflow: "hidden",
              minHeight: "525px",
              maxHeight: "525px",
              width: "100%",
            }}
          >
            <Ballpit
              count={100}
              gravity={0.7}
              friction={0.8}
              wallBounce={0.95}
              followCursor={true}
              colors={["#A07CFE", "#FE8FB5", "#FFBE7B", "#40ffaa", "#4079ff"]}
            />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
