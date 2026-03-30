"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(1, "Ime i prezime su obavezni"),
  email: z
    .string()
    .min(1, "Email je obavezan")
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Email nije validan"),
  subject: z.string().min(1, "Naslov poruke je obavezan"),
  reason: z.string().min(1, "Izaberite razlog javljanja"),
  message: z.string().min(1, "Poruka je obavezna"),
});

type FormData = z.infer<typeof schema>;

const reasons = [
  "Pitanje u vezi sa cenom/akcijom",
  "Uslovi besplatne isporuke",
  "Informacije o povratnoj ambalaži",
  "Ponuda za saradnju",
  "Pohvale ili primedbe",
];

const KontaktPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      reason: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
      } else {
        setSubmitError(
          "Postoji problem prilikom slanja poruke. Molimo pokušajte ponovo.",
        );
      }
    } catch (error) {
      setSubmitError(
        "Postoji problem prilikom slanja poruke. Molimo pokušajte ponovo.",
      );
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-frame mx-auto px-4 xl:px-0 relative pt-20 pb-10 md:pt-24 md:pb-12 flex flex-col items-center text-center">
      <SectionTitle title="Pišite nam" />
      <motion.p
        initial={{ y: "60px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-black/80 text-md sm:text-lg leading-relaxed pt-2 font-light"
      >
        Faraon je tu za sva vaša pitanja.
      </motion.p>

      <motion.form
        initial={{ y: "60px", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-2xl flex-col gap-3 pt-10 md:gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {submitSuccess && (
          <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm border border-green-200">
            Vaša poruka je uspešno poslata! Hvala Vam što ste nas kontaktirali.
          </div>
        )}
        {submitError && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
            {submitError}
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <InputGroup className="pl-0">
            <InputGroup.Input
              type="text"
              placeholder="Unesite Vaše ime i prezime"
              className={cn(
                "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                errors.fullName && "border-red-500",
              )}
              {...register("fullName")}
            />
          </InputGroup>
          <InputGroup className="pl-0">
            <InputGroup.Input
              type="email"
              placeholder="Unesite Vaš e-mail"
              className={cn(
                "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                errors.email && "border-red-500",
              )}
              {...register("email")}
            />
          </InputGroup>
        </div>

        <div>
          <InputGroup className="pl-0">
            <InputGroup.Input
              type="text"
              placeholder="Unesite naslov poruke"
              className={cn(
                "bg-section rounded-full border border-gray-300 p-4 px-6 placeholder:text-base",
                errors.subject && "border-red-500",
              )}
              {...register("subject")}
            />
          </InputGroup>
        </div>

        <div>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    "bg-section h-auto w-full rounded-full border border-gray-300 p-4 px-6 text-base font-light text-black/80 shadow-none data-placeholder:text-black/40 focus:ring-1 focus:ring-ring",
                    errors.reason && "border-red-500",
                  )}
                >
                  <SelectValue placeholder="Izaberite razlog javljanja....." />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Textarea
            placeholder="Unesite Vašu poruku ovde"
            className={cn(
              "bg-section min-h-37.5 resize-none rounded-4xl border border-gray-300 p-4 px-6 placeholder:text-base",
              errors.message && "border-red-500",
            )}
            {...register("message")}
          />
        </div>

        <Button
          type="submit"
          className="mx-auto mt-6 md:mt-8 block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Šaljem..." : "Pošalji"}
        </Button>
      </motion.form>
    </section>
  );
};

export default KontaktPage;
