"use client";

import type {CardProps} from "@nextui-org/react";

import {Card, CardHeader, CardBody, Button, Avatar, Badge, Input, CardFooter} from "@nextui-org/react";

const Profile = (props: CardProps) => {
  return (
    <Card className="max-w-xl p-2" {...props}>
      <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
        <p className="text-large text-center">Account Details</p>
        <div className="flex gap-4 py-4">
          <Badge isInvisible>
            <Avatar className="h-14 w-14" src="/static/avatar.svg" />
          </Badge>
          <div className="flex flex-col items-start justify-center">
            <p className="font-medium">Please add your name.</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Username" labelPlacement="outside" placeholder="Enter username" />
        <Input label="Email" labelPlacement="outside" placeholder="Enter email" />
        <Input label="First Name" labelPlacement="outside" placeholder="Enter first name" />
        <Input label="Last Name" labelPlacement="outside" placeholder="Enter last name" />
      </CardBody>

      <CardFooter className="mt-4 justify-end gap-2">
        <Button color="primary" radius="full">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Profile;
