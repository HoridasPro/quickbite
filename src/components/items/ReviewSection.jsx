"use client";

import React from 'react';
import reviewsData from '@/data/reviews.json';

const ReviewSection = ({ itemId }) => {
    const itemReviews = reviewsData.filter(review => review.itemId === itemId);

    return (
        <div className="mt-12 border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Ratings & Reviews <span className="text-gray-400 text-sm font-normal">({itemReviews.length})</span>
            </h3>
            
            {itemReviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet. Be the first to try it!</p>
            ) : (
                <div className="space-y-6">
                    {itemReviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-900">{review.user}</span>
                                <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;