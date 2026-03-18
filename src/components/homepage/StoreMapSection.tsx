import SectionTitle from "../common/SectionTitle";

const dummyPins = [
  { id: 2, top: "30%", left: "33%" },
  { id: 3, top: "38%", left: "44%" },
  { id: 4, top: "45%", left: "29%" },
  { id: 5, top: "53%", left: "52%" },
  { id: 6, top: "61%", left: "36%" },
  { id: 7, top: "66%", left: "58%" },
  { id: 8, top: "74%", left: "24%" },
  { id: 9, top: "28%", left: "61%" },
  { id: 10, top: "48%", left: "67%" },
];

const StoreMapSection = () => {
  return (
    <section className="max-w-frame mx-auto px-4 xl:px-0 mt-14 sm:mt-16">
      <SectionTitle
        title="Faraon diskonti"
        className="mb-12"
        description={
          <>
            Sigurno smo blizu tebe - naši diskonti pića pokrivaju ceo Novi Sad,
            u svakom komšiluku.
            <br />
            Pronađi najbliži Faraon diskont na mapi ispod i iskoristi najbolje
            cene pića u gradu.
          </>
        }
      />

      <div className="rounded-[28px] bg-section p-0 sm:p-6 md:p-8">
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

            <div className="absolute inset-0 pointer-events-none">
              {dummyPins.map((pin) => (
                <span
                  key={pin.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: pin.top, left: pin.left }}
                >
                  <span className="block w-4 h-4 rounded-full bg-brand border-2 border-white shadow-md" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreMapSection;
