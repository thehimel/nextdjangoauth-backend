import React from "react";
import {Checkbox, Link} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

interface IsAgreeProps {
  isDisabled: boolean;
  isAgree: boolean;
  onAgreeChange: (value: boolean) => void;
}

const IsAgree: React.FC<IsAgreeProps> = ({ isDisabled, isAgree, onAgreeChange }) => {
  const { t } = useTranslation();

  return (
    <>
      <Checkbox
        isRequired
        name="agree"
        size="sm"
        isInvalid={!isAgree}
        isDisabled={isDisabled}
        defaultSelected={isAgree}
        onValueChange={(value) => onAgreeChange(value)}
      >
        {t("privacy.agreeWithThe")}&nbsp;
        <Link href="#" size="sm">{t("privacy.terms")}</Link>&nbsp;
        {t("common.and").toLowerCase()}&nbsp;
        <Link href="#" size="sm">{t("privacy.privacyPolicy")}</Link>
      </Checkbox>
      {!isAgree ? <p className="text-small text-danger">{t("privacy.agreeToContinue")}</p> : null}
    </>
  );
};

export default IsAgree;
