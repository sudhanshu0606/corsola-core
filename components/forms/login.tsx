"use client"

import React from 'react';

import { useFormik } from 'formik';
import { toast } from "sonner";

import { ForgotPasswordForm } from '@/components/forms/forgot-password';
import { SendOTPForm } from '@/components/forms/send-otp';
import { RegisterForm } from '@/components/forms/register';

import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from '@/components/ui/label';

import { LoadingButton } from '@/components/wrappers/button';
import { Modal } from '@/components/wrappers/modal';

import { useLocalStorage, useSessionStorage } from '@/store/storage';
import { useVariables } from '@/store/variables';

import { POST } from '@/utilities/requests/POST';

interface ILoginFormProps { onSuccess?: () => void }

const LoginForm: React.FC<ILoginFormProps> = ({ onSuccess }) => {

    const { proton, setProton, removeProton } = useLocalStorage();
    const { electron, setElectron, removeElectron } = useSessionStorage();

    const { variables, setVariables } = useVariables();

    const formik = useFormik({

        initialValues: {
            email: '',
            password: '',
            otp: '',
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            await formik.validateForm()
            if (!formik.isValid) { toast.error("Try entering some real values"); return }

            try {

                const response = await POST(
                    "https://corsola-authentication.vercel.app/api/auth/login",
                    values,
                    {},
                    {
                        loading: "Logging in...",
                        success: "Login successful!",
                        error: "Login failed. Please try again."
                    }
                )

                const unwrapped = await response?.unwrap?.()
                unwrapped?.status === 200 && onSuccess?.()

                const proton = await unwrapped?.data?.refreshToken
                const electron = await unwrapped?.data?.jwtToken

                proton && setProton(proton)
                electron && setElectron(electron)

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

            {variables?.isOtpSent ? (

                <div className="flex flex-col">
                    <Label htmlFor="otp" className="ml-2">OTP</Label>
                    <div className='flex justify-center items-center'>
                        <InputOTP
                            maxLength={8}
                            value={formik.values.otp}
                            onChange={(value) => formik.setFieldValue('otp', value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={6} />
                                <InputOTPSlot index={7} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {formik.touched.otp && formik.errors.otp && (
                        <div className="text-red-500 px-2">{formik.errors.otp}</div>
                    )}
                </div>

            ) : (

                <Modal
                    trigger={<Label htmlFor="" className="cursor-pointer px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors duration-200">Send OTP</Label>}
                    title="Send OTP"
                    description="Enter your email address to receive an OTP for verification."
                    content={<SendOTPForm />}
                />

            )}

            <div className="flex justify-between items-center px-2">
                <Modal
                    trigger={<Label htmlFor="" className="cursor-pointer">Forgot Password?</Label>}
                    title="Reset Your Password"
                    description="Enter your email address to receive instructions on how to reset your password and regain access to your account."
                    content={<ForgotPasswordForm />}
                />
                <Modal
                    trigger={<Label htmlFor="" className="cursor-pointer">Register</Label>}
                    title="Create a New Account"
                    description="Sign up now to access your dashboard and start managing your tasks. It’s quick and easy!"
                    content={<RegisterForm />}
                />
            </div>

            <LoadingButton
                isSubmitting={formik.isSubmitting}
                loadingText="Logging In..."
                submitText="Log In"
                onClick={formik.submitForm}
            />

        </form>
    );
};

export { LoginForm };
