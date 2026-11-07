import { ClientSecurityShield } from "@/components/ClientSecurityShield";
import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
import { getDictionary, getLocale } from "@/dictionaries";
import { I18nProvider, type Locale } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "D-SANTÉ - Système d'Information Hospitalier, Clinique & Soins SaaS",
  description: "Solution intégrée et responsive pour structures de santé : parcours patient, triage, consultations, hospitalisations, pharmacie, facturation tiers-payant et comptabilité.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "D-Santé",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const dict = await getDictionary(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClientSecurityShield />
        <I18nProvider dict={dict} locale={locale}>
          <PwaRegister />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
