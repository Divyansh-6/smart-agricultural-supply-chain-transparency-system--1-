import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';

interface ProductRatingProps {
  batchId: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

const ProductRating: React.FC<ProductRatingProps> = ({ batchId }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Jane Smith',
      rating: 5,
      comment: 'Excellent quality produce! Very fresh and tasty.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      userName: 'Mike Johnson',
      rating: 4,
      comment: 'Good quality and I appreciate knowing where it came from.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !userName.trim()) return;

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userName,
      rating,
      comment,
      date: new Date()
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
    setUserName('');
  };

  const calculateAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const averageRating = calculateAverageRating();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Product Ratings & Reviews</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                className={`w-5 h-5 ${
                  star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {averageRating.toFixed(1)} ({reviews.length} reviews)
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmitReview} className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Write a Review</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rating
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="mr-1 focus:outline-none"
              >
                <FiStar
                  className={`w-6 h-6 ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={rating === 0 || !userName.trim()}
        >
          Submit Review
        </button>
      </form>

      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Customer Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-1">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{review.userName}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {review.date.toLocaleDateString()}
                </p>
                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductRating;