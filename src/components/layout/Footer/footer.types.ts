export type FLink = {
  id: number;
  label: string;
  url: string;
};

export type FooterLinks = {
  id: number;
  title: string;
  children: FLink[];
};

export type PaymentBadge = {
  id: number;
  srcUrl: string;
};
