import {Divider} from "@nextui-org/react";
import {useTranslation} from "react-i18next";

const AuthDivider = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      <Divider className="flex-1"/>
      <p className="shrink-0 text-tiny text-default-500">{(t("base.general.or") as string).toUpperCase()}</p>
      <Divider className="flex-1"/>
    </div>
  );
}

export default AuthDivider;
