"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const MAX_FILES = 8;
const MAX_BYTES_PER_FILE = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"] as const;

interface Preview {
  id: string;
  name: string;
  size: number;
  url: string;
}

/**
 * Selector de imágenes de referencia.
 *
 * Alcance honesto: valida y previsualiza en el cliente. NO sube nada todavía
 * — no existe almacenamiento privado contratado. La arquitectura de subida
 * (permiso firmado + PUT directo + verificación de firma de bytes en
 * servidor) está diseñada en AUDITORIA_Y_PLAN_AMPARGO.md §11 y este
 * componente es el punto de conexión previsto.
 *
 * La validación de cliente es solo para UX: la validación real debe repetirse
 * siempre en servidor, porque el cliente puede mentir sobre el MIME.
 */
export default function ReferenceUploader({
  onCountChange,
}: {
  onCountChange?: (n: number) => void;
}) {
  const t = useTranslations("Quote");
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onCountChange?.(previews.length);
  }, [previews.length, onCountChange]);

  // Libera los object URLs al desmontar para no filtrar memoria.
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      setError(null);

      setPreviews((current) => {
        const next = [...current];
        for (const file of Array.from(files)) {
          if (next.length >= MAX_FILES) {
            setError(t("photosCount", { n: MAX_FILES }));
            break;
          }
          if (!ACCEPTED.includes(file.type as (typeof ACCEPTED)[number])) continue;
          if (file.size > MAX_BYTES_PER_FILE) continue;

          next.push({
            id: `${file.name}-${file.size}-${next.length}`,
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
          });
        }
        return next;
      });
    },
    [t]
  );

  const remove = (id: string) => {
    setPreviews((current) => {
      const target = current.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((p) => p.id !== id);
    });
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">{t("photosHeading")}</h2>
      <p className="mt-1 font-mono text-xs text-muted">{t("photosHint")}</p>

      <div className="mt-6 border-2 border-dashed border-line bg-surface p-10 text-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex min-h-[48px] items-center bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
        >
          {t("photosSelect")}
        </button>
        <p className="mt-3 text-sm text-muted">{t("photosDrop")}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 ? (
        <>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {previews.map((p) => (
              <li key={p.id} className="relative">
                <div className="relative aspect-square overflow-hidden border border-line bg-surface">
                  {/* Previsualización local con object URL: next/image no aplica
                      a blobs del propio navegador. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  aria-label={`${t("photosRemove")}: ${p.name}`}
                  className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-carbon text-bone"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-xs text-muted" aria-live="polite">
            {t("photosCount", { n: previews.length })}
          </p>
        </>
      ) : null}

      {error ? (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
