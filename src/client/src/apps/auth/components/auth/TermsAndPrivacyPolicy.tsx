import {Link} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const TermsAndPrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <p className="text-center text-small">
      {t("auth.privacy.agreeToOur")}&nbsp;
      <Link href="#" size="sm">{t("auth.privacy.terms")}</Link>&nbsp;
      {t("common.and").toLowerCase()}&nbsp;
      <Link href="#" size="sm">{t("auth.privacy.privacyPolicy")}</Link>
    </p>
  );
};

export default TermsAndPrivacyPolicy;
