import React, { useState, useEffect } from 'react';
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
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchBusinessData();
  }, [id, user]);

  const fetchBusinessData = async () => {
    try {
      // Fetch business details
      const businessResponse = await businessService.getBusinessById(id);
      setBusiness(businessResponse.data);

      // Fetch reviews
      const reviewsResponse = await reviewService.getReviewsByBusiness(id);
      setReviews(reviewsResponse.data);

      // Check if user has already reviewed (if logged in)
      if (user) {
        const hasReviewedResponse = await reviewService.hasReviewedBusiness(id);
        setHasReviewed(hasReviewedResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    fetchBusinessData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Business not found</h2>
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
                  src={businessService.getBusinessImage(business.id)}
                  alt={business.businessName}
                  className="w-full h-64 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {business.businessName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
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
                  📞 <a href={`tel:${business.phoneNumber}`} className="hover:text-blue-600">{business.phoneNumber}</a>
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
                    href={business.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    🌐 Website
                  </a>
                )}
                {business.facebookUrl && (
                  <a
                    href={business.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    📘 Facebook
                  </a>
                )}
                {business.instagramUrl && (
                  <a
                    href={business.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-100 hover:bg-pink-200 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    📷 Instagram
                  </a>
                )}
                {business.twitterUrl && (
                  <a
                    href={business.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    🐦 Twitter
                  </a>
                )}
                {business.linkedinUrl && (
                  <a
                    href={business.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    💼 LinkedIn
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
                </div>
              ) : showReviewForm ? (
                <ReviewForm businessId={id} onReviewSubmitted={handleReviewSubmitted} />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
                  <p className="text-gray-600 mb-4">Help others by leaving a review for this business.</p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
              )
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                <p className="text-gray-600 mb-4">Please log in to leave a review for this business.</p>
                <button
                  onClick={() => window.location.href = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/google`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login to Review
                </button>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
            {reviews.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
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