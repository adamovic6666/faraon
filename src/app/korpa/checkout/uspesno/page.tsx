"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { clearCart } from "@/lib/features/carts/cartsSlice";

type InvoiceState = {
  loading: boolean;
  error: string;
  downloadUrl: string;
  fileName: string;
};

type SuccessParams = {
  orderNumber: string;
  orderId: string;
  paymentMethod: string;
  warrantUrl: string;
  warrantFileName: string;
};

const toBlobUrl = (base64: string, mimeType: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.codePointAt(i) ?? 0;
  }

  return URL.createObjectURL(
    new Blob([bytes], { type: mimeType || "application/pdf" }),
  );
};

const getSearchValue = (
  searchParams: ReturnType<typeof useSearchParams>,
  key: string,
) => searchParams.get(key)?.trim() || "";

const getSuccessParams = (
  searchParams: ReturnType<typeof useSearchParams>,
): SuccessParams => {
  const warrantUrl = getSearchValue(searchParams, "warrant");

  return {
    orderNumber: getSearchValue(searchParams, "order"),
    orderId: getSearchValue(searchParams, "orderId"),
    paymentMethod: getSearchValue(searchParams, "paymentMethod"),
    warrantUrl,
    warrantFileName:
      getSearchValue(searchParams, "warrantFileName") ||
      warrantUrl.split("/").findLast(Boolean) ||
      "warehouse-warrant.pdf",
  };
};

const SuccessPage = () => {
  const [invoice, setInvoice] = useState<InvoiceState>({
    loading: false,
    error: "",
    downloadUrl: "",
    fileName: "",
  });
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { orderNumber, orderId, paymentMethod, warrantUrl, warrantFileName } =
    getSuccessParams(searchParams);
  const shouldLoadInvoice =
    paymentMethod === "bank_transfer" && Boolean(orderId);

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    if (!shouldLoadInvoice) {
      return;
    }

    let active = true;

    const loadInvoice = async () => {
      setInvoice((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const response = await fetch(
          `/api/checkout/invoice?orderId=${encodeURIComponent(orderId)}`,
          { cache: "no-store" },
        );
        const result = (await response.json()) as {
          error?: string;
          contentBase64?: string;
          mimeType?: string;
          fileName?: string;
        };

        if (!response.ok || !result.contentBase64) {
          throw new Error(result.error || "Faktura trenutno nije dostupna.");
        }

        const downloadUrl = toBlobUrl(
          result.contentBase64,
          result.mimeType || "application/pdf",
        );

        if (!active) {
          URL.revokeObjectURL(downloadUrl);
          return;
        }

        setInvoice({
          loading: false,
          error: "",
          downloadUrl,
          fileName: result.fileName || `invoice-${orderId}.pdf`,
        });
      } catch (error) {
        console.error("Invoice fetch error:", error);

        if (!active) return;
        setInvoice((prev) => ({
          ...prev,
          loading: false,
          error: "Faktura još nije spremna. Pokušajte ponovo za par trenutaka.",
        }));
      }
    };

    void loadInvoice();

    return () => {
      active = false;
    };
  }, [orderId, shouldLoadInvoice]);

  useEffect(() => {
    return () => {
      if (invoice.downloadUrl) {
        URL.revokeObjectURL(invoice.downloadUrl);
      }
    };
  }, [invoice.downloadUrl]);

  return (
    <main className="relative isolate overflow-hidden px-4 pb-12 pt-24 md:pb-16 md:pt-28">
      <section className="mx-auto max-w-frame px-0">
        <div className="mx-auto flex min-h-[45vh] max-w-3xl flex-col items-center justify-center rounded-[28px] border border-black/10 bg-white/90 px-6 py-12 text-center md:px-10">
          <p className="inline-flex rounded-full border border-black/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/70">
            Porudžbina uspešna
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-none text-brand md:text-6xl">
            Hvala na kupovini
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-center text-base font-light leading-relaxed text-black/80 sm:text-lg">
            Vaša porudžbina je evidentirana i uskoro ćemo Vas kontaktirati radi
            potvrde i isporuke.
          </p>

          {orderNumber ? (
            <p className="mt-5 text-lg font-semibold text-brand md:text-2xl">
              Broj porudžbine: #{orderNumber}
            </p>
          ) : (
            <p className="mt-5 text-sm text-black/70 md:text-base">
              Broj porudžbine nije dostupan u URL-u, ali je porudžbina uspešno
              poslata.
            </p>
          )}

          {shouldLoadInvoice ? (
            <div className="mt-6 w-full max-w-md rounded-2xl border border-black/10 bg-section p-4">
              <p className="text-sm font-medium text-black/70">Faktura (PDF)</p>
              {invoice.loading ? (
                <p className="mt-1 text-sm text-black/60">
                  Preuzimanje u toku...
                </p>
              ) : null}
              {invoice.error ? (
                <p className="mt-1 text-sm text-red-600">{invoice.error}</p>
              ) : null}
              {invoice.downloadUrl ? (
                <a
                  href={invoice.downloadUrl}
                  download={invoice.fileName}
                  className="mt-3 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold uppercase text-black/80 transition-colors hover:bg-primary/85"
                >
                  Preuzmi fakturu
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex w-full flex-wrap justify-center gap-3">
            <Link
              href="/prodavnica"
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-brand px-10 py-4 text-center text-white transition-all hover:bg-brand/90 md:w-60 md:px-10 md:text-lg"
            >
              Idi u webshop
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-primary px-10 py-4 text-center text-black/80 transition-all hover:bg-primary/85 md:w-60 md:px-10 md:text-lg"
            >
              Nazad na početnu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuccessPage;
