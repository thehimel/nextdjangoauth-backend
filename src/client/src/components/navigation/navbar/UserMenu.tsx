import {PROFILE_URL} from "@/constants/urls.ts";
import {useAppSelector} from "@/store/hooks.ts";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  NavbarItem,
} from "@nextui-org/react";

const UserMenu = () => {
  const userData = useAppSelector((state) => state.auth.userData);
  const fullName = `${userData.user.first_name} ${userData.user.last_name}`

  return (
    <NavbarItem className="px-2">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button className="mt-1 h-8 w-8 outline-none transition-transform">
            <Badge color="success" content="" placement="bottom-right" shape="circle">
              <Avatar size="sm" src="/static/avatar.svg" />
            </Badge>
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" textValue="profile" className="h-12 gap-2">
            <Link href={PROFILE_URL} color="foreground">
              <p className="font-semibold">{fullName.length > 1 ? fullName : userData.user.username}</p>
            </Link>
          </DropdownItem>
          <DropdownItem key="settings" textValue="My Settings">Language Settings</DropdownItem>
          <DropdownItem key="get_support" textValue="Get Support">Get Support</DropdownItem>
          <DropdownItem key="feedback" textValue="Feedback">Feedback</DropdownItem>
          <DropdownItem key="logout" textValue="Log Out" color="danger">Log Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem>
  );
}

export default UserMenu;
