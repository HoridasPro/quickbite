"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

const ReviewSection = ({ itemId, reviews = [], onReviewAdded }) => {
    const { data: session } = useSession();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!session?.user) {
            Swal.fire("Wait!", "Please login to submit a review", "warning");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: itemId, // This must match the ID used in the GET request
                    user: session.user.name || "Anonymous",
                    rating,
                    comment
                })
            });

            const data = await res.json();
            if (data.success) {
                setComment("");
                setRating(5);
                // Trigger the parent to re-fetch the reviews list
                if (onReviewAdded) onReviewAdded();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Review Posted',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire("Error", data.message || "Failed to submit review", "error");
            }
        } catch (error) {
            console.error("Review submit error:", error);
            Swal.fire("Error", "An unexpected error occurred", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-12 border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Ratings & Reviews <span className="text-gray-400 text-sm font-normal">({reviews.length})</span>
            </h3>

            {/* Review Form */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Leave a Review</h4>
                {!session ? (
                    <p className="text-sm text-gray-500 italic">Please log in to leave a review.</p>
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
                                        <svg className={`w-6 h-6 transition-colors ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
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
                            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none h-24 text-gray-800"
                            required
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition disabled:bg-gray-300 cursor-pointer shadow-sm"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>
            
            {/* Reviews List */}
            {reviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet. Be the first to try it!</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review, index) => (
                        <div key={review._id || index} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm transition-hover hover:shadow-md">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-900">{review.user}</span>
                                <span className="text-xs text-gray-400">
                                    {review.date ? new Date(review.date).toLocaleDateString() : 'Recent'}
                                </span>
                            </div>
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;