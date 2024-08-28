import {LOGIN_URL, SIGNUP_URL} from "@/apps/base/constants/urls.ts";
import {Button, NavbarItem} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";

const UserMenu = () => {
  const { t } = useTranslation();

  return (
    <div className="flex ml-2 gap-2">
      <NavbarItem className="sm:flex">
        <Button to={LOGIN_URL} as={NavLink} radius="full" variant="bordered" color="default"  >
          <p>{t("navigation.login")}</p>
        </Button>
      </NavbarItem>
      <NavbarItem className="hidden sm:flex">
        <Button to={SIGNUP_URL} as={NavLink} radius="full" variant="shadow" color="default" >
          <p>{t("navigation.signup")}</p>
        </Button>
      </NavbarItem>
    </div>
  );
}

export default UserMenu;
