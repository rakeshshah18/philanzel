"use client";
import React, { useState, useEffect } from "react";

// TypeScript interfaces based on your actual API structure
interface WriteReviewButton {
  text: string;
  url: string;
  isEnabled: boolean;
}

interface Review {
  _id: string;
  userName: string;
  userProfilePhoto: string;
  reviewProviderLogo: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
  isVerified: boolean;
  isVisible: boolean;
}

interface TestimonialItem {
  _id: string;
  heading: string;
  description: string;
  reviewProvider: string;
  averageRating: number;
  totalReviewCount: number;
  writeReviewButton: WriteReviewButton;
  reviews: Review[];
}

interface ApiResponse {
  status: string;
  count: number;
  data: TestimonialItem[];
}

// Define the backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const Testimonials = () => {
  const [testimonialData, setTestimonialData] = useState<TestimonialItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch testimonials data from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/review-sections/active`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiResponse: ApiResponse = await response.json();
        
        // Extract the first item from the data array
        if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
          setTestimonialData(apiResponse.data[0]);
        } else {
          throw new Error('No testimonial data found');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Generate star rating component
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      );
    }

    return stars;
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle navigation
  const nextSlide = () => {
    if (testimonialData?.reviews) {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonialData.reviews.length / 3));
    }
  };

  const prevSlide = () => {
    if (testimonialData?.reviews) {
      setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonialData.reviews.length / 3)) % Math.ceil(testimonialData.reviews.length / 3));
    }
  };

  // Loading state
  if (loading) {
    return (
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading testimonials: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (!testimonialData) {
    return (
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  // Get visible reviews
  const visibleReviews = testimonialData.reviews?.filter((review: Review) => review.isVisible) || [];
  const reviewsPerPage = 3;
  const startIndex = currentSlide * reviewsPerPage;
  const currentReviews = visibleReviews.slice(startIndex, startIndex + reviewsPerPage);
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-widest text-cyan-700 bg-cyan-50 px-4 py-1 rounded w-max mb-4 inline-block">OUR TESTIMONIALS</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{testimonialData.heading || "What Clients Say?"}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{testimonialData.description || "Our Clients Say About Our Services"}</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={visibleReviews[0]?.reviewProviderLogo || "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"} 
              alt={testimonialData.reviewProvider || "Google"} 
              className="h-6 w-6" 
            />
            <span className="font-semibold">Reviews</span>
            <span className="font-bold ml-2">{testimonialData.averageRating?.toFixed(1) || "4.7"}</span>
            <span className="flex items-center ml-1 text-amber-500">
              {renderStars(testimonialData.averageRating || 4.7)}
            </span>
            <span className="text-gray-500 text-sm ml-1">({testimonialData.totalReviewCount || 0})</span>
          </div>
          
          {testimonialData.writeReviewButton?.isEnabled && (
            <a 
              href={testimonialData.writeReviewButton.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white font-semibold rounded-full px-8 py-2 shadow hover:bg-cyan-700 transition-colors duration-300"
            >
              {testimonialData.writeReviewButton.text}
            </a>
          )}
        </div>

        <div className="relative mt-8">
          {visibleReviews.length > reviewsPerPage && (
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-cyan-100 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors duration-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentReviews.map((review: Review) => (
              <div key={review._id} className="bg-white rounded-2xl shadow p-6 flex flex-col h-full border border-gray-100">
                <div className="flex items-center mb-2">
                  {review.userProfilePhoto && review.userProfilePhoto.startsWith('data:image') ? (
                    <img 
                      src={review.userProfilePhoto} 
                      alt={review.userName}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-lg mr-3">
                      {getUserInitials(review.userName)}
                    </span>
                  )}
                  <div className="flex-1">
                    <span className="font-semibold text-lg text-gray-900">{review.userName}</span>
                    {review.isVerified && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                    )}
                  </div>
                  <span className="ml-auto">
                    <img 
                      src={review.reviewProviderLogo} 
                      alt={testimonialData.reviewProvider || "Review Provider"} 
                      className="h-6 w-6" 
                    />
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="flex text-amber-500">
                    {renderStars(review.rating)}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    {formatDate(review.reviewDate)}
                  </span>
                </div>

                <hr className="my-2 border-gray-200" />
                
                <p className="text-gray-700 text-sm flex-1 leading-relaxed">
                  {review.reviewText}
                </p>
              </div>
            ))}
          </div>

          {visibleReviews.length > reviewsPerPage && (
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-cyan-100 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors duration-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Pagination indicators */}
        {visibleReviews.length > reviewsPerPage && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(visibleReviews.length / reviewsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide ? 'bg-cyan-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;