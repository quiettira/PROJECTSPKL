// src/app/layout.js
import "./globals.css";

export const metadata = { title: "Notes Sharing" };

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
