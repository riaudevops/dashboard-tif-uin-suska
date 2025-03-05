import {
  NavMenuItemsProps,
  NavMenuProps,
} from "@/interfaces/components/globals/headers/nav-menu.interface";
import { useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export const NavMenuMobile = ({ navMenu }: NavMenuProps) => {
  const location = useLocation();

  return (
    <nav className="flex mt-[0.20rem] justify-start items-center text-sm text-muted-foreground">
      <ul className="flex flex-col space-y-5">
        {navMenu.map((item: NavMenuItemsProps) => {
          return (
            <li
              key={item.label}
              className={
                location.hash === item.location_target.replace("/", "")
                  ? "text-foreground"
                  : "hover:text-foreground/75"
              }
            >
              <HashLink smooth to={item.location_target}>
                {item.label}
              </HashLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
