import type { Metadata } from "next";
import "./globals.css";
import {Menu} from "antd";
import { generateMenuItem } from "@/lib/menuItem";

export const metadata: Metadata = {
  title: "Data Playground",
  description: "Play with data",
  creator: "salim4n",
};

const date = new Date();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className="bg-slate-400">
        <header className="fixed top-0 w-full z-50 bg-slate-600">
          <Menu  mode="horizontal" theme="dark" items={generateMenuItem()}  />
        </header>
        <main className="container mx-auto mt-20 mb-20 px-4">
          {children}
        </main>
        <footer className="fixed bottom-0 w-full z-50 bg-slate-600">
          <p className="text-center m-3 p-3 text-white">&copy;{date.getFullYear()} - Salim4n -  Data Playground</p>
        </footer>
      </body>
    </html>
  );
}
