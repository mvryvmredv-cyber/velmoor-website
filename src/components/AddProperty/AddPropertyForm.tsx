"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ImageUploader from "@/components/AddProperty/ImageUploader";
import VideoUploader from "@/components/AddProperty/VideoUploader";

type FormData = {
  name: string;
  phone: string;
  property_type: string;
  location: string;
  price: string;
  area: string;
  rooms: string;
  bathrooms: string;
  floor: string;
  finishing: string;
  view: string;
  direction: string;

  payment_method: string;
  down_payment: string;
  installment_duration: string;
  installment_amount: string;
  payment_frequency: string;
  additional_payments: string;
  installment_details: string;

  has_elevator: boolean;
  has_garage: boolean;
  furnished: boolean;
  negotiable: boolean;

  description: string;
  notes: string;
  video: string;
};

const initialFormData: FormData = {
  video: "",
  name: "",
  phone: "",
  property_type: "",
  location: "",
  price: "",
  area: "",
  rooms: "",
  bathrooms: "",
  floor: "",
  finishing: "",
  view: "",
  direction: "",

  payment_method: "",
  down_payment: "",
  installment_duration: "",
  installment_amount: "",
  payment_frequency: "",
  additional_payments: "",
  installment_details: "",

  has_elevator: false,
  has_garage: false,
  furnished: false,
  negotiable: false,

  description: "",
  notes: "",
};

export default function AddPropertyForm() {
  const t = useTranslations("addProperty.form");

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [resetUploaders, setResetUploaders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= PROPERTY TYPE ================= */

  const isResidential =
    formData.property_type === "apartment" ||
    formData.property_type === "villa";

  const isShop = formData.property_type === "shop";
  const isOffice = formData.property_type === "office";
  const isLand = formData.property_type === "land";

  /* ================= PRICE ================= */

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/,/g, "");

    if (!/^\d*$/.test(rawValue)) return;

    const formattedValue =
      rawValue === "" ? "" : Number(rawValue).toLocaleString("en-US");

    setFormData((current) => ({
      ...current,
      price: formattedValue,
    }));
  };

  /* ================= GENERAL CHANGE ================= */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  };

  /* ================= PROPERTY TYPE CHANGE ================= */

  const handlePropertyTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,

      property_type: value,

      // تنظيف التفاصيل الخاصة بالنوع السابق
      rooms: "",
      bathrooms: "",
      floor: "",
      finishing: "",
      view: "",
      direction: "",

      has_elevator: false,
      has_garage: false,
      furnished: false,
    }));
  };

  /* ================= PAYMENT ================= */

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      payment_method: value,

      // لو اختار كاش نمسح تفاصيل التقسيط
      ...(value === "cash"
        ? {
            down_payment: "",
            installment_duration: "",
            installment_amount: "",
            payment_frequency: "",
            additional_payments: "",
            installment_details: "",
          }
        : {}),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      /* OWNER */

      data.append("name", formData.name);
      data.append("phone", formData.phone);

      /* PROPERTY */

      data.append("property-type", formData.property_type);

      data.append("location", formData.location);

      data.append("price", formData.price.replace(/,/g, ""));

      data.append("area", formData.area);

      /* DETAILS */

      data.append("rooms", formData.rooms);
      data.append("bathrooms", formData.bathrooms);
      data.append("floor", formData.floor);
      data.append("finishing", formData.finishing);
      data.append("view", formData.view);
      data.append("direction", formData.direction);

      /* PAYMENT */

      data.append("payment_method", formData.payment_method);

      data.append("down_payment", formData.down_payment);

      data.append("installment_duration", formData.installment_duration);

      data.append("installment_amount", formData.installment_amount);

      data.append("payment_frequency", formData.payment_frequency);

      data.append("additional_payments", formData.additional_payments);

      data.append("installment_details", formData.installment_details);

      /* FEATURES */

      data.append("has_elevator", String(formData.has_elevator));

      data.append("has_garage", String(formData.has_garage));

      data.append("furnished", String(formData.furnished));

      data.append("negotiable", String(formData.negotiable));

      /* MARKETING */

      data.append("description", formData.description);

      data.append("notes", formData.notes);
      /* IMAGES */

      images.forEach((image) => {
        data.append("images", image);
      });
      /* VIDEO */
      if (video) {
        data.append("video", video);
      }

      /* API */

      const response = await fetch("/api/properties", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setMessage(t("success"));

      setFormData({
        ...initialFormData,
      });

      setImages([]);
      setVideo(null);
      setResetUploaders(true);

      setTimeout(() => {
        setResetUploaders(false);
      }, 100);
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error ? error.message : "Failed to add property.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ================= OWNER INFORMATION ================= */}

      <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1b3255] dark:text-white">
            {t("ownerInformation")}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("ownerDescription")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              {t("ownerName")}
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t("ownerNamePlaceholder")}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1b3255]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              {t("phoneNumber")}
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder={t("phonePlaceholder")}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1b3255]"
            />
          </div>
        </div>
      </section>

      {/* ================= PROPERTY INFORMATION ================= */}

      <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1b3255] dark:text-white">
            {t("propertyInformation")}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("propertyDescription")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* PROPERTY TYPE */}

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              {t("propertyType")}
            </label>

            <select
              name="property-type"
              value={formData.property_type}
              onChange={handlePropertyTypeChange}
              required
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1b3255]"
            >
              <option value="" disabled>
                {t("selectPropertyType")}
              </option>

              <option value="apartment">{t("apartment")}</option>

              <option value="villa">{t("villa")}</option>

              <option value="shop">{t("shop")}</option>

              <option value="office">{t("office")}</option>

              <option value="land">{t("land")}</option>
            </select>
          </div>

          {/* LOCATION */}

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              {t("location")}
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder={t("locationPlaceholder")}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
            />
          </div>

          {/* PRICE */}

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              {t("price")}
            </label>

            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handlePriceChange}
              placeholder={t("pricePlaceholder")}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1b3255]"
            />
          </div>

          {/* AREA */}

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              {t("area")}
            </label>

            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              min="0"
              placeholder={t("areaPlaceholder")}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
            />
          </div>
        </div>
      </section>

      {/* ================= PROPERTY DETAILS ================= */}
      {formData.property_type && (
        <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1b3255] dark:text-white">
              {t("propertyDetails")}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("propertyDetailsDescription")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* ================= APARTMENT / VILLA ================= */}

            {isResidential && (
              <>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  min="0"
                  placeholder={t("bedroomsPlaceholder")}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
                />

                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  placeholder={t("bathroomsPlaceholder")}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
                />

                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  min="0"
                  placeholder={t("floorPlaceholder")}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
                />

                <select
                  name="finishing"
                  value={formData.finishing}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
                >
                  <option value="">{t("selectFinishing")}</option>

                  <option value="fully_finished">{t("fullyFinished")}</option>

                  <option value="semi_finished">{t("semiFinished")}</option>

                  <option value="unfinished">{t("unfinished")}</option>

                  <option value="core_and_shell">{t("coreAndShell")}</option>
                </select>

                <input
                  type="text"
                  name="view"
                  value={formData.view}
                  onChange={handleChange}
                  placeholder={t("viewPlaceholder")}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
                />

                <select
                  name="direction"
                  value={formData.direction}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
                >
                  <option value="">{t("selectDirection")}</option>

                  <option value="north">{t("north")}</option>

                  <option value="south">{t("south")}</option>

                  <option value="east">{t("east")}</option>

                  <option value="west">{t("west")}</option>

                  <option value="northeast">{t("northEast")}</option>

                  <option value="northwest">{t("northWest")}</option>

                  <option value="southeast">{t("southEast")}</option>

                  <option value="southwest">{t("southWest")}</option>
                </select>
              </>
            )}

            {/* ================= SHOP ================= */}

            {isShop && (
              <>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  min="0"
                  placeholder={t("floorPlaceholder")}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
                />
              </>
            )}

            {/* ================= OFFICE ================= */}

            {isOffice && (
              <>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  min="0"
                  placeholder={t("floorPlaceholder")}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
                />
              </>
            )}

            {/* ================= LAND ================= */}

            {isLand && <></>}
          </div>
        </section>
      )}

      {/* ================= PAYMENT ================= */}

      <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1b3255] dark:text-white">
            {t("paymentInformation")}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("paymentDescription")}
          </p>
        </div>

        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
          {t("paymentMethod")}
        </label>

        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handlePaymentMethodChange}
          required
          className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none"
        >
          <option value="" disabled>
            {t("selectPaymentMethod")}
          </option>

          <option value="cash">{t("cash")}</option>

          <option value="installments">{t("installments")}</option>
        </select>

        {formData.payment_method === "installments" && (
          <div className="mt-6 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 p-6">
            <h3 className="text-lg font-bold text-[#1b3255] dark:text-white mb-5">
              {t("installmentDetails")}
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="number"
                name="down_payment"
                value={formData.down_payment}
                onChange={handleChange}
                placeholder={t("downPayment")}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 outline-none"
              />

              <input
                type="text"
                name="installment_duration"
                value={formData.installment_duration}
                onChange={handleChange}
                placeholder={t("duration")}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 outline-none"
              />

              <input
                type="number"
                name="installment_amount"
                value={formData.installment_amount}
                onChange={handleChange}
                placeholder={t("installmentAmount")}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 outline-none"
              />

              <select
                name="payment_frequency"
                value={formData.payment_frequency}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 outline-none"
              >
                <option value="">{t("paymentFrequency")}</option>

                <option value="monthly">{t("monthly")}</option>

                <option value="quarterly">{t("quarterly")}</option>

                <option value="semi_annually">{t("semiAnnually")}</option>

                <option value="annually">{t("annually")}</option>
              </select>

              <input
                type="text"
                name="additional_payments"
                value={formData.additional_payments}
                onChange={handleChange}
                placeholder={t("additionalPayments")}
                className="md:col-span-2 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 outline-none"
              />

              <textarea
                name="installment_details"
                value={formData.installment_details}
                onChange={handleChange}
                rows={4}
                placeholder={t("otherInstallmentDetails")}
                className="md:col-span-2 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 outline-none resize-none"
              />
            </div>
          </div>
        )}
      </section>

      {/* ================= FEATURES ================= */}

      {formData.property_type && (
        <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1b3255] dark:text-white mb-6">
            {t("features")}
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Elevator */}

            {(isResidential || isOffice) && (
              <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_elevator"
                  checked={formData.has_elevator}
                  onChange={handleChange}
                  className="w-5 h-5"
                />

                <span>{t("elevator")}</span>
              </label>
            )}

            {/* Garage */}

            {(isResidential || isOffice || isShop) && (
              <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_garage"
                  checked={formData.has_garage}
                  onChange={handleChange}
                  className="w-5 h-5"
                />

                <span>{t("garage")}</span>
              </label>
            )}

            {/* Furnished */}

            {(isResidential || isOffice) && (
              <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="w-5 h-5"
                />

                <span>{t("furnished")}</span>
              </label>
            )}

            {/* Negotiable */}

            <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleChange}
                className="w-5 h-5"
              />

              <span>{t("negotiable")}</span>
            </label>
          </div>
        </section>
      )}

      {/* ================= MARKETING ================= */}

      <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1b3255] dark:text-white">
            {t("marketingDetails")}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("marketingDescription")}
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              {t("propertyDescriptionLabel")}
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder={t("propertyDescriptionPlaceholder")}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              {t("internalNotes")}
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder={t("internalNotesPlaceholder")}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 outline-none resize-none"
            />
          </div>
        </div>
      </section>

      {/* ================= IMAGES ================= */}

      <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1b3255] dark:text-white">
            {t("propertyImages")}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("imagesDescription")}
          </p>
        </div>

        <ImageUploader onImagesChange={setImages} reset={resetUploaders} />
      </section>

      {/* ================= VIDEO ================= */}

      <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1b3255] dark:text-white">
            {t("propertyVideo")}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("videoDescription")}
          </p>
        </div>

        <VideoUploader onVideoChange={setVideo} reset={resetUploaders} />
      </section>

      {/* ================= SUBMIT ================= */}

      <div className="flex flex-col items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto min-w-[220px] bg-[#1b3255] text-white px-10 py-4 rounded-xl font-semibold hover:bg-[#142844] transition disabled:opacity-50"
        >
          {loading ? t("sending") : t("submit")}
        </button>

        {message && (
          <p className="text-center text-sm font-medium text-[#1b3255] dark:text-white">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
