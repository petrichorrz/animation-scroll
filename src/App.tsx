/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

gsap.registerPlugin(ScrollTrigger);

export default function Component() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState(
    "https://video-magic-scroll.onrender.com/magic-video.mp4"
  );
  const [scrollHeight, setScrollHeight] = useState("500vh");

  useLayoutEffect(() => {
    const scrollH: any = localStorage.getItem('video-height')

    if(!JSON.parse(scrollH as any)) {
      localStorage.setItem('video-height', JSON.stringify(scrollHeight))
    } else {
      setScrollHeight(JSON.parse(scrollH))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const activateVideo = () => {
      video.play().then(() => video.pause());
    };
    document.documentElement.addEventListener("touchstart", activateVideo, {
      once: true,
    });

    const handleVideoLoad = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.fromTo(
        video,
        { currentTime: 0 },
        { currentTime: video.duration || 1, ease: "none" }
      );
    };

    video.addEventListener("loadedmetadata", handleVideoLoad);

    return () => {
      document.documentElement.removeEventListener("touchstart", activateVideo);
      video.removeEventListener("loadedmetadata", handleVideoLoad);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [videoUrl, scrollHeight]);

  const handleVideoUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem(
      "videoUrl"
    ) as HTMLInputElement;
    if (input.value) {
      setVideoUrl(input.value);
    }
  };

  const handleHeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem(
      "scrollHeight"
    ) as HTMLInputElement;
    if (input.value) {
      setScrollHeight(input.value);
      localStorage.setItem('video-height', JSON.stringify(input.value))
      window.location.reload()
    }
  };

  const resetVideo = () => {
    setVideoUrl("https://video-magic-scroll.onrender.com/magic-video.mp4");
  };

  const resetHeight = () => {
    setScrollHeight("500vh");
    localStorage.setItem('video-height', JSON.stringify('500vh'))
    window.location.reload()
  };

  // const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
  //   setScrollHeight(e.target.value)

  // }

  return (
    <div className=" min-h-screen">
      <div className="bg-pink-100 pt-[150px] h-[100vh]">
        <div className=" top-0 left-0 right-0 p-6 space-y-8">
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-medium">
              Input to use custom video URL
            </h2>
            <form onSubmit={handleVideoUrlSubmit} className="space-y-2">
              <Input
                name="videoUrl"
                type="text"
                placeholder="magic-video.mp4"
                aria-label="Custom video URL"
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Apply
              </Button>
            </form>
            <Button
              onClick={resetVideo}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Reset Default Video
            </Button>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-medium">
              Input custom Video Scroll Height
            </h2>
            <p className="text-sm text-gray-600">
              Default: 500vh (viewport height, 100vh = 100% of viewport).
              <br />
              More scroll height, more slower.
              <br />
              We can use "vh" or "px" units
              <br />
              Example: 500vh, 5000px, 7000px,...
            </p>
            <form onSubmit={handleHeightSubmit} className="space-y-2">
              <Input
                name="scrollHeight"
                type="text"
                placeholder={scrollHeight}
                aria-label="Custom scroll height"
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Apply Height
              </Button>
            </form>
            <Button
              onClick={resetHeight}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Reset Default Height
            </Button>
          </div>
        </div>

        <div className=" bottom-10 left-0 right-0 text-center">
          <h1 className="text-4xl font-bold text-green-500 bg-black bg-opacity-50 inline-block px-4 py-2 rounded">
            Scroll down to see the magic
          </h1>
        </div>
      </div>

      <div
        ref={containerRef}
        style={{ height: scrollHeight }}
        className="relative"
      >
        <div className="sticky top-0">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-screen h-screen object-cover"
            preload="auto"
            playsInline
            muted
          />
        </div>
      </div>

      <div className="bg-green-100 pt-[150px] h-[100vh]"></div>
    </div>
  );
}
