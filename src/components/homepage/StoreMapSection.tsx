import SectionTitle from "../common/SectionTitle";

const StoreMapSection = () => {
  return (
    <section className="max-w-frame mx-auto px-4 xl:px-0 mt-14 sm:mt-16">
      <SectionTitle
        title="Faraon diskonti"
        className="mb-12"
        description={
          <div className="md:flex md:flex-col items-center justify-center">
            <span>
              Sigurno smo blizu tebe - naši diskonti pića pokrivaju ceo Novi
              Sad, u svakom komšiluku.
            </span>
            <span>
              Pronađi najbliži Faraon diskont na mapi ispod i iskoristi najbolje
              cene pića u gradu.
            </span>
          </div>
        }
      />

      <div className="rounded-[28p]">
        <div className="relative rounded-3xl overflow-hidden border border-black/10 bg-white">
          <div className="relative w-full h-96 sm:h-120">
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
