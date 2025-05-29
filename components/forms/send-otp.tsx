"use client"

import React from 'react';

import { useFormik } from 'formik';
import { toast } from "sonner";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { LoadingButton } from '@/components/wrappers/button';

import { useVariables } from '@/store/variables';

import { POST } from '@/utilities/requests/POST';

interface ISendOTPFormProps { onSuccess?: () => void }

const SendOTPForm: React.FC<ISendOTPFormProps> = ({ onSuccess }) => {

    const { variables, setVariables } = useVariables();

    const formik = useFormik({

        initialValues: {
            email: '',
            password: '',
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            await formik.validateForm()
            if (!formik.isValid) { toast.error("Try entering some real values"); return }

            try {

                const response = await POST(
                    "https://corsola-authentication.vercel.app/api/send-otp",
                    values,
                    {},
                    {
                        loading: "Sending OTP ...",
                        success: "OTP sent successfully.",
                        error: "Error sending OTP",
                    }
                )

                const unwrapped = await response?.unwrap?.()
                unwrapped?.status === 200
                    ? (setVariables({ isOtpSent: true }), onSuccess?.())
                    : setVariables({ isOtpSent: false });

            } catch (error) { toast.error("error") }

            finally { setSubmitting(false) }

        },

    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="ml-2">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 px-2">{formik.errors.email}</div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="ml-2">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 px-2">{formik.errors.password}</div>
                )}
            </div>

            <LoadingButton
                isSubmitting={formik.isSubmitting}
                loadingText="Sending OTP ..."
                submitText="Send OTP"
                onClick={formik.submitForm}
            />

        </form>
    );
};

export { SendOTPForm };
