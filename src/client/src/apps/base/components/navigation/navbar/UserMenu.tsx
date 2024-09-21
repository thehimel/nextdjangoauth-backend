import {PROFILE_URL} from "@/apps/auth/urls/client.ts";
import {useLogout} from "@/apps/auth/hooks/useAuth.ts";
import {useAppSelector} from "@/core/store/hooks.ts";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu, DropdownSection,
  DropdownTrigger,
  NavbarItem, User,
} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const UserMenu = () => {
  const { t } = useTranslation();

  const userData = useAppSelector((state) => state.auth.userData);
  const fullName = `${userData.user.first_name} ${userData.user.last_name}`
  const avatarTitle = fullName.length > 1 ? fullName : userData.user.username
  const avatarImage = "/static/avatar.svg"
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <NavbarItem className="px-2">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button disableRipple isIconOnly className="-mr-1" radius="full" variant="light">
            <Avatar className="h-6 w-6 cursor-pointer" name={avatarTitle} src={avatarImage}/>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownSection showDivider aria-label="profile">
            <DropdownItem key="profile" textValue="profile" className="h-12 gap-2">
              <Link to={PROFILE_URL}>
                <User
                  avatarProps={{size: "sm", imgProps: {className: "transition-none"}, src: avatarImage}}
                  classNames={{name: "font-semibold", description: "text-default-500"}}
                  name={avatarTitle}
                  description={t("profile.badges.basicMember")}
                />
              </Link>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider aria-label="Preferences">
            <DropdownItem key="settings" textValue="My Settings">{t("base.navigation.languageSettings")}</DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider aria-label="Get Support & Feedback">
            <DropdownItem key="get_support" textValue="Get Support">{t("base.navigation.support")}</DropdownItem>
            <DropdownItem key="feedback" textValue="Feedback">{t("base.navigation.feedback")}</DropdownItem>
          </DropdownSection >

          <DropdownItem key="logout" textValue="Log Out" color="danger" onClick={handleLogout}>
            {t("auth.navigation.logout")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem>
  );
}

export default UserMenu;
