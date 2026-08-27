import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import PropertyImagesEditor from "@/components/PropertyImagesEditor";
import PropertyVideoEditor from "@/components/PropertyVideoEditor";
type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function EditPropertyPage({ params }: Props) {
  const { locale, id } = await params;

  const t = await getTranslations({
    locale,
    namespace: "editProperty",
  });

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  async function updateProperty(formData: FormData) {
    "use server";

    const updatedProperty = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),

      "property-type": String(formData.get("property-type") || ""),

      location: String(formData.get("location") || ""),

      price: formData.get("price") ? Number(formData.get("price")) : null,

      area: formData.get("area") ? Number(formData.get("area")) : null,

      rooms: formData.get("rooms") ? Number(formData.get("rooms")) : null,

      bathrooms: formData.get("bathrooms")
        ? Number(formData.get("bathrooms"))
        : null,

      floor: formData.get("floor") ? Number(formData.get("floor")) : null,

      finishing: String(formData.get("finishing") || "") || null,

      view: String(formData.get("view") || "") || null,

      direction: String(formData.get("direction") || "") || null,

      has_elevator: formData.get("has_elevator") === "true",

      has_garage: formData.get("has_garage") === "true",

      furnished: formData.get("furnished") === "true",

      payment_method: String(formData.get("payment_method") || "") || null,

      down_payment: formData.get("down_payment")
        ? Number(formData.get("down_payment"))
        : null,

      installment_duration:
        String(formData.get("installment_duration") || "") || null,

      installment_amount: formData.get("installment_amount")
        ? Number(formData.get("installment_amount"))
        : null,

      payment_frequency:
        String(formData.get("payment_frequency") || "") || null,

      additional_payments:
        String(formData.get("additional_payments") || "") || null,

      installment_details:
        String(formData.get("installment_details") || "") || null,

      negotiable: formData.get("negotiable") === "true",

      description: String(formData.get("description") || ""),

      notes: String(formData.get("notes") || ""),

      status: String(formData.get("status") || "pending"),
    };
    // ================= VIDEO =================

    const existingVideo = String(formData.get("existing_video") || "");

    const newVideo = formData.get("new_video");

    let finalVideo = existingVideo || null;

    // Upload new video
    if (newVideo instanceof File && newVideo.size > 0) {
      const extension = newVideo.name.split(".").pop()?.toLowerCase() || "mp4";

      const fileName = `${id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("property-videos")
        .upload(fileName, newVideo);

      if (uploadError) {
        console.error("VIDEO UPLOAD ERROR:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("property-videos")
        .getPublicUrl(fileName);

      finalVideo = publicUrlData.publicUrl;
    }
    // ================= IMAGES =================

    // الصور القديمة التي لسه المستخدم محتفظ بها
    const existingImages = formData
      .getAll("existing_images")
      .map((image) => String(image))
      .filter(Boolean);

    // الصور الجديدة
    const newImageFiles = formData
      .getAll("new_images")
      .filter((file): file is File => file instanceof File && file.size > 0);

    const newImageUrls: string[] = [];

    // رفع الصور الجديدة
    for (const image of newImageFiles) {
      const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, image);

      if (uploadError) {
        console.error("IMAGE UPLOAD ERROR:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      newImageUrls.push(publicUrlData.publicUrl);
    }

    // كل الصور النهائية
    const finalImages = [...existingImages, ...newImageUrls];
    const { error } = await supabase
      .from("properties")
      .update({ ...updatedProperty, images: finalImages, video: finalVideo })
      .eq("id", id);

    if (error) {
      console.error("UPDATE PROPERTY ERROR:", error);
      console.error("ERROR CODE:", error.code);
      console.error("ERROR MESSAGE:", error.message);
      console.error("ERROR DETAILS:", error.details);
      console.error("ERROR HINT:", error.hint);

      throw new Error(error.message);
    }
    // ================= DELETE REMOVED IMAGES =================

    const oldImages: string[] = Array.isArray(property.images)
      ? property.images
      : property.images
        ? JSON.parse(property.images)
        : [];

    const removedImages = oldImages.filter(
      (image: string) => !existingImages.includes(image),
    );

    const filesToDelete = removedImages
      .map((image: string) => {
        try {
          const url = new URL(image);

          const marker = "/storage/v1/object/public/property-images/";

          const index = url.pathname.indexOf(marker);

          if (index === -1) {
            return null;
          }

          return decodeURIComponent(
            url.pathname.substring(index + marker.length),
          );
        } catch {
          return null;
        }
      })
      .filter((path): path is string => Boolean(path));

    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from("property-images")
        .remove(filesToDelete);

      if (deleteError) {
        console.error("IMAGE DELETE ERROR:", deleteError);
      }
    }
    // ================= DELETE OLD VIDEO =================

    if (property.video && property.video !== finalVideo) {
      try {
        const url = new URL(property.video);

        const marker = "/storage/v1/object/public/property-videos/";

        const index = url.pathname.indexOf(marker);

        if (index !== -1) {
          const oldVideoPath = decodeURIComponent(
            url.pathname.substring(index + marker.length),
          );

          const { error: deleteVideoError } = await supabase.storage
            .from("property-videos")
            .remove([oldVideoPath]);

          if (deleteVideoError) {
            console.error("OLD VIDEO DELETE ERROR:", deleteVideoError);
          }
        }
      } catch (error) {
        console.error("OLD VIDEO PATH ERROR:", error);
      }
    }
    redirect(`/${locale}/company/properties/${id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-[#1b3255] dark:text-blue-400 font-medium">
            {t("portal")}
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1b3255] dark:text-white mt-2">
            {t("title")}
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <form
          action={updateProperty}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800"
        >
          {/* ================= BASIC INFORMATION ================= */}

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#1b3255] dark:text-white mb-5">
              {t("basicInformation")}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label={t("ownerName")}
                name="name"
                defaultValue={property.name ?? ""}
              />

              <Input
                label={t("phone")}
                name="phone"
                defaultValue={property.phone ?? ""}
              />

              <Select
                label={t("propertyType")}
                name="property-type"
                defaultValue={property["property-type"] ?? ""}
                options={[
                  ["apartment", t("types.apartment")],
                  ["villa", t("types.villa")],
                  ["shop", t("types.shop")],
                  ["office", t("types.office")],
                  ["land", t("types.land")],
                ]}
              />

              <Input
                label={t("location")}
                name="location"
                defaultValue={property.location ?? ""}
              />
            </div>
          </section>

          {/* ================= PROPERTY DETAILS ================= */}

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#1b3255] dark:text-white mb-5">
              {t("propertyDetails")}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label={t("price")}
                name="price"
                type="number"
                defaultValue={property.price ?? ""}
              />

              <Input
                label={t("area")}
                name="area"
                type="number"
                defaultValue={property.area ?? ""}
              />

              <Input
                label={t("rooms")}
                name="rooms"
                type="number"
                defaultValue={property.rooms ?? ""}
              />

              <Input
                label={t("bathrooms")}
                name="bathrooms"
                type="number"
                defaultValue={property.bathrooms ?? ""}
              />

              <Input
                label={t("floor")}
                name="floor"
                type="number"
                defaultValue={property.floor ?? ""}
              />

              <Select
                label={t("finishing")}
                name="finishing"
                defaultValue={property.finishing ?? ""}
                options={[
                  ["fully-finished", t("finishingTypes.fullyFinished")],
                  ["semi-finished", t("finishingTypes.semiFinished")],
                  ["unfinished", t("finishingTypes.unfinished")],
                ]}
              />

              <Input
                label={t("view")}
                name="view"
                defaultValue={property.view ?? ""}
              />

              <Select
                label={t("direction")}
                name="direction"
                defaultValue={property.direction ?? ""}
                options={[
                  ["north", t("directions.north")],
                  ["south", t("directions.south")],
                  ["east", t("directions.east")],
                  ["west", t("directions.west")],
                ]}
              />
            </div>

            {/* Boolean Options */}

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <BooleanSelect
                label={t("hasElevator")}
                name="has_elevator"
                value={Boolean(property.has_elevator)}
              />

              <BooleanSelect
                label={t("hasGarage")}
                name="has_garage"
                value={Boolean(property.has_garage)}
              />

              <BooleanSelect
                label={t("furnished")}
                name="furnished"
                value={Boolean(property.furnished)}
              />
            </div>
          </section>

          {/* ================= PAYMENT ================= */}

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#1b3255] dark:text-white mb-5">
              {t("paymentSection")}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <Select
                label={t("paymentMethod")}
                name="payment_method"
                defaultValue={property.payment_method ?? ""}
                options={[
                  ["cash", t("paymentMethods.cash")],
                  ["installments", t("paymentMethods.installments")],
                  ["bank", t("paymentMethods.bank")],
                ]}
              />

              <Input
                label={t("downPayment")}
                name="down_payment"
                type="number"
                defaultValue={property.down_payment ?? ""}
              />

              <Input
                label={t("installmentDuration")}
                name="installment_duration"
                defaultValue={property.installment_duration ?? ""}
              />

              <Input
                label={t("installmentAmount")}
                name="installment_amount"
                type="number"
                defaultValue={property.installment_amount ?? ""}
              />

              <Input
                label={t("paymentFrequency")}
                name="payment_frequency"
                defaultValue={property.payment_frequency ?? ""}
              />

              <Input
                label={t("additionalPayments")}
                name="additional_payments"
                defaultValue={property.additional_payments ?? ""}
              />
            </div>

            <div className="mt-5">
              <Textarea
                label={t("installmentDetails")}
                name="installment_details"
                defaultValue={property.installment_details ?? ""}
              />
            </div>

            <div className="mt-5">
              <BooleanSelect
                label={t("negotiable")}
                name="negotiable"
                value={Boolean(property.negotiable)}
              />
            </div>
          </section>

          {/* ================= STATUS ================= */}

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#1b3255] dark:text-white mb-5">
              {t("statusSection")}
            </h2>

            <Select
              label={t("status")}
              name="status"
              defaultValue={property.status ?? "pending"}
              options={[
                ["new", t("statuses.new")],
                ["pending", t("statuses.pending")],
                ["available", t("statuses.available")],
                ["reserved", t("statuses.reserved")],
                ["sold", t("statuses.sold")],
              ]}
            />
          </section>

          {/* ================= DESCRIPTION ================= */}

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#1b3255] dark:text-white mb-5">
              {t("descriptionSection")}
            </h2>

            <div className="space-y-5">
              <Textarea
                label={t("description")}
                name="description"
                defaultValue={property.description ?? ""}
              />

              <Textarea
                label={t("notes")}
                name="notes"
                defaultValue={property.notes ?? ""}
              />
            </div>
          </section>
          <PropertyImagesEditor
            images={
              Array.isArray(property.images)
                ? property.images
                : property.images
                  ? JSON.parse(property.images)
                  : []
            }
          />
          <PropertyVideoEditor video={property.video ?? null} />
          {/* ================= BUTTONS ================= */}

          <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-100 dark:border-slate-800">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#1b3255] text-white py-3 font-semibold hover:bg-[#142844] transition"
            >
              {t("saveChanges")}
            </button>

            <a
              href={`/${locale}/company/properties/${id}`}
              className="flex-1 text-center rounded-xl border border-gray-200 dark:border-slate-700 py-3 font-semibold text-[#1b3255] dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              {t("cancel")}
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string | number | null;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        className="w-full h-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 outline-none focus:ring-2 focus:ring-[#1b3255]/20 dark:text-white"
      />
    </div>
  );
}

/* ================= SELECT ================= */

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[][];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full h-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 outline-none dark:text-white"
      >
        <option value="">---</option>

        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ================= BOOLEAN SELECT ================= */

function BooleanSelect({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <select
        name={name}
        defaultValue={String(value)}
        className="w-full h-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 outline-none dark:text-white"
      >
        <option value="true">نعم</option>
        <option value="false">لا</option>
      </select>
    </div>
  );
}

/* ================= TEXTAREA ================= */

function Textarea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string | null;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={5}
        className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4 outline-none focus:ring-2 focus:ring-[#1b3255]/20 dark:text-white resize-none"
      />
    </div>
  );
}
