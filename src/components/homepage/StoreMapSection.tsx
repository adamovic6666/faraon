import { cn } from "@/lib/utils";
import SectionTitle from "../common/SectionTitle";

const StoreMapSection = ({ isLocationPage }: { isLocationPage: boolean }) => {
  return (
    <section
      id="faraon-diskonti"
      className={cn(
        "max-w-frame mx-auto w-full",
        isLocationPage ? "px-0" : "px-4 xl:px-0",
      )}
    >
      {!isLocationPage && (
        <SectionTitle
          title="Faraon diskonti"
          className="mb-10 md:mb-12"
          description={
            <div className="md:flex md:flex-col items-center justify-center">
              <span>
                Sigurno smo blizu tebe - naši diskonti pića pokrivaju ceo Novi
                Sad, u svakom komšiluku.{" "}
              </span>
              <span>
                Pronađi najbliži Faraon diskont na mapi ispod i iskoristi
                najbolje cene pića u gradu.
              </span>
            </div>
          }
        />
      )}

      <div
        className={cn(
          `rounded-[28px] ${isLocationPage ? "pt-10 md:pt-12" : ""}`,
        )}
      >
        <div className="relative rounded-3xl overflow-hidden border border-black/10 bg-white">
          <div
            className={cn(
              "relative w-full",
              isLocationPage ? "h-120 md:h-160" : "h-96",
            )}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3389.8460527373163!2d19.844188699999997!3d45.2595963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475b105d70eebd2b%3A0x8d2cb44af41f01c4!2sDiskont%20Pi%C4%87a%20Faraon!5e1!3m2!1sen!2srs!4v1773850860072!5m2!1sen!2srs"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="Mapa diskonta pića Faraon"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreMapSection;
