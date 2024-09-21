import {countryFlag} from "@/apps/base/constants/countries.ts";
import {LanguageCode, languages} from "@/apps/base/constants/languages.ts";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger, SharedSelection,
} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (languageCode: LanguageCode): Promise<void> => {
    try {
      await i18n.changeLanguage(languageCode);
    } catch {
      toast.error(t("errors.websiteLanguage"));
    }
  };

  const handleSelectionChange = async (keys: SharedSelection) => {
    const languageCode = Array.from(keys)[0];
    await changeLanguage(languageCode as LanguageCode);
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button disableRipple isIconOnly className="-mr-1" radius="full" variant="light">
          <Avatar className="h-6 w-6 cursor-pointer" name={i18n.language} src={countryFlag(i18n.language as LanguageCode)}/>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("base.forms.labels.websiteLanguage")}
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[i18n.language]}
        onSelectionChange={handleSelectionChange}
      >
        {Object.entries(languages).map(([key, value]) => (
          <DropdownItem
            key={key}
            startContent={
              <Avatar className="h-6 w-6 cursor-pointer" name={value} src={countryFlag(key as LanguageCode)}/>
            }
          >
            {value}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default LanguageSelector;
