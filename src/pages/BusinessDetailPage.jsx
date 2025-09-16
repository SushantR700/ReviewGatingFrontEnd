import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StarRating from '../components/common/StarRating';
import ReviewForm from '../components/review/ReviewForm';
import ReviewCard from '../components/review/ReviewCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services/businessService';
import { reviewService } from '../services/reviewService';

const BusinessDetailPage = ({ businessIdentifier }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Helper function to check if identifier is numeric (ID) or text (business name)
  const isNumericId = (identifier) => {
    return /^\d+$/.test(identifier);
  };

  // Helper function to create business slug from name
  const createBusinessSlug = (businessName) => {
    if (!businessName) return '';
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const fetchBusinessData = useCallback(async () => {
    if (!businessIdentifier) {
      setError('No business identifier provided');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching business data for identifier:', businessIdentifier);
      
      let businessResponse;
      
      // Check if identifier is a numeric ID or business name
      if (isNumericId(businessIdentifier)) {
        console.log('Using ID-based lookup');
        businessResponse = await businessService.getBusinessById(businessIdentifier);
      } else {
        console.log('Using name-based lookup');
        businessResponse = await businessService.getBusinessByName(businessIdentifier);
      }

      const businessData = businessResponse.data;
      setBusiness(businessData);

      // Update URL to use correct business name slug if we found the business
      if (businessData && businessData.businessName) {
        const correctSlug = createBusinessSlug(businessData.businessName);
        const currentPath = location.pathname.substring(1); // Remove leading slash
        
        if (currentPath !== correctSlug) {
          console.log('Updating URL from', currentPath, 'to', correctSlug);
          navigate(`/${correctSlug}`, { replace: true });
        }
      }

      // Fetch reviews using business ID - Always fetch public reviews since customers don't need to login
      if (businessData && businessData.id) {
        console.log('Fetching public reviews for business:', businessData.id);
        const reviewsResponse = await reviewService.getReviewsByBusiness(businessData.id);
        setReviews(reviewsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch business data:', error);
      
      if (error.response?.status === 404) {
        setError('Business not found. The business you\'re looking for doesn\'t exist or may have been removed.');
      } else {
        setError('Failed to load business information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [businessIdentifier, location.pathname, navigate]);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  // Enhanced review submission handler with better refresh logic
  const handleReviewSubmitted = () => {
    console.log('=== Review/Feedback submitted, refreshing data ===');
    setShowReviewForm(false);
    
    // Force a complete refresh of all data to show the new review
    // Use a longer delay to ensure all backend processing is complete
    setTimeout(() => {
      console.log('Refreshing business data after review submission...');
      fetchBusinessData();
    }, 1000); // Increased delay to ensure backend processing is complete
  };

  const handleBusinessOwnerLogin = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/login/oauth2/authorization/google?role=admin`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
            <p className="text-gray-600 mb-4">The business you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse All Businesses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              {business.imageName ? (
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
                className={`w-full h-64 md:h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${business.imageName ? 'hidden' : 'flex'}`}
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
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review Form - Always show for all users */}
          <div>
            {/* Check if user is business owner viewing their own business */}
            {user && user.role === 'ADMIN' && business.createdBy?.id === user.id ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Business Owner View</h3>
                <p className="text-blue-700">You are viewing your business as the owner.</p>
                <p className="text-blue-600 text-sm mt-2">You can see all customer reviews below. Business owners cannot leave reviews on their own businesses.</p>
              </div>
            ) : showReviewForm ? (
              <ReviewForm 
                businessId={business.id} 
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
                  <p className="text-blue-700 text-sm mt-2">
                    <strong>No account needed!</strong> You can review as a guest or provide your contact information.
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Write a Review
                </button>
                
                {/* Business Owner Login Option */}
                {!user && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Are you the business owner?</p>
                    <button
                      onClick={handleBusinessOwnerLogin}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Login to Manage Your Business
                    </button>
                  </div>
                )}
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