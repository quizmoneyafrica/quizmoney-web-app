"use client";

import CustomImage from "../wallet/CustomImage";
import { useRouter } from "next/navigation";
import GameZoneButton from "./game-zone-btn";

export function GameZoneCardHome() {
	const router = useRouter();
	return (
		<div className="bg-[#DFF9FF] rounded-3xl relative md:p-6 p-3 overflow-hidden shadow-md w-full ">
			<div className=" absolute left-0 top-0 ml-5 flex items-center justify-center">
				<CustomImage alt="" src={"/icons/tabler_badge-filled.svg"} />
			</div>
			{/* Lines */}
			<div className=" absolute left-0 pb-5 bottom-0 right-0 ml-5 flex md:hidden z-10 flex-col items-center w-full  justify-center">
				<CustomImage className=" w-full" alt="" src={"/icons/riverline1.svg"} />
				<CustomImage className=" w-full" alt="" src={"/icons/riverline2.svg"} />
			</div>
			<div className=" grid grid-cols-2 pt-5 z-50">
				{/* Left Content */}
				<div className="flex flex-col gap-3 max-w-md  justify-center">
					<CustomImage alt="" src={"/icons/game-z.svg"} />
					<span className="text-black text-sm  font-medium">
						Play games daily & win cash instantly
					</span>
					<div className=" w-full flex justify-start">
						<GameZoneButton
							onClick={() => {
								router.push("/game-zone");
							}}>
							<span className=" shrink-0 text-sm">Play games </span>
						</GameZoneButton>
					</div>
				</div>

				{/* Right Illustration */}
				<div className="relative md:mt-0 flex  justify-end">
					<CustomImage
						alt=""
						src={"/assets/images/gamezone.png"}
						width={124.87}
						height={137.59}
					/>
				</div>
			</div>
		</div>
	);
}
