import NotificationsCard from "@/components/navigation/navbar/notifications/notifications-card.tsx";
import {Icon} from "@iconify/react";
import {Badge, Button, NavbarItem, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react";

const Notifications = () => {
  return (
    <NavbarItem className="flex">
      <Popover offset={12} placement="bottom-end">
        <PopoverTrigger>
          <Button
            disableRipple
            isIconOnly
            className="overflow-visible"
            radius="full"
            variant="light"
          >
            <Badge color="danger" content="5" showOutline={false} size="md">
              <Icon className="text-default-500" icon="solar:bell-linear" width={22} />
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
          <NotificationsCard className="w-full shadow-none" />
        </PopoverContent>
      </Popover>
    </NavbarItem>
  );
}

export default Notifications;
