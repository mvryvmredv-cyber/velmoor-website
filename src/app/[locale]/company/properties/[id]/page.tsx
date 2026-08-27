import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { locale, id } = await params;

  const t = await getTranslations({
    locale,
    namespace: "propertyDetails",
  });

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  console.log("PROPERTY DATA:", property);

  const propertyType = property["property-type"];

  /* ================= IMAGES ================= */

  let images: string[] = [];

  try {
    if (Array.isArray(property.images)) {
      images = property.images;
    } else if (typeof property.images === "string") {
      const parsed = JSON.parse(property.images);

      if (Array.isArray(parsed)) {
        images = parsed;
      }
    }
  } catch {
    images = [];
  }

  /* ================= HELPERS ================= */

  const translateIfExists = (key: string, value: unknown): string | null => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const stringValue = String(value);

    return t.has(`${key}.${stringValue}`)
      ? t(`${key}.${stringValue}`)
      : stringValue;
  };

  const booleanValue = (value: unknown): boolean => {
    return value === true || value === "true";
  };

  const formatMoney = (value: unknown): string | null => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const number = Number(String(value).replace(/,/g, ""));

    if (Number.isNaN(number)) {
      return String(value);
    }

    return `${number.toLocaleString("en-US")} ${t("currency")}`;
  };

  /* ================= FORMATTED VALUES ================= */

  const formattedPrice = formatMoney(property.price);

  const formattedDownPayment = formatMoney(property.down_payment);

  const formattedInstallmentAmount = formatMoney(property.installment_amount);

  const finishing = translateIfExists("finishingTypes", property.finishing);

  const direction = translateIfExists("directions", property.direction);

  const status = translateIfExists("statuses", property.status);

  const propertyTypeName = translateIfExists("propertyTypes", propertyType);

  const paymentMethod =
    property.payment_method === "cash"
      ? t("paymentMethods.cash")
      : property.payment_method === "installments"
        ? t("paymentMethods.installments")
        : property.payment_method;

  const paymentFrequency = translateIfExists(
    "paymentFrequency",
    property.payment_frequency,
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-2">
            {t("title")}
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1b3255] dark:text-white">
                {propertyTypeName || t("property")}
              </h1>

              {property.location && (
                <p className="mt-3 text-gray-500 dark:text-gray-400">
                  📍 {property.location}
                </p>
              )}
            </div>

            {status && (
              <span className="inline-flex w-fit px-4 py-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-sm font-medium">
                {status}
              </span>
            )}
          </div>
        </div>

        {/* ================= IMAGES ================= */}

        {images.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800"
              >
                <div className="relative">
                  <img
                    src={image}
                    alt={`${t("imageAlt")} ${index + 1}`}
                    className="w-full h-72 md:h-80 object-cover"
                  />

                  <a
                    href={`/api/properties/download?url=${encodeURIComponent(image)}`}
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-[#1b3255] text-white px-4 py-3 text-sm font-semibold shadow-lg hover:bg-[#142844] transition"
                  >
                    ⬇️ {t("downloadImage")}
                  </a>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-gray-400 mb-10">
            {t("noImage")}
          </div>
        )}

        {/* ================= VIDEO ================= */}

        {property.video && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <h2 className="text-2xl font-bold text-[#1b3255] dark:text-white">
                {t("video")}
              </h2>

              <a
                href={`/api/properties/download?url=${encodeURIComponent(
                  property.video,
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b3255] text-white px-5 py-3 text-sm font-semibold hover:bg-[#142844] transition"
              >
                ⬇️ {t("downloadVideo")}
              </a>
            </div>

            <video
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-[600px] rounded-2xl bg-black"
              src={property.video}
            >
              Your browser does not support the video tag.
            </video>
          </section>
        )}

        {/* ================= BASIC PROPERTY INFORMATION ================= */}

        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-[#1b3255] dark:text-white mb-6">
            {t("propertyInformation")}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Info label={t("price")} value={formattedPrice} />

            <Info
              label={t("area")}
              value={
                property.area !== null && property.area !== undefined
                  ? `${property.area} م²`
                  : null
              }
            />

            <Info label={t("propertyType")} value={propertyTypeName} />

            <Info label={t("rooms")} value={property.rooms} />

            <Info label={t("bathrooms")} value={property.bathrooms} />

            <Info label={t("floor")} value={property.floor} />

            <Info label={t("finishing")} value={finishing} />

            <Info label={t("view")} value={property.view} />

            <Info label={t("direction")} value={direction} />

            <Info label={t("status")} value={status} />
          </div>
        </section>

        {/* ================= FEATURES ================= */}

        {(booleanValue(property.has_elevator) ||
          booleanValue(property.has_garage) ||
          booleanValue(property.furnished) ||
          booleanValue(property.negotiable)) && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-[#1b3255] dark:text-white mb-6">
              {t("features")}
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {booleanValue(property.has_elevator) && (
                <Feature label={t("elevator")} />
              )}

              {booleanValue(property.has_garage) && (
                <Feature label={t("garage")} />
              )}

              {booleanValue(property.furnished) && (
                <Feature label={t("furnished")} />
              )}

              {booleanValue(property.negotiable) && (
                <Feature label={t("negotiable")} />
              )}
            </div>
          </section>
        )}

        {/* ================= PAYMENT ================= */}

        {(property.payment_method ||
          property.down_payment !== null ||
          property.installment_duration ||
          property.installment_amount !== null ||
          property.payment_frequency ||
          property.additional_payments ||
          property.installment_details) && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-[#1b3255] dark:text-white mb-6">
              {t("paymentInformation")}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Info
                label={
                  t("paymentInformation") === "بيانات الدفع"
                    ? "دورية السداد"
                    : "Payment Frequency"
                }
                value={paymentFrequency}
              />

              <Info label={t("downPayment")} value={formattedDownPayment} />

              <Info
                label={t("installmentDuration")}
                value={property.installment_duration}
              />

              <Info
                label={t("installmentAmount")}
                value={formattedInstallmentAmount}
              />
              <Info
                label={t("paymentFrequencyLabel")}
                value={paymentFrequency}
              />
            </div>

            {property.additional_payments && (
              <div className="mt-5">
                <Info
                  label={t("additionalPayments")}
                  value={property.additional_payments}
                  full
                />
              </div>
            )}

            {property.installment_details && (
              <div className="mt-5">
                <Info
                  label={t("installmentDetails")}
                  value={property.installment_details}
                  full
                />
              </div>
            )}
          </section>
        )}

        {/* ================= OWNER ================= */}

        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-[#1b3255] dark:text-white mb-6">
            {t("ownerInformation")}
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Info label={t("ownerName")} value={property.name} />

            <Info label={t("phone")} value={property.phone} />
          </div>
        </section>

        {/* ================= DESCRIPTION ================= */}

        {property.description && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-[#1b3255] dark:text-white mb-4">
              {t("description")}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-8 whitespace-pre-line">
              {property.description}
            </p>
          </section>
        )}

        {/* ================= NOTES ================= */}

        {property.notes && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-[#1b3255] dark:text-white mb-4">
              {t("notes")}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-8 whitespace-pre-line">
              {property.notes}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

/* ================= INFO COMPONENT ================= */

function Info({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
  full?: boolean;
}) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === false
  ) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl bg-gray-50 dark:bg-slate-800 p-4 ${
        full ? "w-full" : ""
      }`}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>

      <p className="font-semibold text-[#1b3255] dark:text-white leading-7">
        {String(value)}
      </p>
    </div>
  );
}

/* ================= FEATURE COMPONENT ================= */

function Feature({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 dark:bg-slate-800 p-4">
      <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />

      <span className="font-medium text-[#1b3255] dark:text-white">
        {label}
      </span>
    </div>
  );
}
