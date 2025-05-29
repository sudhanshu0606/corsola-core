"use client"

import React, { useState } from 'react';

import { useFormik } from 'formik';
import { toast } from "sonner";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { LoadingButton } from '@/components/wrappers/button';

import { useSessionStorage } from '@/store/storage';
import { DELETE } from '@/utilities/requests/DELETE';

interface IUnsubscriptionFormProps {
    stock: string;
    uuid: string;
    onSuccess?: () => void
}

const UnsubscriptionForm: React.FC<IUnsubscriptionFormProps> = ({
    stock,
    uuid,
    onSuccess
}) => {

    const [inputStock, setInputStock] = useState('');

    const { electron, setElectron, removeElectron } = useSessionStorage();

    const doesStockNameMatch = inputStock.trim().toLowerCase() === stock.trim().toLowerCase();

    const formik = useFormik({

        initialValues: { uuid },

        onSubmit: async (values, { setSubmitting }) => {

            if (!doesStockNameMatch) return;

            setSubmitting(true);

            try {

                const response = await DELETE(
                    '/api/subscription/unsubscribe',
                    values,
                    { headers: { 'Authorization': `Bearer ${electron}` } },
                    {
                        loading: "Unsubscribing ...",
                        success: "Unsubscription created successfully.",
                        error: "Error creating unsubscription",
                    }
                )

                const unwrapped = await response?.unwrap?.()
                unwrapped?.status === 200 && onSuccess?.()
            }

            catch (error) { toast.error('Failed to unsubscribe.') }

            finally { setSubmitting(false) }

        },

    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-2">

                <div className=' flex flex-col'>
                    <Label htmlFor="stock" className='whitespace-nowrap'>
                        Enter stock name to confirm unsubscription from :
                    </Label>
                    <span className='font-semibold'>{stock}</span>
                </div>

                <Input
                    id="stock"
                    name="stock"
                    type="text"
                    placeholder="Enter your stock"
                    required
                    autoComplete="off"
                    value={inputStock}
                    onChange={(e) => setInputStock(e.target.value)}
                />

                {(!doesStockNameMatch && inputStock.length > 0)
                    && (
                        <div className="flex items-center gap-2 text-sm text-red-600 animate-pulse border border-red-300 rounded-md px-3 py-2 bg-red-50 shadow-sm mt-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-10.46a.75.75 0 00-1.06-1.06L10 8.94 7.52 6.48a.75.75 0 10-1.06 1.06L8.94 10l-2.48 2.48a.75.75 0 101.06 1.06L10 11.06l2.48 2.48a.75.75 0 101.06-1.06L11.06 10l2.48-2.48z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>
                                Stock name does not match.
                                Please enter <strong className="font-semibold">{stock}</strong> to unsubscribe.
                            </span>
                        </div>
                    )}

            </div>

            <LoadingButton
                isSubmitting={formik.isSubmitting}
                loadingText="Unsubscribing ..."
                submitText="Unsubscribe"
                onClick={formik.submitForm}
                disabled={!doesStockNameMatch}
            />

        </form>
    );

};

export { UnsubscriptionForm };
