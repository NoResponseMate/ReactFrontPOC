import React from 'react';
import { ProductReview } from '../../types/Product';
import { IconStar } from '@tabler/icons-react';

interface ReviewSummaryProps {
    reviews: ProductReview[];
    productCode: string;
    allReviewCount: number;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ reviews, productCode, allReviewCount }) => {
    const averageRating =
        reviews.length > 0
            ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
            : 0;

    const renderStars = (rating: number) => (
        <div className="fs-4 review-stars d-flex gap-1">
            {[...Array(5)].map((_, index) => (
                <IconStar
                    key={index}
                    stroke={2}
                    size={20}
                    fill={index < rating ? 'currentColor' : 'none'}
                />
            ))}
        </div>
    );

    return allReviewCount > 0 ? (
        <div className="row mb-2">
            <div className="col-md-auto">{renderStars(averageRating)}</div>
            <div className="col-md-auto">
                {allReviewCount} review{allReviewCount !== 1 && 's'}
            </div>
            <a href={`/product/${productCode}/review/new`} className="col-md-auto">
                Add your review
            </a>
        </div>
    ) : (
        <div className="row mb-2">
            <div className="col-md-auto">{renderStars(0)}</div>
            <div className="col-md-auto">0 reviews</div>
            <a href={`/product/${productCode}/review/new`} className="col-md-auto">
                Add your review
            </a>
        </div>
    );
};

export default ReviewSummary;
