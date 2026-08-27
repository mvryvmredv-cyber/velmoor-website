import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(request: Request) {
  console.log("🔥 POST /api/properties CALLED");

  const uploadedImagePaths: string[] = [];
  let uploadedVideoPath: string | null = null;

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

    const description = String(formData.get("description") || "").trim();

    const notes = String(formData.get("notes") || "").trim();

    // =========================
    // BOOLEAN DATA
    // =========================

    const hasElevator = String(formData.get("has_elevator")) === "true";

    const hasGarage = String(formData.get("has_garage")) === "true";

    const furnished = String(formData.get("furnished")) === "true";

    const negotiable = String(formData.get("negotiable")) === "true";

    // =========================
    // REQUIRED
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
    // FILES
    // =========================

    const imageFiles = formData
      .getAll("images")
      .filter((item): item is File => item instanceof File && item.size > 0);

    const videoItem = formData.get("video");

    const videoFile =
      videoItem instanceof File && videoItem.size > 0 ? videoItem : null;

    console.log("📸 Images:", imageFiles.length);
    console.log("🎥 Video:", videoFile?.name || "No video");

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
    // VALIDATE VIDEO
    // =========================

    if (videoFile) {
      if (!ALLOWED_VIDEO_TYPES.includes(videoFile.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Unsupported video type: ${videoFile.type}`,
          },
          { status: 400 },
        );
      }

      if (videoFile.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `Video is larger than 100 MB.`,
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
          contentType: image.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Image upload error:", uploadError);

        return NextResponse.json(
          {
            success: false,
            message: `Failed to upload image: ${uploadError.message}`,
          },
          { status: 500 },
        );
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
      uploadedImagePaths.push(fileName);
    }
    // =========================
    // UPLOAD VIDEO
    // =========================

    let videoUrl: string | null = null;

    if (videoFile) {
      const extension = videoFile.name.split(".").pop()?.toLowerCase() || "mp4";

      const videoPath = `${propertyId}/${crypto.randomUUID()}.${extension}`;

      const arrayBuffer = await videoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: videoUploadError } = await supabase.storage
        .from("property-videos")
        .upload(videoPath, buffer, {
          contentType: videoFile.type || "video/mp4",
          upsert: false,
        });

      if (videoUploadError) {
        console.error("❌ Video upload error:", videoUploadError);

        return NextResponse.json(
          {
            success: false,
            message: `Failed to upload video: ${videoUploadError.message}`,
          },
          { status: 500 },
        );
      }

      const { data } = supabase.storage
        .from("property-videos")
        .getPublicUrl(videoPath);

      videoUrl = data.publicUrl;
      uploadedVideoPath = videoPath;
    }

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

        // Database columns are TEXT
        price: price || null,
        area: area || null,
        rooms: rooms || null,
        bathrooms: bathrooms || null,
        floor: floor || null,

        finishing: finishing || null,
        view: view || null,
        direction: direction || null,

        // Database columns are TEXT
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

        images: JSON.stringify(imageUrls),

        video: videoUrl,

        status: "pending",
      },
    ]);

    if (propertyError) {
      console.error("❌ Property insert error:", propertyError);

      throw new Error(`Failed to save property: ${propertyError.message}`);
    }

    console.log("✅ PROPERTY CREATED:", propertyId);

    return NextResponse.json(
      {
        success: true,
        message: "Property added successfully.",
        propertyId,
        images: imageUrls,
        video: videoUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("🔥 API ERROR:", error);

    // =========================
    // CLEANUP IMAGES
    // =========================

    if (uploadedImagePaths.length > 0) {
      const { error: imageCleanupError } = await supabase.storage
        .from("property-images")
        .remove(uploadedImagePaths);

      if (imageCleanupError) {
        console.error("⚠️ Image cleanup error:", imageCleanupError);
      }
    }

    // =========================
    // CLEANUP VIDEO
    // =========================

    if (uploadedVideoPath) {
      const { error: videoCleanupError } = await supabase.storage
        .from("property-videos")
        .remove([uploadedVideoPath]);

      if (videoCleanupError) {
        console.error("⚠️ Video cleanup error:", videoCleanupError);
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
