import React from 'react';
import { CustomArrowProps } from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArrowProps extends CustomArrowProps {
    direction: 'prev' | 'next';
}

const Arrow: React.FC<ArrowProps> = ({ className, onClick, direction }) => {
    const isPrev = direction === 'prev';
    return (
        <button
            className={`${className} custom-slick-arrow ${isPrev ? 'prev-arrow' : 'next-arrow'}`}
            onClick={onClick}
            aria-label={isPrev ? 'Previous slide' : 'Next slide'}
        >
            { isPrev
                ? <ChevronLeft size={24} />
                : <ChevronRight size={24} />
            }
        </button>
    );
};

export const PrevArrow = (props: CustomArrowProps) => <Arrow {...props} direction="prev" />;
export const NextArrow = (props: CustomArrowProps) => <Arrow {...props} direction="next" />;
