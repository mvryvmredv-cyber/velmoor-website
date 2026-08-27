"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  name?: string | null;
  location?: string | null;
  price?: string | number | null;
  status?: string | null;
  "property-type"?: string | null;
  images?: string[] | string | null;
};

type Props = {
  properties: Property[];
  locale: string;
};

export default function PropertiesManager({ properties, locale }: Props) {
  const router = useRouter();
  const t = useTranslations("properties");
  const searchParams = useSearchParams();

  const initialStatus = searchParams.get("status") || "all";

  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [sort, setSort] = useState("newest");

  const [propertyList, setPropertyList] = useState<Property[]>(properties);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setPropertyList(properties);
  }, [properties]);

  /* ================= FILTER ================= */

  const filteredProperties = useMemo(() => {
    let result = [...propertyList];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((property) => {
        return (
          property.name?.toLowerCase().includes(query) ||
          property.location?.toLowerCase().includes(query) ||
          property["property-type"]?.toLowerCase().includes(query)
        );
      });
    }

    // Status
    if (status !== "all") {
      result = result.filter((property) => property.status === status);
    }

    // Property Type
    if (propertyType !== "all") {
      result = result.filter(
        (property) => property["property-type"] === propertyType,
      );
    }

    // Sort
    result.sort((a, b) => {
      const priceA = Number(String(a.price || "0").replace(/,/g, ""));

      const priceB = Number(String(b.price || "0").replace(/,/g, ""));

      if (sort === "priceLow") {
        return priceA - priceB;
      }

      if (sort === "priceHigh") {
        return priceB - priceA;
      }

      return 0;
    });

    return result;
  }, [propertyList, search, status, propertyType, sort]);

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    setDeletingId(propertyToDelete);
    setDeleteError("");

    try {
      // Check active session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setDeleteError(t("deleteError"));
        return;
      }

      // Delete property
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyToDelete);

      if (error) {
        console.error("Delete property error:", error);
        setDeleteError(t("deleteError"));
        return;
      }

      // Remove property from current list
      setPropertyList((current) =>
        current.filter((property) => property.id !== propertyToDelete),
      );

      // Close modal
      setPropertyToDelete(null);

      // Show success message
      setSuccessMessage(t("deleteSuccess"));
      router.refresh();
      // Hide success message
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Delete property error:", error);
      setDeleteError(t("deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= OPEN DELETE MODAL ================= */

  const openDeleteModal = (id: string) => {
    setDeleteError("");
    setPropertyToDelete(id);
  };

  /* ================= CLOSE DELETE MODAL ================= */

  const closeDeleteModal = () => {
    if (deletingId) return;

    setPropertyToDelete(null);
    setDeleteError("");
  };

  return (
    <>
      {/* ================= SUCCESS MESSAGE ================= */}

      {successMessage && (
        <div className="fixed top-24 right-6 z-[100]">
          <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-green-200 dark:border-green-900 shadow-xl px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
              <CheckCircle2
                size={20}
                className="text-green-600 dark:text-green-400"
              />
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}

      {propertyToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />

          {/* Modal */}

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8">
            {/* Close */}

            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deletingId !== null}
              className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {/* Icon */}

            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-5">
              <AlertTriangle
                size={28}
                className="text-red-600 dark:text-red-400"
              />
            </div>

            {/* Title */}

            <h2 className="text-2xl font-bold text-[#1b3255] dark:text-white">
              {t("deleteTitle")}
            </h2>

            {/* Description */}

            <p className="mt-3 text-gray-500 dark:text-gray-400 leading-7">
              {t("deleteDescription")}
            </p>

            {/* Error */}

            {deleteError && (
              <div className="mt-5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {deleteError}
                </p>
              </div>
            )}

            {/* Actions */}

            <div className="grid grid-cols-2 gap-3 mt-7">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deletingId !== null}
                className="rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 py-3 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                {t("cancel")}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white py-3 font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                <Trash2 size={18} />

                {deletingId ? t("deleting") : t("confirmDelete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FILTERS ================= */}

      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-gray-100 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal
            size={20}
            className="text-[#1b3255] dark:text-blue-400"
          />

          <h2 className="font-semibold text-[#1b3255] dark:text-white">
            {t("filters")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full h-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 pl-11 pr-4 outline-none focus:ring-2 focus:ring-[#1b3255]/20 dark:text-white"
            />
          </div>

          {/* Status */}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 outline-none dark:text-white"
          >
            <option value="all">{t("allStatuses")}</option>

            <option value="pending">{t("statuses.pending")}</option>

            <option value="available">{t("statuses.available")}</option>

            <option value="sold">{t("statuses.sold")}</option>

            <option value="reserved">{t("statuses.reserved")}</option>
          </select>

          {/* Property Type */}

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="h-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 outline-none dark:text-white"
          >
            <option value="all">{t("allPropertyTypes")}</option>

            <option value="apartment">{t("propertyTypes.apartment")}</option>

            <option value="villa">{t("propertyTypes.villa")}</option>

            <option value="shop">{t("propertyTypes.shop")}</option>

            <option value="office">{t("propertyTypes.office")}</option>

            <option value="land">{t("propertyTypes.land")}</option>
          </select>

          {/* Sort */}

          <div className="relative">
            <ArrowUpDown
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 pl-11 pr-4 outline-none dark:text-white"
            >
              <option value="newest">{t("sortNewest")}</option>

              <option value="priceLow">{t("sortPriceLow")}</option>

              <option value="priceHigh">{t("sortPriceHigh")}</option>
            </select>
          </div>
        </div>
      </section>

      {/* ================= RESULTS COUNT ================= */}

      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("resultsCount", {
            count: filteredProperties.length,
          })}
        </p>
      </div>

      {/* ================= EMPTY ================= */}

      {filteredProperties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-slate-800">
          <p className="text-gray-500 dark:text-gray-400">
            {t("noMatchingProperties")}
          </p>
        </div>
      ) : (
        /* ================= PROPERTY GRID ================= */

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            let imageUrl = "";

            try {
              if (Array.isArray(property.images)) {
                imageUrl = property.images[0] || "";
              } else if (property.images) {
                imageUrl = JSON.parse(property.images)[0] || "";
              }
            } catch {
              imageUrl = "";
            }

            const price = property.price
              ? Number(String(property.price).replace(/,/g, "")).toLocaleString(
                  "en-US",
                )
              : null;

            return (
              <div
                key={property.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition"
              >
                {/* Image */}

                <div className="h-56 bg-gray-100 dark:bg-slate-800">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.name || t("property")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {t("noImage")}
                    </div>
                  )}
                </div>

                {/* Content */}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-bold text-lg text-[#1b3255] dark:text-white">
                      {property["property-type"]
                        ? t(`propertyTypes.${property["property-type"]}`)
                        : t("property")}
                    </h2>

                    <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 whitespace-nowrap">
                      {property.status
                        ? t(`statuses.${property.status}`)
                        : t("statuses.pending")}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    📍 {property.location || t("noLocation")}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    👤 {property.name || t("noOwner")}
                  </p>

                  {price && (
                    <p className="font-bold text-[#1b3255] dark:text-white mt-4">
                      💰 {price} {t("currency")}
                    </p>
                  )}

                  {/* Actions */}

                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <Link
                      href={`/${locale}/company/properties/${property.id}`}
                      className="text-center rounded-xl bg-[#1b3255] text-white py-3 text-sm font-medium hover:bg-[#142844] transition"
                    >
                      {t("viewDetails")}
                    </Link>

                    <Link
                      href={`/${locale}/company/properties/${property.id}/edit`}
                      className="text-center rounded-xl border border-gray-200 dark:border-slate-700 text-[#1b3255] dark:text-white py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      {t("edit")}
                    </Link>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(property.id)}
                      disabled={deletingId !== null}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white py-3 text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
