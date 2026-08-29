import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export async function POST(request: Request) {
  console.log("🔥 POST /api/properties CALLED");

  const uploadedImagePaths: string[] = [];

  try {
    const formData = await request.formData();

    // =========================
    // TEXT DATA
    // =========================

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    const propertyType = String(formData.get("property-type") || "").trim();

    const location = String(formData.get("location") || "").trim();

    const price = String(formData.get("price") || "").trim();
    const area = String(formData.get("area") || "").trim();
    const rooms = String(formData.get("rooms") || "").trim();
    const bathrooms = String(formData.get("bathrooms") || "").trim();
    const floor = String(formData.get("floor") || "").trim();

    const finishing = String(formData.get("finishing") || "").trim();
    const view = String(formData.get("view") || "").trim();
    const direction = String(formData.get("direction") || "").trim();

    // =========================
    // PAYMENT
    // =========================

    const paymentMethod = String(formData.get("payment_method") || "").trim();

    const isInstallment = paymentMethod === "installments";

    const downPayment = String(formData.get("down_payment") || "").trim();

    const installmentDuration = String(
      formData.get("installment_duration") || "",
    ).trim();

    const installmentAmount = String(
      formData.get("installment_amount") || "",
    ).trim();

    const paymentFrequency = String(
      formData.get("payment_frequency") || "",
    ).trim();

    const additionalPayments = String(
      formData.get("additional_payments") || "",
    ).trim();

    const installmentDetails = String(
      formData.get("installment_details") || "",
    ).trim();

    // =========================
    // FEATURES
    // =========================

    const hasElevator = String(formData.get("has_elevator")) === "true";

    const hasGarage = String(formData.get("has_garage")) === "true";

    const furnished = String(formData.get("furnished")) === "true";

    const negotiable = String(formData.get("negotiable")) === "true";

    // =========================
    // MARKETING
    // =========================

    const description = String(formData.get("description") || "").trim();

    const notes = String(formData.get("notes") || "").trim();

    // =========================
    // REQUIRED FIELDS
    // =========================

    if (!name || !phone || !propertyType || !location) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 },
      );
    }

    // =========================
    // GET IMAGE FILES
    // =========================

    const imageFiles = formData
      .getAll("images")
      .filter((item): item is File => item instanceof File && item.size > 0);

    console.log("📸 Images received:", imageFiles.length);

    // =========================
    // VALIDATE IMAGES
    // =========================

    for (const image of imageFiles) {
      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Unsupported image type: ${image.type}`,
          },
          { status: 400 },
        );
      }

      if (image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `Image "${image.name}" is larger than 10 MB.`,
          },
          { status: 400 },
        );
      }
    }

    // =========================
    // PROPERTY ID
    // =========================

    const propertyId = Date.now();

    // =========================
    // UPLOAD IMAGES
    // =========================

    const imageUrls: string[] = [];

    for (const image of imageFiles) {
      const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${propertyId}/${crypto.randomUUID()}.${extension}`;

      const arrayBuffer = await image.arrayBuffer();

      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, buffer, {
          contentType: image.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Image upload error:", uploadError);

        // Delete previously uploaded images
        if (uploadedImagePaths.length > 0) {
          await supabase.storage
            .from("property-images")
            .remove(uploadedImagePaths);
        }

        return NextResponse.json(
          {
            success: false,
            message: `Failed to upload image: ${uploadError.message}`,
          },
          { status: 500 },
        );
      }

      uploadedImagePaths.push(fileName);

      const { data: publicUrlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error(`Could not generate public URL for image: ${fileName}`);
      }

      imageUrls.push(publicUrlData.publicUrl);
    }

    console.log("✅ Images uploaded:", imageUrls.length);

    // =========================
    // INSERT PROPERTY
    // =========================

    const { error: propertyError } = await supabase.from("properties").insert([
      {
        id: propertyId,

        name,
        phone,

        "property-type": propertyType,

        location,

        price: price || null,
        area: area || null,
        rooms: rooms || null,
        bathrooms: bathrooms || null,
        floor: floor || null,

        finishing: finishing || null,
        view: view || null,
        direction: direction || null,

        has_elevator: String(hasElevator),
        has_garage: String(hasGarage),
        furnished: String(furnished),

        payment_method: paymentMethod || null,

        down_payment: isInstallment && downPayment ? Number(downPayment) : null,

        installment_duration: isInstallment
          ? installmentDuration || null
          : null,

        installment_amount:
          isInstallment && installmentAmount ? Number(installmentAmount) : null,

        payment_frequency: isInstallment ? paymentFrequency || null : null,

        additional_payments: isInstallment ? additionalPayments || null : null,

        installment_details: isInstallment ? installmentDetails || null : null,

        negotiable,

        description,
        notes,

        // Save image URLs
        images: JSON.stringify(imageUrls),

        status: "pending",
      },
    ]);

    // =========================
    // DATABASE ERROR
    // =========================

    if (propertyError) {
      console.error("❌ Property insert error:", propertyError);

      // Remove uploaded images because property wasn't saved
      if (uploadedImagePaths.length > 0) {
        const { error: cleanupError } = await supabase.storage
          .from("property-images")
          .remove(uploadedImagePaths);

        if (cleanupError) {
          console.error("⚠️ Image cleanup error:", cleanupError);
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: `Failed to save property: ${propertyError.message}`,
        },
        { status: 500 },
      );
    }

    // =========================
    // SUCCESS
    // =========================

    console.log("✅ PROPERTY CREATED:", propertyId);

    return NextResponse.json(
      {
        success: true,
        message: "Property added successfully.",
        propertyId,
        images: imageUrls,
        status: "pending",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("🔥 API ERROR:", error);

    // =========================
    // CLEANUP UPLOADED IMAGES
    // =========================

    if (uploadedImagePaths.length > 0) {
      const { error: cleanupError } = await supabase.storage
        .from("property-images")
        .remove(uploadedImagePaths);

      if (cleanupError) {
        console.error("⚠️ Image cleanup error:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
