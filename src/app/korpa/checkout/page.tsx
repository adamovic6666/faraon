"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import SectionTitle from "@/components/common/SectionTitle";
import InputGroup from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import { formatPrice } from "@/utils/format-price";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TbBasketExclamation } from "react-icons/tb";
import { useRouter, useSearchParams } from "next/navigation";

type CheckoutFormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  paymentMethod: "cash_on_delivery" | "bank_transfer";
  pib: string;
  mb: string;
  note: string;
  cenovnikTermId: string;
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

type CheckoutSubmitPayload = Omit<CheckoutFormValues, "cenovnikTermId"> & {
  city: string;
  cenovnikTermId: number;
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
  city,
  cart,
  subtotal,
  deliveryCost,
  total,
  shippingBreakdown,
  fieldCode,
}: {
  formData: CheckoutFormValues;
  city: string;
  cart: NonNullable<RootState["carts"]["cart"]>;
  subtotal: number;
  deliveryCost: number;
  total: number;
  shippingBreakdown: ShippingBreakdown;
  fieldCode: string;
}): CheckoutSubmitPayload => ({
  ...formData,
  city,
  cenovnikTermId: Number(formData.cenovnikTermId),
  orderItems: buildOrderItems(cart.items),
  subtotal: String(subtotal),
  deliveryCost: String(deliveryCost),
  total: String(total),
  itemCount: cart.totalQuantities,
  shippingFieldCode: fieldCode,
  shippingBasePrice: String(shippingBreakdown.shippingBasePrice),
  extraWeightShipments: shippingBreakdown.extraWeightShipments,
  extraWeightUnitPrice: String(shippingBreakdown.extraWeightUnitPrice),
  extraWeightTotalPrice: String(shippingBreakdown.extraWeightTotalPrice),
  totalWeight: `${shippingBreakdown.totalWeightNumber} ${shippingBreakdown.totalWeightUnit}`,
});

const CheckoutPage = () => {
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([]);
  const [pricingError, setPricingError] = useState("");
  const [isPricingLoading, setIsPricingLoading] = useState(true);
  const [shippingBreakdown, setShippingBreakdown] =
    useState<ShippingBreakdown | null>(null);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cart, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts,
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      paymentMethod: "cash_on_delivery",
      pib: "",
      mb: "",
      note: "",
      cenovnikTermId: "",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const selectedPricingId = watch("cenovnikTermId");

  useEffect(() => {
    const queryPricingId = searchParams.get("cenovnikTermId")?.trim();
    if (!queryPricingId) return;

    setValue("cenovnikTermId", queryPricingId, { shouldDirty: false });
  }, [searchParams, setValue]);

  const selectedPricing = useMemo(
    () =>
      pricingOptions.find((option) => String(option.id) === selectedPricingId),
    [pricingOptions, selectedPricingId],
  );

  useEffect(() => {
    let mounted = true;

    const loadPricing = async () => {
      setIsPricingLoading(true);
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
      } finally {
        if (mounted) {
          setIsPricingLoading(false);
        }
      }
    };

    void loadPricing();

    return () => {
      mounted = false;
    };
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

  const deliveryCost = shippingBreakdown?.totalShippingPrice ?? null;
  const subtotal = Math.round(adjustedTotalPrice);
  const total = cart ? subtotal + (deliveryCost ?? 0) : 0;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!cart || cart.items.length === 0) {
      setSubmitError("Korpa je prazna. Dodajte artikle pre slanja porudžbine.");
      return;
    }

    if (!selectedPricing || !selectedPricingId) {
      setSubmitError("Izaberite mesto dostave.");
      return;
    }

    if (deliveryCost === null || isShippingLoading || !shippingBreakdown) {
      setSubmitError("Sačekajte obračun cene dostave.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    let checkoutTimeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      const payload = buildCheckoutPayload({
        formData: data,
        city: selectedPricing.name,
        cart,
        subtotal,
        deliveryCost,
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
        <SectionTitle title="Vaša porudžbina" noAnimation />

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

                <InputGroup className="pl-0">
                  <InputGroup.Input
                    type="text"
                    placeholder="Adresa *"
                    className={cn(
                      "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                      errors.address && "border-red-500",
                    )}
                    {...register("address", { required: true })}
                  />
                </InputGroup>

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

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <div>
                    <Controller
                      name="cenovnikTermId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPricingLoading}
                        >
                          <SelectTrigger
                            className={cn(
                              "bg-section h-auto w-full rounded-full border border-gray-300 p-4 px-6 text-base font-light text-black/80 shadow-none data-placeholder:text-black/40 focus:ring-1 focus:ring-black/20",
                              errors.cenovnikTermId && "border-red-500",
                            )}
                          >
                            <SelectValue
                              placeholder={
                                isPricingLoading
                                  ? "Učitavanje mesta..."
                                  : "Mesto dostave *"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {pricingOptions.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.id)}
                              >
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {pricingError ? (
                      <p className="mt-1 text-xs text-red-600">
                        {pricingError}
                      </p>
                    ) : null}
                  </div>

                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="Poštanski broj *"
                      className={cn(
                        "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                        errors.postalCode && "border-red-500",
                      )}
                      {...register("postalCode", { required: true })}
                    />
                  </InputGroup>
                </div>
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
              disabled={isSubmitting || isShippingLoading}
              className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-10 py-4 m-auto text-base font-medium uppercase text-black/80 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 md:h-15 md:text-lg"
            >
              {isSubmitting ? "Slanje..." : "Potvrdi porudžbinu"}
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
                    {selectedPricing && !isShippingLoading
                      ? `Dostava (${selectedPricing.name})`
                      : "Dostava"}
                  </span>
                  <span className="text-base md:text-lg font-semibold text-black/80">
                    {isShippingLoading
                      ? "Računanje..."
                      : shippingBreakdown
                        ? `${formatPrice(shippingBreakdown.shippingBasePrice)} RSD`
                        : "Odaberite mesto"}
                  </span>
                </div>
                {shippingBreakdown &&
                shippingBreakdown.extraWeightShipments > 0 ? (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-base md:text-lg text-black/60">
                      Dostava dodatni kg{" "}
                      <span className="text-sm">
                        ({shippingBreakdown.extraWeightShipments} ×{" "}
                        {formatPrice(shippingBreakdown.extraWeightUnitPrice)}{" "}
                        RSD)
                      </span>
                    </span>
                    <span className="shrink-0 text-base md:text-lg font-semibold text-black/80">
                      {formatPrice(shippingBreakdown.extraWeightTotalPrice)} RSD
                    </span>
                  </div>
                ) : null}
                {shippingBreakdown ? (
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg text-black/60">
                      Težina pošiljke
                    </span>
                    <span className="text-base md:text-lg font-semibold text-black/80">
                      {shippingBreakdown.totalWeightNumber}{" "}
                      {shippingBreakdown.totalWeightUnit}
                    </span>
                  </div>
                ) : null}
                {shippingError ? (
                  <p className="text-xs text-red-600">{shippingError}</p>
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
