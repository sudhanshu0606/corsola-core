import React from 'react';

const SubscriptionSkeleton = ({
    className
}: {
    className?: string
}) => {
    return (
        <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
    );
};

export { SubscriptionSkeleton };