import React, {
  useState,
  ReactNode,
  HTMLAttributes,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as Checkbox from "@radix-ui/react-checkbox";
import {
  Upload,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";

// Type Definitions
export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  documentType: string;
  uploadedFile: string;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export interface PersonalInfoStepProps
  extends Omit<StepProps, "onBack" | "onSubmit"> {
  onNext: () => void;
}

export interface DocumentUploadStepProps extends Omit<StepProps, "onSubmit"> {
  onNext: () => void;
  onBack: () => void;
}

export interface ReviewStepProps
  extends Omit<StepProps, "onNext" | "setFormData"> {
  onBack: () => void;
  onSubmit: () => void;
  formData: FormData;
}

export interface SuccessScreenProps {
  onReset: () => void;
}

export type ButtonVariant = "default" | "outline" | "success";
export type ButtonSize = "default" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
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

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
  };

  const sizes: Record<ButtonSize, string> = {
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8 py-2 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-800focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
  ...props
}) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  onNext,
  formData,
  setFormData,
}) => {
  const handleSubmit = (): void => {
    if (formData.fullName && formData.email && formData.phone) {
      onNext();
    }
  };

  const isValid: boolean = Boolean(
    formData.fullName && formData.email && formData.phone
  );

  const handleInputChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  return <div className="w-full h-52 bg-red-700"></div>;
};

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  onNext,
  onBack,
  formData,
  setFormData,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (formData.documentType) {
      onNext();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      setFormData({ ...formData, uploadedFile: files[0].name });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, uploadedFile: file.name });
    }
  };

  const handleDocumentTypeChange = (value: string): void => {
    setFormData({ ...formData, documentType: value });
  };

  const isValid: boolean = Boolean(formData.documentType);

  return <div className="w-full h-52 bg-amber-600"></div>;
};

export const ReviewStep: React.FC<ReviewStepProps> = ({
  onBack,
  onSubmit,
  formData,
}) => {
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (isAgreed) {
      onSubmit();
    }
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate"): void => {
    setIsAgreed(checked === true);
  };

  return <div className="w-full h-52 bg-blue-400"></div>;
};

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onReset }) => {
  return (
    <Card className="max-w-md mx-auto border-0 shadow-none">
      <CardContent className="text-center py-12">
        <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
          Application Submitted!
        </CardTitle>
        <CardDescription className="text-gray-600 mb-8 text-base">
          Thank you for completing your KYC verification. We'll review your
          application and get back to you within 2-3 business days.
        </CardDescription>
        <Button onClick={onReset} variant="outline" size="lg">
          Start New Application
        </Button>
      </CardContent>
    </Card>
  );
};
