"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import SectionTitle from "@/components/common/SectionTitle";
import InputGroup from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import { formatPrice } from "@/utils/format-price";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TbBasketExclamation } from "react-icons/tb";
import { useRouter, useSearchParams } from "next/navigation";

type DeliveryAddress = {
  id: string;
  name: string;
  city: string;
  price: number;
  neighborhood: string;
};

type CheckoutFormValues = {
  fullName: string;
  email: string;
  phone: string;
  postalCode: string;
  sprat: string;
  brojStana: string;
  paymentMethod: "cash_on_delivery" | "bank_transfer" | "card_payment";
  pib: string;
  mb: string;
  note: string;
  cenovnikTermId: string;
  shippingPrice: string;
};

type PricingOption = {
  id: number;
  name: string;
  fieldCode: string;
  price: string;
  currencyCode: string;
};

type ShippingBreakdown = {
  totalShippingPrice: number;
  shippingBasePrice: number;
  totalWeightNumber: string;
  totalWeightUnit: string;
  extraWeightShipments: number;
  extraWeightUnitPrice: number;
  extraWeightTotalPrice: number;
};

type CheckoutOrderItemPayload = {
  name: string;
  productCode: string;
  quantity: number;
  price: string;
  total: string;
};

type CheckoutSubmitPayload = Omit<
  CheckoutFormValues,
  "cenovnikTermId" | "shippingPrice"
> & {
  address: string;
  city: string;
  cenovnikTermId: number;
  shippingPrice: number;
  orderItems: CheckoutOrderItemPayload[];
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
};

type CheckoutSuccessResponse = {
  error?: string;
  orderNumber?: string;
  orderId?: string;
  paymentMethod?: CheckoutFormValues["paymentMethod"];
  warrantUrl?: string;
  warrantFileName?: string;
};

const redirectToVpos = (vposUrl: string, params: Record<string, string>) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = vposUrl;
  form.style.display = "none";
  for (const [name, value] of Object.entries(params)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
};

const normalizeSku = (value: string | number) => {
  const raw = String(value).trim();
  if (/^\d+$/.test(raw) && raw.length < 4) {
    return raw.padStart(4, "0");
  }
  return raw;
};

const buildSuccessUrl = ({
  orderNumber,
  orderId,
  paymentMethod,
  warrantUrl,
  warrantFileName,
}: {
  orderNumber: string;
  orderId: string;
  paymentMethod: CheckoutFormValues["paymentMethod"];
  warrantUrl?: string;
  warrantFileName?: string;
}) => {
  const params = new URLSearchParams({
    order: orderNumber,
    orderId,
    paymentMethod,
  });

  if (warrantUrl) {
    params.set("warrant", warrantUrl);
  }

  if (warrantFileName) {
    params.set("warrantFileName", warrantFileName);
  }

  return `/korpa/checkout/uspesno?${params.toString()}`;
};

const buildOrderItems = (
  items: NonNullable<RootState["carts"]["cart"]>["items"],
): CheckoutOrderItemPayload[] =>
  items.map((item) => {
    const unitPrice = Math.round(item.price);

    return {
      name: item.name,
      productCode: normalizeSku(item.id),
      quantity: item.quantity,
      price: String(unitPrice),
      total: String(unitPrice * item.quantity),
    };
  });

const buildCheckoutPayload = ({
  formData,
  address,
  city,
  cart,
  subtotal,
  deliveryCost,
  total,
  shippingBreakdown,
  fieldCode,
}: {
  formData: CheckoutFormValues;
  address: string;
  city: string;
  cart: NonNullable<RootState["carts"]["cart"]>;
  subtotal: number;
  deliveryCost: number;
  total: number;
  shippingBreakdown: ShippingBreakdown | null;
  fieldCode: string;
}): CheckoutSubmitPayload => ({
  ...formData,
  address,
  city,
  cenovnikTermId: Number(formData.cenovnikTermId),
  shippingPrice: Number(formData.shippingPrice),
  orderItems: buildOrderItems(cart.items),
  subtotal: String(subtotal),
  deliveryCost: String(deliveryCost),
  total: String(total),
  itemCount: cart.totalQuantities,
  shippingFieldCode: fieldCode,
  shippingBasePrice: String(
    shippingBreakdown?.shippingBasePrice ?? deliveryCost,
  ),
  extraWeightShipments: shippingBreakdown?.extraWeightShipments ?? 0,
  extraWeightUnitPrice: String(shippingBreakdown?.extraWeightUnitPrice ?? 0),
  extraWeightTotalPrice: String(shippingBreakdown?.extraWeightTotalPrice ?? 0),
  totalWeight: shippingBreakdown
    ? `${shippingBreakdown.totalWeightNumber} ${shippingBreakdown.totalWeightUnit}`
    : "0 kg",
});

const submitButtonLabel = (
  isSubmitting: boolean,
  paymentMethod: CheckoutFormValues["paymentMethod"],
): string => {
  if (isSubmitting) return "Slanje...";
  if (paymentMethod === "card_payment") return "Plati karticom";
  return "Potvrdi porudžbinu";
};

const CheckoutPage = () => {
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isVposRedirecting, setIsVposRedirecting] = useState(false);
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([]);
  const [pricingError, setPricingError] = useState("");
  const [shippingBreakdown, setShippingBreakdown] =
    useState<ShippingBreakdown | null>(null);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>(
    [],
  );
  const [isAddressesLoading, setIsAddressesLoading] = useState(true);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] =
    useState<DeliveryAddress | null>(null);
  const [addressSearch, setAddressSearch] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [deliveryPrice321, setDeliveryPrice321] = useState<number | null>(null);
  const [addressPricingError, setAddressPricingError] = useState("");
  const addressComboboxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cart, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      postalCode: "",
      sprat: "",
      brojStana: "",
      paymentMethod: "cash_on_delivery",
      pib: "",
      mb: "",
      note: "",
      cenovnikTermId: "",
      shippingPrice: "",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const selectedPricingId = watch("cenovnikTermId");

  useEffect(() => {
    const queryPricingId = searchParams.get("cenovnikTermId")?.trim();
    if (!queryPricingId) return;
    setValue("cenovnikTermId", queryPricingId, { shouldDirty: false });
  }, [searchParams, setValue]);

  useEffect(() => {
    const paymentError = searchParams.get("payment_error");
    const paymentCancelled = searchParams.get("payment_cancelled");
    if (paymentError) {
      setSubmitError(
        "Plaćanje karticom nije uspelo. Molimo pokušajte ponovo ili odaberite drugi način plaćanja.",
      );
    } else if (paymentCancelled) {
      setSubmitError("Plaćanje karticom je otkazano.");
    }
  }, [searchParams]);

  const selectedPricing = useMemo(
    () =>
      pricingOptions.find((option) => String(option.id) === selectedPricingId),
    [pricingOptions, selectedPricingId],
  );

  const filteredAddresses = useMemo(() => {
    const trimmed = addressSearch.trim();
    if (trimmed.length < 2) return [];
    const lower = trimmed.toLowerCase();
    return deliveryAddresses
      .filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.city.toLowerCase().includes(lower),
      )
      .slice(0, 30);
  }, [deliveryAddresses, addressSearch]);

  useEffect(() => {
    let mounted = true;

    const loadPricing = async () => {
      setPricingError("");

      try {
        const response = await fetch("/api/checkout/pricing", {
          cache: "no-store",
        });
        const result = (await response.json()) as {
          data?: PricingOption[];
          error?: string;
        };

        if (!response.ok || !Array.isArray(result.data)) {
          throw new Error(
            result.error || "Neuspešno učitavanje mesta dostave.",
          );
        }

        if (!mounted) return;

        setPricingOptions(result.data);
      } catch (error) {
        console.error("Pricing load error:", error);
        if (!mounted) return;
        setPricingError("Ne možemo da učitamo spisak mesta za dostavu.");
      }
    };

    void loadPricing();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadAddresses = async () => {
      setIsAddressesLoading(true);

      try {
        const response = await fetch("/api/checkout/delivery-addresses", {
          cache: "no-store",
        });

        const data: unknown = await response.json();
        if (!response.ok || !Array.isArray(data)) {
          console.error("[delivery-addresses] Unexpected response:", data);
          return;
        }

        if (!mounted) return;
        setDeliveryAddresses(data as DeliveryAddress[]);
      } catch (err) {
        console.error("[delivery-addresses] Load error:", err);
      } finally {
        if (mounted) setIsAddressesLoading(false);
      }
    };

    void loadAddresses();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressComboboxRef.current &&
        !addressComboboxRef.current.contains(event.target as Node)
      ) {
        setIsAddressDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let active = true;

    const calculateShipping = async () => {
      if (!cart || cart.items.length === 0) {
        if (active) {
          setShippingBreakdown(null);
          setShippingError("");
          setIsShippingLoading(false);
        }
        return;
      }

      if (!selectedPricingId) {
        if (active) {
          setShippingBreakdown(null);
          setShippingError("");
          setIsShippingLoading(false);
        }
        return;
      }

      setIsShippingLoading(true);
      setShippingError("");

      try {
        const response = await fetch("/api/checkout/shipping-rate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cenovnikTermId: Number(selectedPricingId),
            products: cart.items.map((item) => ({
              sku: normalizeSku(item.id),
              quantity: item.quantity,
            })),
          }),
        });

        const result = (await response.json()) as {
          error?: string;
          data?: {
            total_shipping_price?: { price?: string; currency_code?: string };
            shipping_price?: { price?: string; currency_code?: string };
            total_weight?: { weight_number?: string; weight_unit?: string };
            extra_weight?: {
              number_of_shipments?: number;
              extra_weight_price?: {
                price?: string;
                price_total?: string;
                currency_code?: string;
              };
            };
          };
        };

        if (!response.ok || !result.data?.total_shipping_price?.price) {
          throw new Error(result.error || "Neuspešan obračun dostave.");
        }

        const d = result.data;
        const totalPrice = Number(d.total_shipping_price!.price);
        if (!Number.isFinite(totalPrice)) {
          throw new TypeError("Neispravan iznos dostave.");
        }

        if (!active) return;

        setShippingBreakdown({
          totalShippingPrice: Math.round(totalPrice),
          shippingBasePrice: Math.round(Number(d.shipping_price?.price ?? "0")),
          totalWeightNumber: d.total_weight?.weight_number ?? "0",
          totalWeightUnit: d.total_weight?.weight_unit ?? "kg",
          extraWeightShipments: d.extra_weight?.number_of_shipments ?? 0,
          extraWeightUnitPrice: Math.round(
            Number(d.extra_weight?.extra_weight_price?.price ?? "0"),
          ),
          extraWeightTotalPrice: Math.round(
            Number(d.extra_weight?.extra_weight_price?.price_total ?? "0"),
          ),
        });
      } catch (error) {
        console.error("Shipping calculation error:", error);
        if (!active) return;
        setShippingBreakdown(null);
        setShippingError(
          "Ne možemo da izračunamo cenu dostave za izabrano mesto.",
        );
      } finally {
        if (active) {
          setIsShippingLoading(false);
        }
      }
    };

    void calculateShipping();

    return () => {
      active = false;
    };
  }, [cart, selectedPricingId]);

  const deliveryCost = deliveryPrice321 ?? null;
  const subtotal = Math.round(adjustedTotalPrice);
  const chargedDeliveryCost = deliveryCost ?? 0;
  const extraWeightTotal =
    (shippingBreakdown?.extraWeightShipments ?? 0) > 0
      ? (shippingBreakdown?.extraWeightTotalPrice ?? 0)
      : 0;
  const total = cart ? subtotal + chargedDeliveryCost + extraWeightTotal : 0;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!cart || cart.items.length === 0) {
      setSubmitError("Korpa je prazna. Dodajte artikle pre slanja porudžbine.");
      return;
    }

    if (!selectedPricing || !selectedPricingId) {
      setSubmitError("Izaberite mesto dostave.");
      return;
    }

    if (deliveryCost === null) {
      setSubmitError("Izaberite adresu za dostavu.");
      return;
    }

    if (!selectedDeliveryAddress) {
      setSubmitError("Izaberite adresu za dostavu iz liste.");
      return;
    }

    if (!addressNumber.trim()) {
      setSubmitError("Unesite broj ulice za dostavu.");
      return;
    }

    const deliveryAddressLine = `${selectedDeliveryAddress.name} ${addressNumber.trim()}`;
    const deliveryComment = [
      data.note || null,
      `Sprat: ${data.sprat || "/"}`,
      shippingBreakdown
        ? `Tezina: ${shippingBreakdown.totalWeightNumber} ${shippingBreakdown.totalWeightUnit}`
        : null,
    ]
      .filter(Boolean)
      .join(" | ");

    setSubmitError("");
    setIsSubmitting(true);
    let checkoutTimeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      // -----------------------------------------------------------------------
      // Card payment: redirect to VPOS
      // -----------------------------------------------------------------------
      if (data.paymentMethod === "card_payment") {
        const cardPayload = {
          ...buildCheckoutPayload({
            formData: data,
            address: deliveryAddressLine,
            city: selectedPricing.name,
            cart,
            subtotal,
            deliveryCost: chargedDeliveryCost,
            total,
            shippingBreakdown,
            fieldCode: selectedPricing.fieldCode,
          }),
          deliveryAddressId: selectedDeliveryAddress.id,
          deliveryAddressNumber: addressNumber.trim(),
          deliveryComment,
        };

        const response = await fetch("/api/checkout/init-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardPayload),
        });

        const result = (await response.json()) as {
          vposUrl?: string;
          params?: Record<string, string>;
          error?: string;
        };

        if (!response.ok || !result.vposUrl || !result.params) {
          setSubmitError(
            result.error ||
              "Došlo je do greške pri pokretanju plaćanja karticom.",
          );
          return;
        }

        setIsVposRedirecting(true);
        redirectToVpos(result.vposUrl, result.params);
        return;
      }

      // -----------------------------------------------------------------------
      // Cash / bank transfer: existing flow
      // -----------------------------------------------------------------------
      const payload = buildCheckoutPayload({
        formData: data,
        address: deliveryAddressLine,
        city: selectedPricing.name,
        cart,
        subtotal,
        deliveryCost: chargedDeliveryCost,
        total,
        shippingBreakdown,
        fieldCode: selectedPricing.fieldCode,
      });

      const controller = new AbortController();
      checkoutTimeoutId = globalThis.setTimeout(
        () => controller.abort(),
        90000,
      );

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as CheckoutSuccessResponse;

      if (!response.ok || !result.orderNumber || !result.orderId) {
        setSubmitError(
          result.error || "Došlo je do greške prilikom slanja porudžbine.",
        );
        return;
      }

      // Send delivery order to 321
      const deliveryPayload = {
        addressId: selectedDeliveryAddress.id,
        addressNumber: addressNumber.trim(),
        customerPhoneNumber: data.phone,
        comment: deliveryComment,
        preparationTime: 15,
        orderPrice: total,
      };

      const deliveryResponse = await fetch("/api/checkout/delivery-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryPayload),
      });

      if (!deliveryResponse.ok) {
        console.warn(
          "[321 delivery] Failed to submit delivery order:",
          deliveryResponse.status,
        );
      }

      router.push(
        buildSuccessUrl({
          orderNumber: result.orderNumber,
          orderId: result.orderId,
          paymentMethod: result.paymentMethod ?? data.paymentMethod,
          warrantUrl: result.warrantUrl,
          warrantFileName: result.warrantFileName,
        }),
      );
    } catch (error) {
      console.error("Checkout submit error:", error);
      if (error instanceof Error && error.name === "AbortError") {
        setSubmitError(
          "Zahtev je istekao. Porudžbina je možda kreirana, proverite email ili pokušajte ponovo za minut.",
        );
      } else {
        setSubmitError("Došlo je do greške prilikom slanja porudžbine.");
      }
    } finally {
      if (checkoutTimeoutId !== null) {
        globalThis.clearTimeout(checkoutTimeoutId);
      }
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen pt-20 pb-10 md:pt-24 md:pb-12">
        <div className="mx-auto flex max-w-frame flex-col items-center justify-center px-4 text-center text-black/80 xl:px-0">
          <TbBasketExclamation strokeWidth={1} className="text-8xl" />
          <p className="mb-8 mt-4">Vaša korpa je trenutno prazna.</p>
          <Link href="/prodavnica">
            <Button className="mx-auto block max-w-52">
              Vrati se u prodavnicu
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        <SectionTitle
          title="Vaša porudžbina"
          description="Dostava se vrši isključivo na teritoriji Novog Sada i okoline."
          noAnimation
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_430px]"
        >
          <div className="space-y-10 md:space-y-12 flex flex-col justify-center mb-4 md:mb-0">
            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            ) : null}

            <div className="border border-black/15 rounded-[20px] p-5 md:p-8 relative">
              <h6 className="text-xl md:text-2xl font-bold text-black mb-0.5 md:mb-1">
                Podaci za dostavu
              </h6>
              <p className="text-xs text-black/50 absolute top-6 right-6 md:top-10 md:right-10">
                *obavezna polja
              </p>

              <p className="text-base leading-relaxed text-black/80 font-light md:text-lg mb-1 md:mb-2">
                Molimo popunite sve neophodne podatke za dostavu Vaše
                porudžbine.
              </p>
              <div className="mt-6 space-y-4">
                {/* Row 1: Ime i prezime | Email */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="Ime i prezime / Naziv preduzeća*"
                      className={cn(
                        "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                        errors.fullName && "border-red-500",
                      )}
                      {...register("fullName", { required: true })}
                    />
                  </InputGroup>
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="email"
                      placeholder="E-mail *"
                      className={cn(
                        "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                        errors.email && "border-red-500",
                      )}
                      {...register("email", { required: true })}
                    />
                  </InputGroup>
                </div>

                {/* Row 2: Broj telefona | Ulica za dostavu */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="Broj telefona *"
                      className={cn(
                        "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                        errors.phone && "border-red-500",
                      )}
                      {...register("phone", { required: true })}
                    />
                  </InputGroup>

                  {/* 321 delivery address combobox */}
                  <div className="relative" ref={addressComboboxRef}>
                    <InputGroup className="pl-0">
                      <InputGroup.Input
                        type="text"
                        placeholder={
                          isAddressesLoading
                            ? "Učitavanje adresa..."
                            : "Naziv ulice / Naziv mesta *"
                        }
                        autoComplete="off"
                        disabled={isAddressesLoading}
                        value={addressSearch}
                        className={cn(
                          "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                          !selectedDeliveryAddress &&
                            addressSearch.length > 0 &&
                            "border-orange-400",
                        )}
                        onChange={(e) => {
                          setAddressSearch(e.target.value);
                          setSelectedDeliveryAddress(null);
                          setDeliveryPrice321(null);
                          setValue("shippingPrice", "");
                          setAddressPricingError("");
                          setIsAddressDropdownOpen(true);
                        }}
                        onFocus={() => setIsAddressDropdownOpen(true)}
                      />
                    </InputGroup>
                    {isAddressDropdownOpen && !selectedDeliveryAddress && (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
                        {addressSearch.trim().length < 2 ? (
                          <p className="px-5 py-3 text-sm text-gray-400">
                            Ukucajte najmanje 2 slova za pretragu ulice...
                          </p>
                        ) : filteredAddresses.length === 0 ? (
                          <p className="px-5 py-3 text-sm text-gray-400">
                            Nema rezultata za &ldquo;{addressSearch}&rdquo;
                          </p>
                        ) : (
                          filteredAddresses.map((addr) => (
                            <button
                              key={addr.id}
                              type="button"
                              className="w-full px-5 py-3 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSelectedDeliveryAddress(addr);
                                setDeliveryPrice321(addr.price);
                                setValue("shippingPrice", String(addr.price));
                                setAddressSearch(`${addr.name}, ${addr.city}`);
                                setIsAddressDropdownOpen(false);
                                const matched = pricingOptions.find(
                                  (o) =>
                                    o.name.toLowerCase() ===
                                    addr.city.toLowerCase(),
                                );
                                if (matched) {
                                  setValue(
                                    "cenovnikTermId",
                                    String(matched.id),
                                  );
                                  setAddressPricingError("");
                                } else {
                                  setAddressPricingError(
                                    `Nema cenovnika za kvart "${addr.neighborhood}". Kontaktirajte nas.`,
                                  );
                                }
                              }}
                            >
                              <span className="font-medium">{addr.name}</span>
                              <span className="ml-1 text-gray-500">
                                {addr.city}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                    {addressPricingError ? (
                      <p className="mt-1 px-2 text-xs text-red-600">
                        {addressPricingError}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Row 3: Broj ulice | Poštanski broj */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="Broj / Naziv ulice i broj (okolna mesta) *"
                      maxLength={5}
                      value={addressNumber}
                      onChange={(e) => setAddressNumber(e.target.value)}
                      className="bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base"
                    />
                  </InputGroup>
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="Poštanski broj"
                      className="bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base"
                      {...register("postalCode")}
                    />
                  </InputGroup>
                </div>

                {/* Row 4: Sprat | Broj stana */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="Sprat"
                      className="bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base"
                      {...register("sprat")}
                    />
                  </InputGroup>
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="Broj stana"
                      className="bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base"
                      {...register("brojStana")}
                    />
                  </InputGroup>
                </div>

                {/* Row 5: PIB | MB */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="PIB (samo za pravna lica)"
                      inputMode="numeric"
                      maxLength={9}
                      className="bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base"
                      {...register("pib")}
                    />
                  </InputGroup>
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="MB (samo za pravna lica)"
                      inputMode="numeric"
                      maxLength={8}
                      className="bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base"
                      {...register("mb")}
                    />
                  </InputGroup>
                </div>

                {pricingError ? (
                  <p className="text-xs text-red-600">{pricingError}</p>
                ) : null}
              </div>
            </div>

            <div className="border border-black/15 rounded-[20px] p-5 md:p-8">
              <h6 className="text-xl md:text-2xl font-bold text-black mb-0.5 md:mb-1">
                Izaberite način plaćanja
              </h6>

              <div className="mt-3 space-y-3">
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-4 rounded-4xl border border-transparent bg-white px-5 py-5 transition-colors",
                    paymentMethod === "cash_on_delivery" &&
                      "bg-section border-black/15",
                  )}
                >
                  <input
                    type="radio"
                    value="cash_on_delivery"
                    className="mt-1 h-5 w-5 accent-brand"
                    {...register("paymentMethod")}
                  />
                  <span>
                    <span className="block text-md font-semibold text-black/80 md:text-xl">
                      Plaćanje pouzećem
                    </span>
                    <span className="mt-1 block text-base font-light text-black/80">
                      Plaćanje kuriru prilikom preuzimanja pošiljke
                    </span>
                  </span>
                </label>

                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-4 rounded-4xl border border-transparent bg-white px-5 py-5 transition-colors",
                    paymentMethod === "bank_transfer" &&
                      "border-black/15 bg-section",
                  )}
                >
                  <input
                    type="radio"
                    value="bank_transfer"
                    className="mt-1 h-5 w-5 accent-brand"
                    {...register("paymentMethod")}
                  />
                  <span>
                    <span className="block text-md font-semibold text-black/80 md:text-xl">
                      Plaćanje preko računa
                    </span>
                    <span className="mt-1 block text-base font-light text-black/80">
                      Uplatom na tekući račun prodavca
                    </span>
                  </span>
                </label>

                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-4 rounded-4xl border border-transparent bg-white px-5 py-5 transition-colors",
                    paymentMethod === "card_payment" &&
                      "border-black/15 bg-section",
                  )}
                >
                  <input
                    type="radio"
                    value="card_payment"
                    className="mt-1 h-5 w-5 accent-brand"
                    {...register("paymentMethod")}
                  />
                  <span>
                    <span className="block text-md font-semibold text-black/80 md:text-xl">
                      Plaćanje platnom karticom
                    </span>
                    <span className="mt-1 block text-base font-light text-black/80">
                      Visa, Mastercard, Dina — sigurno plaćanje putem VPOS
                      sistema
                    </span>
                  </span>
                </label>
              </div>

              <div className="mt-5">
                <Textarea
                  placeholder="Napomena (opciono)"
                  className="bg-section min-h-37.5 resize-none rounded-4xl border border-gray-300 p-4 px-6 placeholder:text-base"
                  {...register("note")}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isShippingLoading || isVposRedirecting}
              className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-10 py-4 m-auto text-base font-medium uppercase text-black/80 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 md:h-15 md:text-lg"
            >
              {isVposRedirecting
                ? "Preusmeravanje na stranicu za plaćanje..."
                : submitButtonLabel(isSubmitting, paymentMethod)}
            </button>
          </div>

          <aside className="h-fit rounded-[20px] border border-black/15 p-5 md:px-6 md:py-6 lg:sticky lg:top-40">
            <h6 className="text-xl md:text-2xl font-bold text-black">
              Pregled porudžbine
            </h6>

            <div className="mt-6 flex flex-col space-y-5 md:space-y-6">
              {cart.items.map((item) => (
                <div key={`${item.id}-${item.attributes.join("-")}`}>
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base md:text-lg font-semibold max-w-64 leading-snug text-black/80">
                      {item.name}
                    </h4>
                    <p className="shrink-0 text-base md:text-lg  font-semibold text-black/80">
                      {formatPrice(item.price)}{" "}
                      <span className="text-sm">RSD</span>
                    </p>
                  </div>
                  <p className="text-base md:text-lg text-black/60">
                    Količina: {item.quantity}
                  </p>
                </div>
              ))}

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-lg text-black/60">
                    Broj artikala
                  </span>
                  <span className="text-base md:text-lg font-semibold text-black/80">
                    {cart.totalQuantities}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-lg text-black/60">
                    Međuzbir
                  </span>
                  <span className="text-base md:text-lg font-semibold text-black/80">
                    {formatPrice(subtotal)} <span className="text-sm">RSD</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-lg text-black/60">
                    {selectedDeliveryAddress
                      ? `Dostava (${selectedDeliveryAddress.city})`
                      : "Dostava"}
                  </span>
                  {deliveryPrice321 === null ? (
                    <span className="text-base md:text-lg font-semibold text-black/80">
                      Odaberite mesto
                    </span>
                  ) : (
                    <span className="text-base md:text-lg font-semibold text-black/80">
                      {formatPrice(deliveryPrice321)} RSD
                    </span>
                  )}
                </div>

                {shippingBreakdown ? (
                  <>
                    {shippingBreakdown.extraWeightShipments > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-lg text-black/60">
                          Dodatna težina (
                          {shippingBreakdown.extraWeightShipments} ×{" "}
                          {formatPrice(shippingBreakdown.extraWeightUnitPrice)}{" "}
                          RSD)
                        </span>
                        <span className="text-base md:text-lg font-semibold text-black/80">
                          {formatPrice(shippingBreakdown.extraWeightTotalPrice)}{" "}
                          RSD
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-base md:text-lg text-black/60">
                        Težina pošiljke
                      </span>
                      <span className="text-base md:text-lg font-semibold text-black/80">
                        {shippingBreakdown.totalWeightNumber}{" "}
                        {shippingBreakdown.totalWeightUnit}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="h-px bg-black/15" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-base md:text-lg text-black/60">
                  Ukupno
                </span>
                <div className="text-right leading-tight">
                  <p className="text-xl md:text-2xl font-bold text-black/90">
                    {formatPrice(total)} <span className="text-sm">RSD</span>
                  </p>
                  <p className="text-xs italic text-black/60 md:text-sm">
                    * PDV uračunat u cenu
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="h-px bg-black/15 mt-2" />
              <Link
                href="/cenovnik-dostave"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
              >
                Pogledajte cenovnik dostave →
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
