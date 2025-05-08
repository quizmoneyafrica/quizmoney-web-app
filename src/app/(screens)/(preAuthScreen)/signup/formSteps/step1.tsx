"use client";
import { SignUpFormType } from "@/app/api/interface";
import { MailIcon, PersonIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import CustomTextField from "@/app/utils/CustomTextField";
import { toastPosition } from "@/app/utils/utils";
import { Flex } from "@radix-ui/themes";
import * as React from "react";
import { toast } from "sonner";

interface IStepOneProps {
	formData: SignUpFormType;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	nextStep: () => void;
}

const StepOne: React.FunctionComponent<IStepOneProps> = (props) => {
	const { formData, onChange, nextStep } = props;

	const handleNextForm = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.firstName && formData.lastName && formData.email) {
			nextStep();
		} else {
			toast.info("All fields are required", {
				position: toastPosition,
			});
		}
	};
	return (
		<>
			<form onSubmit={handleNextForm}>
				<Flex direction="column" gap="4">
					<CustomTextField
						label="First Name"
						name="firstName"
						value={formData.firstName}
						type="text"
						autoComplete="first-name"
						placeholder="Enter your first name"
						onChange={onChange}
						icon={<PersonIcon className="text-[#A6ABC4]" />}
						required
					/>
					<CustomTextField
						label="Last Name"
						name="lastName"
						value={formData.lastName}
						type="text"
						autoComplete="family-name"
						placeholder="Enter your last name"
						onChange={onChange}
						icon={<PersonIcon className="text-[#A6ABC4]" />}
						required
					/>
					<CustomTextField
						label="Email"
						name="email"
						value={formData.email}
						type="email"
						autoComplete="email"
						placeholder="Enter your email address"
						onChange={onChange}
						icon={<MailIcon className="text-[#A6ABC4]" />}
						required
					/>
					<div className="pt-4">
						<CustomButton type="submit" width="full">
							Proceed
						</CustomButton>
					</div>
				</Flex>
			</form>
		</>
	);
};

export default StepOne;
