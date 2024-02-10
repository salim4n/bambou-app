import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bambou App",
  description: "Envoi de sms massif via fichier Excel",
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
          <h1 className="text-center m-3 p-3">Bambou App</h1>
        </header>
        <main className="container mx-auto mt-20 mb-20 px-4">
          {children}
        </main>
        <footer className="fixed bottom-0 w-full z-50 bg-slate-600">
          <p className="text-center m-3 p-3">&copy;{date.getFullYear()} - Bambou Application SMS automation</p>
        </footer>
      </body>
    </html>
  );
}
