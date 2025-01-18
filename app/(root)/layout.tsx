import Footer from "@/components/ui/shared/Footer";
import Header from "@/components/ui/shared/Header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 wrapper overflow-auto">{children}</main>
      <Footer />
    </div>
  );
}
