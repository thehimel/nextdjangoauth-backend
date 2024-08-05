import {LOGIN_URL, SIGNUP_URL} from "@/constants/urls.ts";
import {Button, Link, NavbarItem} from "@nextui-org/react";
import {useTranslation} from "react-i18next";

const UserMenu = () => {
  const { t } = useTranslation();

  return (
    <div className="flex ml-2 gap-2">
      <NavbarItem className="sm:flex">
        <Link href={LOGIN_URL}>
          <Button radius="full" variant="bordered" color="primary" >
          <p>{t("navigation.login")}</p>
        </Button>
        </Link>
      </NavbarItem>
      <NavbarItem className="hidden sm:flex">
        <Link href={SIGNUP_URL}>
          <Button radius="full" variant="shadow" color="primary" >
          <p>{t("navigation.signup")}</p>
        </Button>
        </Link>
      </NavbarItem>
    </div>
  );
}

export default UserMenu;
