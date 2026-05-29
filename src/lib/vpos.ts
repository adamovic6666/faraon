/**
 * SIA VPOS Redirect Integration Utilities
 *
 * Integration type: Redirect (custom) — PAGE=LAND
 * Bank: UniCredit Bank Serbia / SIA VPOS
 * Spec: Merchant Integration VPOS REDIRECT_2.6.0._Nexi
 *
 * Required .env variables:
 *   VPOS_STORE_ID       — Redirect Store ID (IGxxxxxx format)
 *   VPOS_SECRET_KEY     — MAC signing secret key
 *   VPOS_URL            — VPOS redirect URL (defaults to test env)
 *   NEXT_PUBLIC_BASE_URL — Public base URL of this site (e.g. https://faraondiskonti.rs)
 *   VPOS_OPERATOR_ID    — (optional) Operator ID; defaults to VPOS_STORE_ID
 */

import { createHash, randomBytes } from "node:crypto";

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

export const getVposUrl = (): string =>
  process.env.VPOS_URL ??
  "https://virtualpostest.sia.eu/vpos/payments/main?PAGE=LAND";

export const getStoreId = (): string => {
  const id = process.env.VPOS_STORE_ID?.trim();
  if (!id) throw new Error("VPOS_STORE_ID env variable is not set");
  return id;
};

const getRequestSecretKey = (): string => {
  const key = process.env.VPOS_SECRET_KEY_START?.trim();
  if (!key) throw new Error("VPOS_SECRET_KEY_START env variable is not set");
  return key;
};

const getResultSecretKey = (): string => {
  const key = process.env.VPOS_SECRET_KEY_RESULT_API?.trim();
  if (!key) throw new Error("VPOS_SECRET_KEY_RESULT_API env variable is not set");
  return key;
};

export const getOperatorId = (): string =>
  process.env.VPOS_OPERATOR_ID?.trim() || getStoreId();

export const getBaseUrl = (): string => {
  const raw =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ??
    process.env.BASE_URL?.trim() ??
    "";
  return raw.replace(/\/$/, "");
};

// ---------------------------------------------------------------------------
// Reference number
// ---------------------------------------------------------------------------

/** Generates a unique 32-character alphanumeric request reference number. */
export const generateReqRefNum = (): string =>
  randomBytes(16).toString("hex"); // 32 hex chars

// ---------------------------------------------------------------------------
// MAC calculation
// ---------------------------------------------------------------------------

/**
 * Calculates the MAC for the initial payment redirect request.
 *
 * Formula (SIA VPOS REDIRECT v2.6.0, section 4.x):
 *   MAC = SHA-1( field=value pairs concatenated (no separator) + SECRET_KEY )
 *
 * Field order: reqrefnum → operatorid → amount → currencycode → storeid
 *
 * Verify exact field order and any additional required fields
 * from the "Merchant Integration VPOS REDIRECT_2.6.0._Nexi" PDF,
 * section covering the MAC calculation for the LAND page request.
 */
export const calculateRequestMac = (params: {
  URLMS: string;
  URLDONE: string;
  ORDERID: string;
  SHOPID: string;
  AMOUNT: string;
  CURRENCY: string;
  ACCOUNTINGMODE: string;
  AUTHORMODE: string;
}): string => {
  const secretKey = getRequestSecretKey();

  // Exact field order and format confirmed from VPOS STRINGA_MAC debug output.
  // Format: key=value&key=value...&key=value&SECRET  (& before secret — PDF footnote 10)
  const str =
    `URLMS=${params.URLMS}` +
    `&URLDONE=${params.URLDONE}` +
    `&ORDERID=${params.ORDERID}` +
    `&SHOPID=${params.SHOPID}` +
    `&AMOUNT=${params.AMOUNT}` +
    `&CURRENCY=${params.CURRENCY}` +
    `&ACCOUNTINGMODE=${params.ACCOUNTINGMODE}` +
    `&AUTHORMODE=${params.AUTHORMODE}` +
    "&" + secretKey;

  return createHash("sha1").update(str, "utf8").digest("hex").toUpperCase();
};

/**
 * Verifies the MAC received in the URLMS (server-to-server) notification.
 *
 * Formula (SIA VPOS REDIRECT v2.6.0, section on URLMS response):
 *   MAC = SHA-1( field=value pairs concatenated (no separator) + SECRET_KEY )
 *
 * Field order: storeid → reqrefnum → orderid → result → amount → authorcode
 *
 * Verify exact field order and required fields from the PDF section
 * describing the URLMS notification parameters.
 */
export const verifyCallbackMac = (params: {
  IDNEGOZIO: string;
  NUMORD: string;
  ORDERID: string;
  IMPORTO: string;
  VALUTA: string;
  ESITO: string;
  AUT: string;
  MAC: string;
}): boolean => {
  const secretKey = getResultSecretKey();

  const str =
    `IDNEGOZIO=${params.IDNEGOZIO}` +
    `&NUMORD=${params.NUMORD}` +
    `&ORDERID=${params.ORDERID}` +
    `&IMPORTO=${params.IMPORTO}` +
    `&VALUTA=${params.VALUTA}` +
    `&ESITO=${params.ESITO}` +
    `&AUT=${params.AUT}` +
    "&" + secretKey;

  const expected = createHash("sha1")
    .update(str, "utf8")
    .digest("hex")
    .toUpperCase();

  return expected === params.MAC.toUpperCase();
};

// ---------------------------------------------------------------------------
// Build redirect params
// ---------------------------------------------------------------------------

/**
 * Builds the full set of POST parameters for the VPOS redirect form.
 *
 * Amount note: SIA VPOS expects the amount in the minor currency unit.
 * For RSD (ISO 941): 1 RSD = 100 paras → 1 000 RSD = 100 000.
 *
 * Confirm with the bank whether the test env uses minor (paras)
 * or major (RSD) units — check test case amounts vs expected results.
 */
export const buildVposParams = (opts: {
  reqrefnum: string;
  amountRsd: number;
  urlback: string;
  urldone: string;
  urlms: string;
  langid?: string;
  tcontab?: string;
}): Record<string, string> => {
  const storeId = getStoreId();
  const operatorId = getOperatorId();

  // Amount in minor unit (paras): multiply RSD by 100
  const amountMinor = String(Math.round(opts.amountRsd * 100));

  const mac = calculateRequestMac({
    URLMS: opts.urlms,
    URLDONE: opts.urldone,
    ORDERID: opts.reqrefnum,
    SHOPID: storeId,
    AMOUNT: amountMinor,
    CURRENCY: "941",
    ACCOUNTINGMODE: opts.tcontab ?? "I",
    AUTHORMODE: "I",
  });

  return {
    IDNEGOZIO: storeId,
    OPERATORE: operatorId,
    NUMORD: opts.reqrefnum,
    IMPORTO: amountMinor,
    VALUTA: "941",
    LANG: opts.langid ?? "SR",
    URLBACK: opts.urlback,
    URLDONE: opts.urldone,
    URLMS: opts.urlms,
    TCONTAB: opts.tcontab ?? "I",
    TAUTOR: "I",
    MAC: mac,
  };
};
