import SubmitButton from "@/components/auth/SubmitButton.tsx";
import {CardFooter} from "@nextui-org/react";

import {FC} from "react";

interface submitButtonProps {
  title: string;
  isLoading: boolean;
  isDisabled: boolean;
}

const ProfileFooter: FC<submitButtonProps> = ({title, isLoading, isDisabled}) => {
  return (
    <CardFooter className="justify-end gap-2">
      <SubmitButton
        className={"w-full"}
        title={title}
        color={"default"}
        isLoading={isLoading}
        isDisabled={isDisabled}
      />
    </CardFooter>
  );
}

export default ProfileFooter;
