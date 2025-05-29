const SkeletonSuggestion = () => {
    return (
        <li className="px-4 py-3 border-b last:border-none animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </li>
    );
};

export { SkeletonSuggestion };