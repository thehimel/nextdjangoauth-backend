import {ColorType} from "@/constants/interfaces.ts";
import {Button, Spinner} from "@nextui-org/react";
import React from 'react';

interface SubmitButtonProps {
  color?: ColorType;
  type?: "submit";
  isDisabled?: boolean;
  isLoading?: boolean;
  title: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({color, isDisabled, isLoading, title}) => {
  return (
    <Button type="submit" color={color || "default"} isDisabled={isDisabled || isLoading}>
      {isLoading ? <Spinner size="sm" color="default" /> : title}
    </Button>
  );
};

export default SubmitButton;
