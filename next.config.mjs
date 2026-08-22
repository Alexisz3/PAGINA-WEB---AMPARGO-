import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * IMPORTANTE (Hostinger): este archivo debe exportar un OBJETO, no una función.
 * Hostinger genera su propia configuración y la fusiona con esta; una función
 * no se fusiona y el despliegue falla. Tampoco renombrar a `next.config.cjs`.
 * `withNextIntl(...)` envuelve el objeto final más abajo — el export sigue
 * siendo el objeto resultante, no una función.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,

  // No anunciar el framework a escáneres automáticos.
  poweredByHeader: false,

  images: {
    // AVIF primero: comprime mejor y degrada con menos artefactos que WebP
    // sobre un JPEG que ya venía recomprimido, que es el caso de estas fotos.
    formats: ["image/avif", "image/webp"],
    // Las fuentes topan en 960px y Next no amplía: pedir tamaños mayores solo
    // generaría variantes de caché que nunca se usan.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384, 512, 640],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
