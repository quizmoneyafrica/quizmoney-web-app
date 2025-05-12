// "use client";
// import { ArrowLeftIcon } from "@radix-ui/react-icons";
// import { Flex } from "@radix-ui/themes";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React from "react";

// const steps = [
//   {
//     id: 1,
//     description: "Sign up on Quiz-Money by creating your account.",
//   },
//   {
//     id: 2,
//     description:
//       "Login to see when the next game quiz is going to be taken place and pay an entry fee of ₦100.00.",
//   },
//   {
//     id: 3,
//     description: "Share with your friends to play with them.",
//   },
//   {
//     id: 4,
//     description:
//       "When it time, you will get a notification to start the game by pressing the play button.",
//   },
//   {
//     id: 5,
//     description:
//       "Start playing the game, time allotted for a question is 10secs. Answer each question as fast as you can to get a chance of wining the prize pool.",
//   },
//   {
//     id: 6,
//     description:
//       "The game features a lifeline called erasers, which allows players to correct wrong answers by selecting the option to remove one wrong answer.",
//   },
// ];

// const Page = () => {
//   const router = useRouter();
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.25, ease: "easeInOut" }}
//       className="pb-20"
//     >
//       <Flex direction="column" gap="40px">
//         <div
//           onClick={() => router.back()}
//           className="flex items-center gap-2 font-semibold cursor-pointer"
//         >
//           <ArrowLeftIcon />
//           <p>Back</p>
//         </div>
//         <Flex
//           direction={"column"}
//           gap={"20px"}
//           className=" md:bg-white sm:p-5 lg:p-10 rounded-3xl"
//         >
//           <p className="text-xl md:text-2xl font-bold">How it Works</p>

//           <div className=" shadow-lg shadow-zinc-200 rounded-[30px]">
//             <div className="w-full h-[130px] relative md:h-[160px] bg-primary-500 overflow-hidden rounded-t-[30px]">
//               <Image
//                 src="/assets/images/background-desktop.png"
//                 alt="background"
//                 width={500}
//                 height={500}
//                 className="w-full h-full object-cover brightness-75 scale-125"
//               />
//               <div className="absolute top-0  w-full h-full flex flex-col justify-center items-center">
//                 <p className="text-white text-base md:text-lg ">Welcome To</p>
//                 <p className="text-white text-2xl md:text-3xl font-bold">
//                   Quiz Money!
//                 </p>
//               </div>
//             </div>
//             <div className="bg-white p-4 gap-1 md:gap-3  rounded-b-[30px] flex justify-center items-center">
//               <Image
//                 src={"/icons/trophy.svg"}
//                 alt="trophy"
//                 height={30}
//                 width={30}
//               />
//               <p className="text-center text-xs md:text-base font-bold">
//                 Win cash for participating on trivia questions with friends
//               </p>
//               <Image
//                 src={"/icons/trophy.svg"}
//                 alt="trophy"
//                 height={30}
//                 width={30}
//               />
//             </div>
//           </div>

//           <div>
//             <div className="p-4 gap-1 md:gap-3  flex items-center">
//               <Image
//                 src={"/icons/bulb.svg"}
//                 alt="bulb"
//                 height={30}
//                 width={30}
//               />
//               <p className="text-center text-xs md:text-base font-bold">
//                 Are You Ready To Put Your Knowledge To The Test?{" "}
//               </p>
//               <Image
//                 src={"/icons/bulb.svg"}
//                 alt="bulb"
//                 height={30}
//                 width={30}
//               />
//             </div>
//           </div>

//           <p className="px-4 text-xs md:text-base md:text-start text-center">
//             Quiz-Money is an exciting game where you can challenge yourself and
//             your friends with a wide range of trivia questions from various
//             categories.
//           </p>

//           <p className="px-4 text-primary-600 text-sm md:text-base md:text-start text-center">
//             {" "}
//             Here's how it works:
//           </p>

//           <div className="flex flex-col gap-1 ">
//             {steps.map((step) => (
//               <div key={step.id} className="flex items-start gap-2">
//                 <div className="flex flex-col gap-1 items-center">
//                   <div className="bg-primary-900 rounded-full w-7 h-7 p-1 flex items-center justify-center">
//                     <p className="text-white text-sm font-bold border border-white rounded-full w-5 h-5 flex items-center justify-center">
//                       {step.id}
//                     </p>
//                   </div>
//                   {step.id !== steps.length && (
//                     <div className="h-6 w-[2px] bg-primary-400" />
//                   )}
//                 </div>
//                 <p className="text-xs md:text-sm">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </Flex>
//       </Flex>
//     </motion.div>
//   );
// };

// export default Page;
