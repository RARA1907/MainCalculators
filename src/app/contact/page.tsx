'use client'

import { useState } from 'react'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Contact Us</h1>
      <div className="bg-white">
        <p className="text-lg text-gray-700">
          For contact us, email us: <a href="mailto:info@vayns.com" className="text-blue-600 hover:text-blue-800">info@vayns.com</a>
        </p>
      </div>
    </div>
  )
}
