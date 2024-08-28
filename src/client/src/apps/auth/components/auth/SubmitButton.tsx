import { Button, ButtonProps, Spinner } from "@nextui-org/react";
import React from "react";
import { ColorType } from "@/apps/base/types/common.ts";

interface SubmitButtonProps extends ButtonProps {
  color?: ColorType;
  isDisabled?: boolean;
  isLoading?: boolean;
  title: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ color, isDisabled, isLoading, title, ...props }) => {
  return (
    <Button
      {...props}
      type="submit"
      color={color || "default"}
      isDisabled={isDisabled || isLoading}
    >
      {isLoading ? <Spinner size="sm" color="white" /> : title}
    </Button>
  );
};

export default SubmitButton;
