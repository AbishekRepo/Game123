import type { Metadata } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import "@/assets/styles/global.css";
import { APP_NAME, APP_DESC, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/ui/shared/auth/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: `${APP_DESC}`,
  metadataBase: new URL(SERVER_URL),
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

// Initialize Poppins
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} antialiased ${montserrat.variable} ${poppins.variable}`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
