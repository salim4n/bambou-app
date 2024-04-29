
import type { Metadata } from "next";
import "./globals.css";
import Layout from "./layout/page";

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
          <Layout>
          {children}
          </Layout>
      </body>
    </html>
  );
}
