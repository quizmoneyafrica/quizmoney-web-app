// import Splash from "./components/splashScreen/splash";

import Image from "next/image";

export default function Home() {
  return (
    <main className="relative h-[100dvh] w-full">
      {/* <Splash /> */}
      <img
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWpsM2YzYWdkZ3Z5dm44cmdpbzU0cWVoY21lYmtsZnBjaHB4aXQ3dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WTO8QA0mX2Cfw5vhkp/giphy.gif"
        alt="Server Upgrade"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="relative z-10 w-full h-full pt-10 bg-black/30 ">
        <div className="w-full max-w-lg mx-auto px-4 text-white space-y-10">
          <Image
            src="/icons/quizmoney-logo-white.svg"
            alt="Quiz Money"
            width={180}
            height={38}
            priority
            className="w-[30%]"
          />

          <div>
            <h1 className="text-2xl font-bold">Migration In Progress..</h1>
            <p>We&apos;re preparing to serve you better.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
