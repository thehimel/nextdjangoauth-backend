"use client";

import {AcmeIcon} from "@/components/icons/acme.tsx";
import {MessageInterface} from "@/constants/interfaces.ts";
import {FC} from "react";

interface AuthHeaderProps {
  title: string;
  message?: MessageInterface;
}

const AuthHeader: FC<AuthHeaderProps> = ({title, message}) => {

  return (
    <div className="flex flex-col items-center pb-2">
      <AcmeIcon size={60}/>
      <p className="text-xl font-medium">{title}</p>
      {message && <p className={`text-small text-${message?.color || "default"}`}>{message.text}</p>}
    </div>
  );
}

export default AuthHeader;
