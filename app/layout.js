
import "./global.css";

export const metadata = {
  title: "SoundSpace | Your Music Universe",
  description: "Explore music with SoundSpace."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
