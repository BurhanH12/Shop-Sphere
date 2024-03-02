import { type AppType } from "next/app";
import type { Metadata } from "next";
import { trpc } from "~/utils/trpc";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Shop Sphere",
  description: "Revolutionize your shopping experience",
  // other: {
  //   "theme-color": "#0d1117",
  //   "color-scheme": "dark only",
  //   "twitter-image": 'https://i.ibb.co/d6TXxB2/homepage-thumbnail.jpg',
  //   "twitter-card": "summary_large_image",
  //   "og-image": 'https://i.ibb.co/d6TXxB2/homepage-thumbnail.jpg',
  //   "og-type": "website",
  //   "og-url": "https://q-sols.com",
  // }
};


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
