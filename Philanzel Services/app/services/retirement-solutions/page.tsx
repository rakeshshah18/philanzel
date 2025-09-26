import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, CheckCircle, ArrowRight, TrendingUp, Shield, Users, Calendar } from "lucide-react"
import Link from "next/link"
import OurProcessSection from "./ourProcess"
import AboutService from "./about"

export default function WealthPlanningPage() {
  return (
    <div className= "min-h-screen bg-white" >
    <Navigation />

  {/* Hero Section */ }
  <section className="bg-gradient-to-br from-gray-50 to-white py-20" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" >
        <div>
        <Badge className="bg-amber-500 text-white mb-4" > Retirement Solutions </Badge>
          < h1 className = "text-xl md:text-5xl font-serif font-black text-gray-900 mb-6" >
            Retirement < span className = "text-amber-500" > Solutions </span>
              </h1>
              < p className = "text-xl text-gray-600 mb-8 font-sans leading-relaxed" >
                Plan Today, Relax Tomorrow — Secure Your Future with Smart Retirement Strategies
              </p>
              </div>
    </div>
    </div>
    </section>

    // about section
    <AboutService />

  
  {/* Our Process */ }
  <OurProcessSection />
  

      {/* CTA Section */ }
    < section className = "py-20 bg-gradient-to-r from-amber-500 to-amber-600" >
    <div className= "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" >
      <h2 className="text-4xl font-serif font-black text-white mb-6" > Ready to Plan Your Financial Future ? </h2>
        < p className = "text-xl text-amber-100 mb-8 font-sans" >
          Start your comprehensive wealth planning journey with our expert advisors today.
          </p>
            < div className = "flex flex-col sm:flex-row gap-4 justify-center" >
              <Link href="/contact" >
                <Button size="lg" className = "bg-white text-amber-500 hover:bg-gray-100 px-8 py-4 text-lg" >
                  Schedule Consultation
                    < ArrowRight className = "ml-2 h-5 w-5" />
                      </Button>
                      </Link>
                      < Link href = "/pricing" >
                        <Button
                size="lg"
  variant = "outline"
  className = "border-white text-white hover:bg-white hover:text-amber-500 px-8 py-4 text-lg bg-transparent"
    >
    View Pricing
      </Button>
      </Link>
      </div>
      </div>
      </section>

  {/* Footer */ }
  <footer className="bg-gray-900 text-white py-16" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8" >
        <div className="col-span-1 md:col-span-2" >
          <div className="flex items-center mb-4" >
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-3" >
              <TrendingUp className="h-6 w-6 text-white" />
                </div>
                < span className = "text-2xl font-serif font-black" > Philanzel Investment </span>
                  </div>
                  < p className = "text-gray-400 mb-6 font-sans max-w-md" >
                    Professional Portfolio Management Services helping you build and preserve wealth through strategic
                investment planning.
              </p>
    < div className = "flex space-x-4" >
      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer" >
        <span className="text-sm font-bold" > f </span>
          </div>
          < div className = "w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer" >
            <span className="text-sm font-bold" >in </span>
              </div>
              < div className = "w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer" >
                <span className="text-sm font-bold" > @</span>
                  </div>
                  </div>
                  </div>
                  < div >
                  <h3 className="text-lg font-serif font-bold mb-4" > Services </h3>
                    < ul className = "space-y-2 font-sans text-gray-400" >
                      <li>
                      <Link href="/services/portfolio-management" className = "hover:text-white" >
                        Portfolio Management
                          </Link>
                          </li>
                          < li >
                          <Link href="/services/wealth-planning" className = "hover:text-white" >
                            Wealth Planning
                              </Link>
                              </li>
                              < li >
                              <Link href="/services/risk-assessment" className = "hover:text-white" >
                                Risk Assessment
                                  </Link>
                                  </li>
                                  < li >
                                  <Link href="/services/tax-optimization" className = "hover:text-white" >
                                    Tax Optimization
                                      </Link>
                                      </li>
                                      </ul>
                                      </div>
                                      < div >
                                      <h3 className="text-lg font-serif font-bold mb-4" > Company </h3>
                                        < ul className = "space-y-2 font-sans text-gray-400" >
                                          <li>
                                          <Link href="/about" className = "hover:text-white" >
                                            About Us
                                              </Link>
                                              </li>
                                              < li >
                                              <Link href="/blog" className = "hover:text-white" >
                                                Blog
                                                </Link>
                                                </li>
                                                < li >
                                                <Link href="/testimonials" className = "hover:text-white" >
                                                  Testimonials
                                                  </Link>
                                                  </li>
                                                  < li >
                                                  <Link href="/contact" className = "hover:text-white" >
                                                    Contact
                                                    </Link>
                                                    </li>
                                                    </ul>
                                                    </div>
                                                    </div>
                                                    < div className = "border-t border-gray-800 mt-12 pt-8 text-center" >
                                                      <p className="text-gray-400 font-sans" >
              © 2024 Philanzel Investment Services.All rights reserved. | Privacy Policy | Terms of Service
    </p>
    </div>
    </div>
    </footer>
    </div>
  );
}
