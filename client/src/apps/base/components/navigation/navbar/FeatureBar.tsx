import {Icon} from "@iconify/react";
import {Avatar, AvatarGroup, Button, Chip, Divider, ScrollShadow, Tab, Tabs, Tooltip} from "@nextui-org/react";

const FeatureBar = () => {
  return (
    <main className="flex w-full justify-center lg:mt-6">
      <ScrollShadow
        hideScrollBar
        className="flex w-full max-w-[1024px] justify-between gap-8 border-b border-divider px-4 sm:px-8"
        orientation="horizontal"
      >
        <Tabs
          aria-label="Navigation Tabs"
          classNames={{
            tabList: "w-full relative rounded-none p-0 gap-4 lg:gap-6",
            tab: "max-w-fit px-0 h-12",
            cursor: "w-full",
            tabContent: "text-default-400",
          }}
          radius="full"
          variant="underlined"
        >
          <Tab key="dashboard" title="Dashboard"/>
          <Tab
            key="deployments"
            title={
              <div className="flex items-center gap-2">
                <p>Deployments</p>
                <Chip size="sm">9</Chip>
              </div>
            }
          />
          <Tab key="analytics" title="Analytics"/>
          <Tab key="team" title="Team"/>
          <Tab key="settings" title="Settings"/>
        </Tabs>
        <div className="flex items-center gap-4">
          <AvatarGroup max={3} size="sm" total={10}>
            <Tooltip content="John" placement="bottom">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d"/>
            </Tooltip>
            <Tooltip content="Mark" placement="bottom">
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d"/>
            </Tooltip>
            <Tooltip content="Jane" placement="bottom">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d"/>
            </Tooltip>
          </AvatarGroup>
          <Divider className="h-6" orientation="vertical"/>
          <Tooltip content="New deployment" placement="bottom">
            <Button isIconOnly radius="full" size="sm" variant="faded">
              <Icon className="text-default-500" icon="lucide:plus" width={16}/>
            </Button>
          </Tooltip>
        </div>
      </ScrollShadow>
    </main>
  );
}

export default FeatureBar;
