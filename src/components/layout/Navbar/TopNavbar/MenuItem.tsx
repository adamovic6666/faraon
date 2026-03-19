import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  label: string;
  url?: string;
};

export function MenuItem({ label, url }: MenuItemProps) {
  return (
    <NavigationMenuItem>
      {/* <Link href={url ?? "/"} passHref> */}
      <NavigationMenuLink
        className={cn([
          navigationMenuTriggerStyle(),
          "font-medium px-3 text-md",
        ])}
      >
        {label}
      </NavigationMenuLink>
      {/* </Link> */}
    </NavigationMenuItem>
  );
}
