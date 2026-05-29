/**
 * In-memory store for pending card payment orders.
 *
 * Holds order data between the VPOS redirect initiation and the
 * URLMS server-to-server confirmation from the bank.
 *
 * Keyed by reqrefnum (32-char hex string).
 * Entries expire after PENDING_TTL_MS to prevent unbounded memory growth.
 *
 * For production with multiple server instances, replace with
 * Redis / Upstash so the pending record is accessible across all instances.
 */

const PENDING_TTL_MS = 30 * 60 * 1000; // 30 minutes

export type PendingVposOrder = {
  // Checkout form / delivery data
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  sprat: string;
  brojStana: string;
  paymentMethod: "card_payment";
  pib: string;
  mb: string;
  note: string;
  cenovnikTermId: number;
  orderItems: {
    name: string;
    productCode: string;
    quantity: number;
    price: string;
    total: string;
  }[];
  subtotal: string;
  deliveryCost: string;
  total: string;
  itemCount: number;
  shippingFieldCode: string;
  shippingBasePrice: string;
  extraWeightShipments: number;
  extraWeightUnitPrice: string;
  extraWeightTotalPrice: string;
  totalWeight: string;
  // 321 delivery data
  deliveryAddressId: string;
  deliveryAddressNumber: string;
  deliveryComment: string;
  // Timing
  createdAt: number;
};

type StoreEntry = {
  data: PendingVposOrder;
  expiresAt: number;
};

// Module-level singleton map (shared across requests within the same process)
const pendingStore = new Map<string, StoreEntry>();

/** Prune expired entries to prevent unbounded memory growth. */
const prune = () => {
  const now = Date.now();
  for (const [key, entry] of pendingStore) {
    if (entry.expiresAt <= now) {
      pendingStore.delete(key);
    }
  }
};

export const setPendingOrder = (
  reqrefnum: string,
  data: PendingVposOrder,
): void => {
  prune();
  pendingStore.set(reqrefnum, {
    data,
    expiresAt: Date.now() + PENDING_TTL_MS,
  });
};

export const getPendingOrder = (
  reqrefnum: string,
): PendingVposOrder | null => {
  const entry = pendingStore.get(reqrefnum);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    pendingStore.delete(reqrefnum);
    return null;
  }
  return entry.data;
};

export const clearPendingOrder = (reqrefnum: string): void => {
  pendingStore.delete(reqrefnum);
};
