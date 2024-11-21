
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Component() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    let animationFrameId: number

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animationFrameId = requestAnimationFrame(updateVideoPlayback)
          } else {
            cancelAnimationFrame(animationFrameId)
          }
        })
      },
      { threshold: 0 }
    )

    observer.observe(container)

    const updateVideoPlayback = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = container.scrollHeight - window.innerHeight
      const newProgress = Math.max(0, Math.min(1, scrollTop / scrollHeight))


      // Smoothly update progress
      setProgress((prevProgress) => {
        const smoothProgress = prevProgress + (newProgress - prevProgress) * 0.06
        return smoothProgress
      })

      // Update video time based on smooth progress
      if (video.duration) {
        video.currentTime = video.duration * progress
      }

      animationFrameId = requestAnimationFrame(updateVideoPlayback)
    }

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [progress])

  return (
    <div className="min-h-screen">

      <div
        ref={containerRef}
        style={{ height: '500vh' }}
        className="relative w-full"
      >
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <video
            ref={videoRef}
            src="/magic-video.mp4"
            className="w-screen h-full object-cover"
            muted
            playsInline
            preload="auto"
          />
        </div>
      </div>

      <div className="bg-green-100 pt-[150px] h-[100vh]"></div>
    </div>
  );
}
