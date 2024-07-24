import React from "react";
import {Link} from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarItem,
} from "@nextui-org/react";
import {AcmeLogo} from "./AcmeLogo.tsx";
import {ThemeSwitcher} from "../Theme/ThemeSwitcher.tsx";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = ["Profile", "Settings", "Help & Feedback", "Log Out"];

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <Link to="/">
          <NavbarBrand>
            <AcmeLogo />
            <p className="font-bold text-inherit">Client</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher/>
        </NavbarItem>
        <NavbarMenuToggle className="sm:hidden" aria-label={isMenuOpen ? "Close menu" : "Open menu"}/>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link to="#" className={`${item.toLowerCase() === 'log out' ? 'text-danger' : 'text-foreground'}`}>
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NavigationBar;
