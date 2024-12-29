import { useEffect } from "react";

export default function Loader({ size, stroke, speed, color, loaderText }: any) {
  useEffect(() => {
    async function getLoader() {
      const { dotSpinner } = await import("ldrs");
      dotSpinner.register();
    }
    getLoader();
  }, []);
  return (
    <div className="flex items-center justify-center gap-x-3">
      <l-dot-spinner
        size={size ?? "35"}
        speed={speed || "1"}
        color={color || "#F9D2D5"}
      ></l-dot-spinner>
      {loaderText}
    </div>
  );
}
