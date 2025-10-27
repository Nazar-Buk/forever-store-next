"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import { sendGAEvent } from "@next/third-parties/google";

const AnalyticsTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [geo, setGeo] = useState({ country_name: "", city: "" });

  // 1️⃣ Отримати геолокацію один раз при завантаженні
  useEffect(() => {
    const getGeo = async () => {
      try {
        const { data } = await axios.get("https://ipapi.co/json/");

        setGeo({ country_name: data.country_name, city: data.city });
      } catch (error) {
        console.log(error, "error");
        setGeo({ country_name: "Unknown", city: "" });
      }
    };

    getGeo();
  }, []);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    const title = document.title || "Без назви";

    if (geo.country_name) {
      sendGAEvent("event", "page_view", {
        page_path: url,
        page_title: title,
        country: geo.country_name,
        city: geo.city,
      });
    }
  }, [pathname, searchParams, geo]);

  return null;
};

export default AnalyticsTracker;
