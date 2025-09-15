import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import StarRating from '../components/common/StarRating';
import ReviewForm from '../components/review/ReviewForm';
import ReviewCard from '../components/review/ReviewCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services/businessService';
import { reviewService } from '../services/reviewService';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchBusinessData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch business details (accessible to everyone)
      const businessResponse = await businessService.getBusinessById(id);
      setBusiness(businessResponse.data);

      // Fetch reviews (accessible to everyone)
      const reviewsResponse = await reviewService.getReviewsByBusiness(id);
      setReviews(reviewsResponse.data);

      // Check if user has already reviewed (only if logged in)
      if (user) {
        try {
          const hasReviewedResponse = await reviewService.hasReviewedBusiness(id);
          setHasReviewed(hasReviewedResponse.data);
        } catch (error) {
          console.log('Could not check review status (user might not be logged in)');
          setHasReviewed(false);
        }
      } else {
        setHasReviewed(false);
      }
    } catch (error) {
      console.error('Failed to fetch business data:', error);
      setError('Failed to load business information. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Force a complete refresh of all data to show the new review
    setTimeout(() => {
      fetchBusinessData();
    }, 500); // Small delay to ensure backend has processed the review
  };

  const handleLoginRedirect = (role = 'customer') => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/login/oauth2/authorization/google?role=${role}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
            <p className="text-gray-600 mb-4">The business you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              {business.imageData ? (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/businesses/${business.id}/image`}
                  alt={business.businessName}
                  className="w-full h-64 md:h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-64 md:h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${business.imageData ? 'hidden' : 'flex'}`}
              >
                <span className="text-white text-6xl font-bold">
                  {business.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{business.businessName}</h1>
              
              <div className="mb-4">
                <StarRating rating={business.averageRating} readOnly size={24} />
                <span className="ml-2 text-gray-600">
                  ({business.totalReviews} {business.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {business.phoneNumber && (
                <p className="text-gray-700 mb-2">
                  📞 <a href={`tel:${business.phoneNumber}`} className="hover:text-blue-600 transition-colors">{business.phoneNumber}</a>
                </p>
              )}

              {business.address && (
                <p className="text-gray-700 mb-4">📍 {business.address}</p>
              )}

              {business.description && (
                <p className="text-gray-600 mb-4">{business.description}</p>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap gap-2">
                {business.websiteUrl && (
                  <a
                    href={business.websiteUrl.startsWith('http') ? business.websiteUrl : `https://${business.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm transition-colors inline-flex items-center space-x-1"
                  >
                    <span>🌐</span>
                    <span>Website</span>
                  </a>
                )}
                {business.facebookUrl && (
                  <a
                    href={business.facebookUrl.startsWith('http') ? business.facebookUrl : `https://${business.facebookUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm transition-colors inline-flex items-center space-x-1"
                  >
                    <span>📘</span>
                    <span>Facebook</span>
                  </a>
                )}
                {business.instagramUrl && (
                  <a
                    href={business.instagramUrl.startsWith('http') ? business.instagramUrl : `https://${business.instagramUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-100 hover:bg-pink-200 px-3 py-1 rounded-lg text-sm transition-colors inline-flex items-center space-x-1"
                  >
                    <span>📷</span>
                    <span>Instagram</span>
                  </a>
                )}
                {business.twitterUrl && (
                  <a
                    href={business.twitterUrl.startsWith('http') ? business.twitterUrl : `https://${business.twitterUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm transition-colors inline-flex items-center space-x-1"
                  >
                    <span>🐦</span>
                    <span>Twitter</span>
                  </a>
                )}
                {business.linkedinUrl && (
                  <a
                    href={business.linkedinUrl.startsWith('http') ? business.linkedinUrl : `https://${business.linkedinUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm transition-colors inline-flex items-center space-x-1"
                  >
                    <span>💼</span>
                    <span>LinkedIn</span>
                  </a>
                )}
                {business.googleReviewUrl && (
                  <a
                    href={business.googleReviewUrl.startsWith('http') ? business.googleReviewUrl : `https://${business.googleReviewUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg text-sm transition-colors inline-flex items-center space-x-1"
                  >
                    <span>🔗</span>
                    <span>Google Reviews</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review Form or Login Prompt */}
          <div>
            {user ? (
              hasReviewed ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you!</h3>
                  <p className="text-green-700">You have already reviewed this business.</p>
                  <p className="text-green-600 text-sm mt-2">Your feedback helps other customers make informed decisions.</p>
                </div>
              ) : showReviewForm ? (
                <ReviewForm 
                  businessId={id} 
                  business={business}
                  onReviewSubmitted={handleReviewSubmitted} 
                />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
                  <p className="text-gray-600 mb-4">Help others by leaving a review for this business.</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 text-sm">
                      <strong>How it works:</strong> High ratings (4-5 stars) will redirect you to leave a Google review. 
                      Lower ratings (1-3 stars) will show a feedback form to help the business improve.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Write a Review
                  </button>
                </div>
              )
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                <p className="text-gray-600 mb-4">Please log in to leave a review for this business.</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleLoginRedirect('customer')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Login as Customer
                  </button>
                  <button
                    onClick={() => handleLoginRedirect('admin')}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Login as Business Owner
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  You can view business details without logging in, but an account is required to leave reviews.
                </p>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Customer Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-gray-400 text-4xl mb-3">⭐</div>
                <h4 className="font-medium text-gray-900 mb-2">No reviews yet</h4>
                <p className="text-gray-600 text-sm">Be the first to review this business!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;