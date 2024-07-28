"use client";

import {Button, CardFooter, Spinner} from "@nextui-org/react";

import {FC} from "react";

interface submitButtonProps {
  title: string;
  isLoading: boolean;
}

const ProfileFooter: FC<submitButtonProps> = ({title, isLoading}) => {
  return (
    <CardFooter className="justify-end gap-2">
      <Button
        color="primary"
        type="submit"
        radius="full"
        isDisabled={isLoading}
        endContent={isLoading ? (<Spinner size="sm" color="default"/>) : null}
      >
        {title}
      </Button>
    </CardFooter>
  );
}

export default ProfileFooter;
