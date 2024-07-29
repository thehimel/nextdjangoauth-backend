"use client";

import {AcmeIcon} from "@/components/icons/acme.tsx";
import {MessageInterface} from "@/constants/interfaces.ts";
import {FC} from "react";

interface AuthHeaderProps {
  headerTitle: string;
  headline?: MessageInterface;
}

const AuthHeader: FC<AuthHeaderProps> = ({headerTitle, headline}) => {

  return (
    <div className="flex flex-col items-center pb-2">
      <AcmeIcon size={60}/>
      <p className="text-xl font-medium">{headerTitle}</p>
      {headline && <p className={`text-small text-${headline.color}`}>{headline.text}</p>}
    </div>
  );
}

export default AuthHeader;
