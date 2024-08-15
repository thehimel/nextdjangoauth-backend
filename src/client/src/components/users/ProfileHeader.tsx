import {CardHeader, Avatar, Badge} from "@nextui-org/react";
import {FC} from "react";
import {Link} from "react-router-dom";

interface ProfileHeaderProps {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  navigationLink?: {
    url: string,
    title: string,
  };
}

const ProfileHeader: FC<ProfileHeaderProps> = ({title, firstName, lastName, email, navigationLink}) => {
  return (
    <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
      <p className="text-large text-center">{title}</p>
      <div className="flex gap-4 py-4">
        <div className="flex flex-col items-start justify-center">
          <Badge isInvisible>
            <Avatar className="h-14 w-14" src="/static/avatar.svg"/>
          </Badge>
        </div>
        <div className="flex flex-col items-start justify-center">
          <p className="font-medium">{firstName} {lastName}</p>
          <span className="text-small text-default-500">{email}</span>
          {navigationLink && <Link to={navigationLink.url} className="text-primary">{navigationLink.title}</Link>}
        </div>
      </div>
    </CardHeader>
  );
}

export default ProfileHeader;
