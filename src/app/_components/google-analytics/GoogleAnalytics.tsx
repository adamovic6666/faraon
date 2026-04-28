import { GoogleAnalytics as NextGA } from "@next/third-parties/google";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const GoogleAnalytics = () => {
  if (!GA_ID) return null;

  return <NextGA gaId={GA_ID} />;
};

export default GoogleAnalytics;
