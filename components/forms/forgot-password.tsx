"use client"

import React from 'react'

import { useFormik } from 'formik'
import { toast } from "sonner"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { LoadingButton } from '@/components/wrappers/button'

import { POST } from '@/utilities/requests/POST'

interface IForgotPasswordFormProps { onSuccess?: () => void }

const ForgotPasswordForm: React.FC<IForgotPasswordFormProps> = ({ onSuccess }) => {

    const formik = useFormik({

        initialValues: {
            email: '',
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            await formik.validateForm()
            if (!formik.isValid) { toast.error("Try entering some real values"); return }

            try {

                const response = await POST(
                    "https://corsola-authentication.vercel.app/api/auth/forgot-password",
                    values,
                    {},
                    {
                        loading: "Sending password reset link ...",
                        success: "Password reset link sent to your email.",
                        error: "Something went wrong. Please try again.",
                    }
                )

                const unwrapped = await response?.unwrap?.()
                unwrapped?.status === 200 && onSuccess?.()

            } catch (error) { toast.error("error") }

            finally { setSubmitting(false) }

        },

    })

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

            <LoadingButton
                isSubmitting={formik.isSubmitting}
                loadingText="Submitting ..."
                submitText="Reset Password"
                onClick={formik.submitForm}
            />

        </form>
    )
}

export { ForgotPasswordForm }
