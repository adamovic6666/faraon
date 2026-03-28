import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const AnkhSeparator = () => {
  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 w-full">
      <div className="flex items-center gap-3 mt-10 md:mt-12 mb-8 md:mb-10">
        <Separator className="bg-black/10 flex-1" />
        <Image
          src="/images/ankh.svg"
          alt="Ankh"
          width={16}
          height={16}
          className="opacity-35"
        />
        <Separator className="bg-black/10 flex-1" />
      </div>
    </div>
  );
};

export default AnkhSeparator;
