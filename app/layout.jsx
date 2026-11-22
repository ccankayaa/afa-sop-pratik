import "../styles.css";

export const metadata = {
  title: "AFA SOP Practice · DA20-C1",
  description:
    "Independent Diamond DA20-C1 SOP practice with 106 core questions and a separate Similar Questions test.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b111b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
