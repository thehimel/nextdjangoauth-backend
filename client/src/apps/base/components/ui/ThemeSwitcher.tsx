import {Icon} from "@iconify/react";
import {Button} from "@nextui-org/react";
import {AppDispatch} from "@/core/store/store.ts";
import {useAppDispatch, useAppSelector} from "@/core/store/hooks.ts";
import {toggleDarkMode} from "@/apps/base/store/baseActions.ts";

export const ThemeSwitcher = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.base.darkMode);

  const handleOnClick = () => {
    dispatch(toggleDarkMode());
  };

  const themeIcon = darkMode ? "solar:sun-linear" : "radix-icons:moon"

  return (
    <Button isIconOnly radius="full" variant="light" onClick={handleOnClick}>
      <Icon className="text-default-500" icon={themeIcon} width={24} />
    </Button>
  );
};
