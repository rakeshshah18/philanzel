"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
        <div className="flex justify-between items-center h-16" >
          <div className="flex items-center" >
            <div className="flex-shrink-0" >
              <Link href="/" className="text-2xl font-serif font-black text-cyan-600" >
                Philanzel
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-6">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/services"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Our Services
                </Link>
                <Link
                  href="/calculators"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Calculators
                </Link>
                <Link
                  href="/events"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Events
                </Link>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Careers
                </Link>
                <Link
                  href="/partner"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Become a Partner
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/contact-us">
              
            </Link>
            <Link href="/login">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">Login</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-cyan-600 p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/services"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Our Services
                </Link>
                <Link
                  href="/calculators"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Calculators
                </Link>
                <Link
                  href="/events"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
                <Link
                  href="/careers"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Careers
                </Link>
                <Link
                  href="/partner"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become a Partner
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
                <Link href="/login" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">Login</Button>
                </Link>
              </div>
            </div>
          )}
      </div>
    </nav>
  )
}
