import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/providers/ReduxProvider';
import { rootMetadata } from '@/lib/seo/metadata';
import './globals.css';

export const metadata = rootMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-white min-h-screen flex flex-col">
        <ReduxProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#1D9E75', secondary: '#fff' },
              },
            }}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
