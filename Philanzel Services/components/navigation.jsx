"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, User as UserIcon } from "lucide-react"

export default function Navigation({ loggedIn, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isCalculatorsDropdownOpen, setIsCalculatorsDropdownOpen] = useState(false)
  const [services, setServices] = useState([])
  const [calculators, setCalculators] = useState([])

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/services/public`)
        if (response.ok) {
          const result = await response.json()
          console.log('Services API response:', result)

          if (result.status === "success" && result.data && result.data.length > 0) {
            const servicesWithTitles = result.data.filter(
              (service) => service.tabTitle && service.slug && service.isActive
            )
            setServices(servicesWithTitles)
            console.log('Loaded services for navigation:', servicesWithTitles)
          } else {
            setServices([
              { _id: '1', tabTitle: 'Insurance Services', slug: 'insurance' },
              { _id: '2', tabTitle: 'Investment Planning', slug: 'investment' },
              { _id: '3', tabTitle: 'Financial Planning', slug: 'financial-planning' },
              { _id: '4', tabTitle: 'Tax Planning', slug: 'tax-planning' },
              { _id: '5', tabTitle: 'Retirement Planning', slug: 'retirement' },
              { _id: '6', tabTitle: 'Wealth Management', slug: 'wealth-management' }
            ])
          }
        } else {
          console.log('Services API failed, using fallback')
          setServices([
            { _id: '1', tabTitle: 'Insurance Services', slug: 'insurance' },
            { _id: '2', tabTitle: 'Investment Planning', slug: 'investment' },
            { _id: '3', tabTitle: 'Financial Planning', slug: 'financial-planning' },
            { _id: '4', tabTitle: 'Tax Planning', slug: 'tax-planning' },
            { _id: '5', tabTitle: 'Retirement Planning', slug: 'retirement' },
            { _id: '6', tabTitle: 'Wealth Management', slug: 'wealth-management' }
          ])
        }
      } catch (error) {
        console.log('Error fetching services for navigation:', error)
        setServices([
          { _id: '1', tabTitle: 'Insurance Services', slug: 'insurance' },
          { _id: '2', tabTitle: 'Investment Planning', slug: 'investment' },
          { _id: '3', tabTitle: 'Financial Planning', slug: 'financial-planning' },
          { _id: '4', tabTitle: 'Tax Planning', slug: 'tax-planning' },
          { _id: '5', tabTitle: 'Retirement Planning', slug: 'retirement' },
          { _id: '6', tabTitle: 'Wealth Management', slug: 'wealth-management' }
        ])
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    const fetchCalculators = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/calculators/pages`)
        if (response.ok) {
          const result = await response.json()
          console.log('Calculators API response:', result)

          if (result.success && result.data && result.data.length > 0) {
            const calculatorsList = result.data
              .filter((calculator) => calculator.name && calculator.slug)
              .map((calculator) => ({
                _id: calculator._id,
                name: calculator.name,
                slug: calculator.slug
              }))
            setCalculators(calculatorsList)
          } else {
            setCalculators([])
          }
        } else {
          console.log('Calculators API failed')
          setCalculators([])
        }
      } catch (error) {
        console.log('Error fetching calculators for navigation:', error)
        setCalculators([])
      }
    }

    fetchCalculators()
  }, [])

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-serif font-black text-cyan-600">
                Philanzel
              </Link>
            </div>

            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-6">
                <Link href="/" className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors">
                  About Us
                </Link>

                {/* Services Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsServicesDropdownOpen(true)}
                  onMouseLeave={() => setIsServicesDropdownOpen(false)}
                >
                  <button className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors flex items-center space-x-1">
                    <span>Our Services</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isServicesDropdownOpen && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                      {services.map((service) => (
                        <Link
                          key={service._id || service.slug}
                          href={`/services/${service.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-cyan-600"
                        >
                          {service.tabTitle}
                        </Link>
                      ))}
                      {services.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Loading services...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Calculators Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsCalculatorsDropdownOpen(true)}
                  onMouseLeave={() => setIsCalculatorsDropdownOpen(false)}
                >
                  <button className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors flex items-center space-x-1">
                    <span>Calculators</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isCalculatorsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCalculatorsDropdownOpen && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                      {calculators.map((calculator) => (
                        <Link
                          key={calculator._id}
                          href={`/calculators/${calculator.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-cyan-600"
                        >
                          {calculator.name}
                        </Link>
                      ))}
                      {calculators.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No calculators available
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Link href="/events" className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors">
                  Events
                </Link>
                <Link href="/careers" className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors">
                  Careers
                </Link>
                <Link href="/partner" className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors">
                  Become a Partner
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors">
                  Contact Us
                </Link>
                <Link href="/blog" className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors">
                  Blogs
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {loggedIn && user ? (
              <>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-cyan-600 p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600" onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/services" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600" onClick={() => setIsMenuOpen(false)}>
                Our Services
              </Link>

              {/* Mobile Calculators */}
              <div className="space-y-1">
                {calculators.map((calculator) => (
                  <Link
                    key={calculator._id}
                    href={`/calculators/${calculator.slug}`}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {calculator.name}
                  </Link>
                ))}
              </div>

              <Link href="/events" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600" onClick={() => setIsMenuOpen(false)}>
                Events
              </Link>
              <Link href="/careers" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600" onClick={() => setIsMenuOpen(false)}>
                Careers
              </Link>
              <Link href="/partner" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600" onClick={() => setIsMenuOpen(false)}>
                Become a Partner
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600" onClick={() => setIsMenuOpen(false)}>
                Contact Us
              </Link>

              <div className="border-t border-gray-200 pt-4 mt-4">
                {loggedIn ? (
                  <div className="px-3 py-2">
                    <Button onClick={onLogout} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
