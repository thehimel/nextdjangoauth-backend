"use client";

import AuthButtons from "@/components/navigation/navbar/AuthMenu.tsx";
import FeatureBar from "@/components/navigation/navbar/FeatureBar.tsx";
import LanguageSelector from "@/components/navigation/navbar/LanguageSelector.tsx";
import Notifications from "@/components/navigation/navbar/notifications/Notifications.tsx";
import UserMenu from "@/components/navigation/navbar/UserMenu.tsx";
import {ThemeSwitcher} from "@/components/ui/ThemeSwitcher.tsx";
import {HOME_URL} from "@/constants/urls.ts";
import {useAppSelector} from "@/store/hooks.ts";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Divider,
  Input,
} from "@nextui-org/react";
import {Icon} from "@iconify/react";

import {AcmeIcon} from "@/components/icons/acme.tsx";
import {NavLink, useLocation} from "react-router-dom";

export default function NavBar() {
  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const showNotifications = false;
  const location = useLocation();
  const pathList = [HOME_URL];
  const currentPath = location.pathname;
  const showFeatureBar = pathList.includes(currentPath);
  const hideFeatureBar = true;

  return (
    <div className="w-full">
      <Navbar
        classNames={{
          base: "pt-2 lg:pt-4 lg:bg-transparent lg:backdrop-filter-none",
          wrapper: "px-4 sm:px-6",
          item: "data-[active=true]:text-primary",
        }}
        height="60px"
      >
        <NavbarMenuToggle className="h-6 sm:hidden" />
        <NavLink to={HOME_URL}>
          <NavbarBrand>
            <AcmeIcon />
            <p className="font-bold text-inherit">Client</p>
          </NavbarBrand>
        </NavLink>

        {/* Right Menu */}
        <NavbarContent className="ml-auto h-12 max-w-fit items-center gap-0" justify="end">
          {/* Search */}
          <NavbarItem className="mr-2 hidden sm:flex">
            <Input
              aria-label="Search"
              classNames={{
                inputWrapper: "bg-default-400/20 dark:bg-default-500/20",
              }}
              labelPlacement="outside"
              placeholder="Search..."
              radius="full"
              startContent={
                <Icon className="text-default-500" icon="solar:magnifer-linear" width={20} />
              }
            />
          </NavbarItem>
          <NavbarItem className="sm:flex">
            <ThemeSwitcher/>
          </NavbarItem>
          {/* Settings */}
          <NavbarItem className="hidden sm:flex">
            <Button isIconOnly radius="full" variant="light">
              <Icon className="text-default-500" icon="solar:settings-linear" width={24} />
            </Button>
          </NavbarItem>

          <NavbarItem className="sm:flex pr-1">
            <LanguageSelector/>
          </NavbarItem>

          {showNotifications && <Notifications/>}
          <Divider orientation="vertical" className="h-6 ml-2" />
          {isLoggedIn && <UserMenu/>}
          {!isLoggedIn && <AuthButtons/>}

        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu>
          <NavbarMenuItem>
            <Link className="w-full" color="foreground" href="#">
              Dashboard
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem isActive>
            <Link aria-current="page" className="w-full" color="primary" href="#">
              Deployments
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link className="w-full" color="foreground" href="#">
              Analytics
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link className="w-full" color="foreground" href="#">
              Team
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link className="w-full" color="foreground" href="#">
              Settings
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
      {!hideFeatureBar && showFeatureBar && <FeatureBar/>}
    </div>
  );
}
