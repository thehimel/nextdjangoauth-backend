import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface CustomLinkProps {
  href: string;
  children: ReactNode;
}

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  const location = useLocation();

  // Normalize the paths by removing trailing slashes
  const normalizePath = (path: string) => path.replace(/\/+$/, "");

  const currentPath = normalizePath(location.pathname);
  const linkPath = normalizePath(href);

  console.log(currentPath);
  console.log(linkPath);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (currentPath === linkPath) {
      e.preventDefault(); // Prevent navigation if the paths match
    }
  };

  return (
    <Link to={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

export default CustomLink;
