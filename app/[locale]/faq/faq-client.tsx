"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FaqClient({ faqItems }: { faqItems: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqItems?.map((item: any, index: number) => (
        <div
          key={item?._id || index}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-sm transition-shadow"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-semibold text-gray-900">{item?.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">{item?.answer}</div>
          )}
        </div>
      ))}
    </div>
  )
}
