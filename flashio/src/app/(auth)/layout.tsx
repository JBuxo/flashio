export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`flex items-center justify-center h-[100dvh]`}
      style={{ backgroundColor: `oklch(0.8703 0.1524 84.08)` }}
    >
      {children}
    </div>
  );
}
