"use client";

import { useState } from "react";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";

type CheckoutFormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "cash_on_delivery" | "bank_transfer";
  customerType: "personal" | "business";
  pib: string;
  mb: string;
  note: string;
};

type CustomerTypeSectionProps = {
  customerType: CheckoutFormValues["customerType"];
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
};

const PIB_REGEX = /^\d{9}$/;
const MB_REGEX = /^\d{8}$/;

const CustomerTypeSection = ({
  customerType,
  register,
  errors,
}: CustomerTypeSectionProps) => (
  <>
    <div>
      <h6 className="text-lg md:text-xl font-bold text-black pt-4 md:pt-6 mb-3 md:mb-4">
        Tip kupca
      </h6>

      <div className="space-y-4">
        <label
          className={cn(
            "flex cursor-pointer items-start gap-4 rounded-[20px] border border-transparent bg-white px-5 py-5 transition-colors",
            customerType === "personal" && "bg-section border-black/15",
          )}
        >
          <input
            type="radio"
            value="personal"
            className="mt-1 h-5 w-5 accent-brand"
            {...register("customerType")}
          />
          <span className="block text-md font-semibold text-black/80 md:text-xl">
            Fizičko lice
          </span>
        </label>

        <label
          className={cn(
            "flex cursor-pointer items-start gap-4 rounded-[20px] border border-transparent bg-white px-5 py-5 transition-colors",
            customerType === "business" && "bg-section border-black/15",
          )}
        >
          <input
            type="radio"
            value="business"
            className="mt-1 h-5 w-5 accent-brand"
            {...register("customerType")}
          />
          <span className="block text-md font-semibold text-black/80 md:text-xl">
            Pravno lice
          </span>
        </label>
      </div>
    </div>

    {customerType === "business" ? (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <InputGroup className="pl-0">
          <InputGroup.Input
            type="text"
            placeholder="PIB *"
            inputMode="numeric"
            maxLength={9}
            className={cn(
              "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
              errors.pib && "border-red-500",
            )}
            {...register("pib", {
              validate: (value) =>
                customerType !== "business" ||
                PIB_REGEX.test(value.trim().replaceAll(" ", "")),
            })}
          />
        </InputGroup>

        <InputGroup className="pl-0">
          <InputGroup.Input
            type="text"
            placeholder="Matični broj *"
            inputMode="numeric"
            maxLength={8}
            className={cn(
              "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
              errors.mb && "border-red-500",
            )}
            {...register("mb", {
              validate: (value) =>
                customerType !== "business" ||
                MB_REGEX.test(value.trim().replaceAll(" ", "")),
            })}
          />
        </InputGroup>
      </div>
    ) : null}
  </>
);

const deliveryCost = 660;

const CheckoutPage = () => {
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { cart, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "cash_on_delivery",
      customerType: "personal",
      pib: "",
      mb: "",
      note: "",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const customerType = watch("customerType");
  const subtotal = Math.round(adjustedTotalPrice);
  const total = cart ? subtotal + deliveryCost : 0;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!cart || cart.items.length === 0) {
      setSubmitError("Korpa je prazna. Dodajte artikle pre slanja porudžbine.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        orderItems: cart.items.map((item) => {
          const unitPrice = Math.round(item.price);

          return {
            name: item.name,
            productCode: String(item.id),
            quantity: item.quantity,
            price: String(unitPrice),
            total: String(unitPrice * item.quantity),
          };
        }),
        subtotal: String(subtotal),
        deliveryCost: String(deliveryCost),
        total: String(total),
        itemCount: cart.totalQuantities,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        error?: string;
        orderNumber?: string;
      };

      if (!response.ok || !result.orderNumber) {
        setSubmitError(
          result.error || "Došlo je do greške prilikom slanja porudžbine.",
        );
        return;
      }

      router.push(
        `/korpa/checkout/uspesno?order=${encodeURIComponent(result.orderNumber)}`,
      );
    } catch (error) {
      console.error("Checkout submit error:", error);
      setSubmitError("Došlo je do greške prilikom slanja porudžbine.");
    } finally {
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

            <div className="border border-black/15 rounded-[20px] p-5 md:p-8">
              <h6 className="text-xl md:text-2xl font-bold text-black mb-0.5 md:mb-1">
                Podaci za dostavu
              </h6>
              <p className="text-base leading-relaxed text-black/80 font-light md:text-lg mb-1 md:mb-2">
                Molimo popunite sve neophodne podatke za dostavu Vaše
                porudžbine.
              </p>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <InputGroup className="pl-0">
                    <InputGroup.Input
                      type="text"
                      placeholder="Ime i prezime *"
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
                      placeholder="Grad *"
                      className={cn(
                        "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                        errors.city && "border-red-500",
                      )}
                      {...register("city", { required: true })}
                    />
                  </InputGroup>
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

                <CustomerTypeSection
                  customerType={customerType}
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            <div className="border border-black/15 rounded-[20px] p-5 md:p-8">
              <h6 className="text-xl md:text-2xl font-bold text-black mb-0.5 md:mb-1">
                Izaberite način plaćanja
              </h6>

              <div className="mt-5 space-y-5">
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-4 rounded-[20px] border border-transparent bg-white px-5 py-5 transition-colors",
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
                    "flex cursor-pointer items-start gap-4 rounded-[20px] border border-transparent bg-white px-5 py-5 transition-colors",
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
              disabled={isSubmitting}
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
                    Dostava
                  </span>
                  <span className="text-base md:text-lg font-semibold text-black/80">
                    {formatPrice(deliveryCost)}{" "}
                    <span className="text-sm">RSD</span>
                  </span>
                </div>
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
          </aside>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
