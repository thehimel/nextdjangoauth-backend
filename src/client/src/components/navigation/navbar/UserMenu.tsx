import {PROFILE_URL} from "@/constants/urls.ts";
import {logout, LogoutResponseInterface} from "@/store/auth/actions/logout.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu, DropdownSection,
  DropdownTrigger,
  Link,
  NavbarItem, User,
} from "@nextui-org/react";
import {toast} from "sonner";

const UserMenu = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.userData);
  const fullName = `${userData.user.first_name} ${userData.user.last_name}`
  const avatarTitle = fullName.length > 1 ? fullName : userData.user.username
  const avatarImage = "/static/avatar.svg"

  const handleLogout = async () => {
    try {
      const response: LogoutResponseInterface = await dispatch(logout());

      if (response.success) {
        toast.success("Logged out successfully.");
      } else {
        toast.error(response.errors?.message || "An error occurred during logout.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during logout.");
    }
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
              <Link href={PROFILE_URL} color="foreground">
                <User
                  avatarProps={{size: "sm", imgProps: {className: "transition-none"}, src: avatarImage}}
                  classNames={{name: "font-semibold", description: "text-default-500"}}
                  name={avatarTitle}
                  description="General User"
                />
              </Link>

            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider aria-label="Preferences">
            <DropdownItem key="settings" textValue="My Settings">Language Settings</DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider aria-label="Get Support & Feedback">
            <DropdownItem key="get_support" textValue="Get Support">Get Support</DropdownItem>
            <DropdownItem key="feedback" textValue="Feedback">Feedback</DropdownItem>
          </DropdownSection >

          <DropdownItem key="logout" textValue="Log Out" color="danger" onClick={handleLogout}>Log Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem>
  );
}

export default UserMenu;
