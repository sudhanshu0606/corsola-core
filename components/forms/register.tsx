"use client"

import React, { useState } from 'react'

import { useFormik } from 'formik'
import { toast } from "sonner"

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { LoadingButton } from '@/components/wrappers/button'

import { POST } from '@/utilities/requests/POST'

interface IRegisterFormProps { onSuccess?: () => void }

const RegisterForm: React.FC<IRegisterFormProps> = ({ onSuccess }) => {

    const [termsAccepted, setTermsAccepted] = useState(false)

    const formik = useFormik({

        initialValues: {
            username: '',
            email: '',
            password: '',
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            if (!termsAccepted) {
                toast.error("You must accept the Terms and Conditions.")
                setSubmitting(false)
                return
            }

            await formik.validateForm()
            if (!formik.isValid) {
                toast.error("Try entering some real values");
                setSubmitting(false)
                return
            }

            try {

                const response = await POST(
                    "https://corsola-authentication.vercel.app/api/auth/register",
                    values,
                    {},
                    {
                        loading: "Registering ...",
                        success: "Registration successful!",
                        error: "Registration failed. Please try again."
                    }
                )

                const unwrapped = await response?.unwrap?.()
                unwrapped?.status === 201 && onSuccess?.()

            } catch (error) { console.error("error") }

            finally { setSubmitting(false) }

        },

    })

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="ml-2">Username</Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 px-2">{formik.errors.username}</div>
                )}
            </div>

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

            <div className="flex items-center space-x-2 ml-1">
                <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked: boolean) => setTermsAccepted(checked)}
                />
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I hereby confirm that I have read, understood, and agree to be bound by the <a href='#' className='text-blue-600 hover:underline'>Terms and Conditions</a>.
                </label>
            </div>

            <LoadingButton
                isSubmitting={formik.isSubmitting}
                loadingText="Registering ..."
                submitText="Register"
                disabled={!termsAccepted}
            />

        </form>
    )
}

export { RegisterForm }
