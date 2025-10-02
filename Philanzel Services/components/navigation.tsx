"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isCalculatorsDropdownOpen, setIsCalculatorsDropdownOpen] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [calculators, setCalculators] = useState<any[]>([])

  // Define the backend base URL
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

    // Fetch services data for dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/services/public`)
        
        if (response.ok) {
          const result = await response.json()
          console.log('Services API response:', result)
          
          if (result.status === "success" && result.data && result.data.length > 0) {
            // Filter services with tabTitle (show all active services)
            const servicesWithTitles = result.data
              .filter((service: any) => service.tabTitle && service.slug && service.isActive)
            
            setServices(servicesWithTitles)
            console.log('Loaded services for navigation:', servicesWithTitles)
          } else {
            // Fallback to static services if API structure is different
            setServices([
              { _id: '1', tabTitle: 'Insurance Services', slug: 'insurance' },
              { _id: '2', tabTitle: 'Investment Planning', slug: 'investment' },
              { _id: '3', tabTitle: 'Financial Planning', slug: 'financial-planning' },
              { _id: '4', tabTitle: 'Tax Planning', slug: 'tax-planning' },
              { _id: '5', tabTitle: 'Retirement Planning', slug: 'retirement' },
              { _id: '6', tabTitle: 'Wealth Management', slug: 'wealth-management' }
            ])
            console.log('Using fallback services for navigation')
          }
        } else {
          console.log('Services API failed, using fallback')
          // Use fallback services
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
        // Use fallback services on error
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

  // Fetch calculators data for dropdown
  useEffect(() => {
    const fetchCalculators = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/calculators/pages`)
        
        if (response.ok) {
          const result = await response.json()
          console.log('Calculators API response:', result)
          
          if (result.success && result.data && result.data.length > 0) {
            // Filter and map calculators with name and slug
            const calculatorsList = result.data
              .filter((calculator: any) => calculator.name && calculator.slug)
              .map((calculator: any) => ({
                _id: calculator._id,
                name: calculator.name,
                slug: calculator.slug
              }))
            
            setCalculators(calculatorsList)
            console.log('Loaded calculators for navigation:', calculatorsList)
          } else {
            // Fallback to empty array if no calculators found
            setCalculators([])
            console.log('No calculators found')
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
                  className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors"
                >
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
                      {services.map((service: any) => (
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
                      {calculators.map((calculator: any) => (
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
                <Link
                  href="/events"
                  className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors"
                >
                  Events
                </Link>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors"
                >
                  Careers
                </Link>
                <Link
                  href="/partner"
                  className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors"
                >
                  Become a Partner
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-cyan-600 px-2 py-2 text-sm font-medium transition-colors"
                >
                  Blogs
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
                
                {/* Mobile Calculators Section */}
                <div className="space-y-1">
                  {calculators.map((calculator: any) => (
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
