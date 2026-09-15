export type CountryCode = {
  code: string;
  dial: string;
  name: string;
};

export const COUNTRY_CODES: CountryCode[] = [
  { code: "MY", dial: "+60", name: "Malaysia" },
  { code: "SG", dial: "+65", name: "Singapore" },
  { code: "ID", dial: "+62", name: "Indonesia" },
  { code: "TH", dial: "+66", name: "Thailand" },
  { code: "VN", dial: "+84", name: "Vietnam" },
  { code: "PH", dial: "+63", name: "Philippines" },
  { code: "IN", dial: "+91", name: "India" },
  { code: "CN", dial: "+86", name: "China" },
  { code: "JP", dial: "+81", name: "Japan" },
  { code: "KR", dial: "+82", name: "South Korea" },
  { code: "AU", dial: "+61", name: "Australia" },
  { code: "NZ", dial: "+64", name: "New Zealand" },
  { code: "HK", dial: "+852", name: "Hong Kong" },
  { code: "TW", dial: "+886", name: "Taiwan" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "US", dial: "+1", name: "United States" },
  { code: "CA", dial: "+1", name: "Canada" },
  { code: "AE", dial: "+971", name: "United Arab Emirates" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "DE", dial: "+49", name: "Germany" },
  { code: "FR", dial: "+33", name: "France" },
  { code: "NL", dial: "+31", name: "Netherlands" },
];

export const DEFAULT_COUNTRY = COUNTRY_CODES[0];
