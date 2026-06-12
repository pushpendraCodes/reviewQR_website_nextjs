import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GoogleTagManager } from '@next/third-parties/google';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />

      <Navbar />

      {children}

      <Footer />
    </>
  );
}