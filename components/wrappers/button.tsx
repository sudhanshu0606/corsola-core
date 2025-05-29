import React from 'react';

import { Button } from '@/components/ui/button';

import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
    isSubmitting: boolean;
    loadingText: string;
    submitText: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isSubmitting,
    loadingText,
    submitText,
    onClick,
    type = 'submit',
    disabled = false,
}) => {
    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={isSubmitting || disabled}
            className={`relative flex items-center justify-center gap-2 cursor-pointer ${isSubmitting ? 'cursor-wait' : ''}`}
        >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isSubmitting ? loadingText : submitText}</span>
        </Button>
    );
};

export { LoadingButton };
