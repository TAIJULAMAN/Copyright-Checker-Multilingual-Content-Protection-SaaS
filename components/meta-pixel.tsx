"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export default function MetaPixel() {
    const pathname = usePathname()
    const firstRender = useRef(true)

    useEffect(() => {
        const fbq = (window as any).fbq
        if (typeof fbq !== "function") return

        // Special track for Purchase on the success page
        if (pathname.includes("/payment/success")) {
            fbq("track", "Purchase")
        }

        // Track PageView on route change (skip initial load since it's already in the layout script)
        if (firstRender.current) {
            firstRender.current = false
        } else {
            fbq("track", "PageView")
        }
    }, [pathname])

    return null
}
