import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Citywire — India, locally",
  description: "Your Indian city, now. Regional live TV, local news, upcoming events, traffic maps and weather.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('citywire-theme');document.documentElement.dataset.theme=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){}"}}/></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
