import React from "react";
import {Checkbox, Link} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

interface IsAgreeProps {
  isSubmitting: boolean;
}

const IsAgree: React.FC<IsAgreeProps> = ({ isSubmitting }) => {
  const { t } = useTranslation();
  const [isAgree, setIsAgree] = React.useState(true);

  return (
    <>
      <Checkbox
        isRequired
        name="agree"
        size="sm"
        isInvalid={!isAgree}
        isDisabled={isSubmitting}
        defaultSelected={isAgree}
        onValueChange={(value) => setIsAgree(value)}
      >
        {t("privacy.agreeWithThe")}&nbsp;
        <Link href="#" size="sm">{t("privacy.terms")}</Link>&nbsp;
        {t("common.and").toLowerCase()}&nbsp;
        <Link href="#" size="sm">{t("privacy.privacyPolicy")}</Link>
      </Checkbox>
      {!isAgree ? <p className="text-small text-danger pb-2">{t("privacy.agreeToContinue")}</p> : null}
    </>
  );
};

export default IsAgree;
