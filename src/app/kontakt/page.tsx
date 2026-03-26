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
    <section className="max-w-frame mx-auto px-4 xl:px-0 relative pt-20 pb-10 md:pt-26 md:pb-12 flex flex-col items-center text-center">
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
        className="pt-10 w-full max-w-2xl space-y-8"
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

        <div className="flex gap-8 md:gap-6 flex-col md:flex-row relative">
          <InputGroup className="pl-0">
            <InputGroup.Input
              type="text"
              placeholder="Unesite vaše ime i prezime"
              className="bg-section border border-gray-300 rounded-full p-4 px-6 placeholder:text-base"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs absolute left-6 -bottom-5">
                {errors.fullName.message}
              </p>
            )}
          </InputGroup>
          <InputGroup className="pl-0 relative">
            <InputGroup.Input
              type="email"
              placeholder="Unesite vaš e-mail"
              className="bg-section border border-gray-300 rounded-full p-4 px-6 placeholder:text-base"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs absolute left-6 -bottom-5">
                {errors.email.message}
              </p>
            )}
          </InputGroup>
        </div>

        <div className="space-y-1 relative">
          <InputGroup className="pl-0">
            <InputGroup.Input
              type="text"
              placeholder="Unesite naslov poruke"
              className="bg-section border border-gray-300 rounded-full p-4 px-6 placeholder:text-base"
              {...register("subject")}
            />
          </InputGroup>
          {errors.subject && (
            <p className="text-red-500 text-xs absolute left-6 -bottom-5">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div className="space-y-1 relative">
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-section border shadow-none border-gray-300 rounded-full h-auto p-4 px-6 text-base text-black/80 font-light data-placeholder:text-black/40 w-full focus:ring-1 focus:ring-ring">
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
          {errors.reason && (
            <p className="text-red-500 text-xs absolute left-6 -bottom-5">
              {errors.reason.message}
            </p>
          )}
        </div>

        <div className="space-y-1 relative">
          <Textarea
            placeholder="Unesite vašu poruku ovde"
            className="bg-section border border-gray-300 rounded-4xl p-4 px-6 placeholder:text-base min-h-37.5 resize-none"
            {...register("message")}
          />
          {errors.message && (
            <p className="text-red-500 text-xs absolute left-6 -bottom-5">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button type="submit" className="mx-auto block" disabled={isSubmitting}>
          {isSubmitting ? "Šaljem..." : "Pošalji"}
        </Button>
      </motion.form>
    </section>
  );
};

export default KontaktPage;
