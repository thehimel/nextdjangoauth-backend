import {ColorType} from "@/constants/interfaces.ts";
import {Button, Spinner} from "@nextui-org/react";
import React from 'react';

interface SubmitButtonProps {
  color?: ColorType;
  type?: "submit";
  isSubmitting: boolean;
  title: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({color, isSubmitting, title}) => {
  return (
    <Button
      color={color || "primary"}
      type="submit"
      isDisabled={isSubmitting}
    >
      {isSubmitting ? <Spinner size="sm" color="default" /> : title}
    </Button>
  );
};

export default SubmitButton;
