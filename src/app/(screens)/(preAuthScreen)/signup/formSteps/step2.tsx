"use client";
import { SignUpFormType } from "@/app/api/interface";
import { ArrowDownIcon, CalendarIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import CustomSelect from "@/app/utils/CustomSelect";
import CustomTextField from "@/app/utils/CustomTextField";
import { toastPosition } from "@/app/utils/utils";
import { Flex } from "@radix-ui/themes";
import * as React from "react";
import { toast } from "sonner";

interface IStepTwoProps {
  formData: SignUpFormType;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  nextStep: () => void;
}

const StepTwo: React.FunctionComponent<IStepTwoProps> = (props) => {
  const { formData, onChange, nextStep } = props;
  const handleNextForm = (e: React.FormEvent) => {
    e.preventDefault();
    const dob = new Date(formData.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    const isBirthdayPassed =
      m > 0 || (m === 0 && today.getDate() >= dob.getDate());

    const actualAge = isBirthdayPassed ? age : age - 1;

    if (isNaN(dob.getTime()) || actualAge < 18) {
      toast.error("You must be 18 years or older to proceed.", {
        position: toastPosition,
      });
      return;
    }

    nextStep();
  };
  return (
    <>
      <form onSubmit={handleNextForm}>
        <Flex direction="column" gap="4">
          <CustomTextField
            label="Date of Birth"
            name="dob"
            value={formData.dob}
            type="date"
            autoComplete="bday"
            onChange={onChange}
            icon={<CalendarIcon className="text-[#A6ABC4]" />}
            required
          />
          <CustomSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            options={genders}
            onChange={onChange}
            disabledOption="Select your gender"
            icon={<ArrowDownIcon className="text-[#A6ABC4]" />}
          />
          <CustomSelect
            label="Country"
            name="gender"
            value={formData.gender}
            options={[{ label: "Nigeria", value: "nigeria" }]}
            onChange={onChange}
            disabledOption="Select your country"
            icon={<ArrowDownIcon className="text-[#A6ABC4]" />}
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

export default StepTwo;

export const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];
