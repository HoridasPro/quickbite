"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const ReviewSection = ({ itemId, reviews = [], onReviewAdded }) => {
    const { data: session } = useSession();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.user) {
            alert("Please login to submit a review");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId,
                    user: session.user.name || "Anonymous",
                    rating,
                    comment
                })
            });

            const data = await res.json();
            if (data.success) {
                setComment("");
                setRating(5);
                onReviewAdded(); 
            } else {
                alert(data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-12 border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Ratings & Reviews <span className="text-gray-400 text-sm font-normal">({reviews.length})</span>
            </h3>

            <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Leave a Review</h4>
                {!session ? (
                    <p className="text-sm text-gray-500">Please log in to leave a review.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Rating:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none cursor-pointer"
                                    >
                                        <svg className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this item..."
                            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 resize-none h-24"
                            required
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition disabled:bg-gray-400 cursor-pointer"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>
            
            {reviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet. Be the first to try it!</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-900">{review.user}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20">
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