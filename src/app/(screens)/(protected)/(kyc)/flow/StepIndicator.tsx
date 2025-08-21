interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="w-full flex-1">
          <span className="text-[#1B1B1B] font-semibold text-lg">
            KYC Verification
          </span>
        </div>
        <span className="text-black text-xs  font-medium">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              index < currentStep ? "bg-primary-900" : "bg-blue-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
