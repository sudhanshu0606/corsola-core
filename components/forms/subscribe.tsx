"use client"

import React from 'react'

import { useFormik } from 'formik'
import { toast } from "sonner"

import { DatetimePicker } from '@/components/ui/datetime-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import Search from '@/components/shared/search'
import { LoadingButton } from '@/components/wrappers/button'

import { useSessionStorage } from '@/store/storage'
import { useUser } from '@/store/user'

import { POST } from '@/utilities/requests/POST'

import { Suggestion } from '@/types'

interface ISubscritionFormProps { onSuccess?: () => void }

const SubscriptionForm: React.FC<ISubscritionFormProps> = ({ onSuccess }) => {

    const { electron, setElectron, removeElectron } = useSessionStorage();
    const { user, setUser } = useUser()

    const formik = useFormik({

        initialValues: {
            stock: null as Suggestion | null,
            interval: '',
            firstNotification: new Date(),
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            await formik.validateForm()
            if (!formik.isValid) { toast.error("Try entering some real values"); return }

            try {

                const response = await POST(
                    '/api/subscription/subscribe',
                    values,
                    { headers: { 'Authorization': `Bearer ${electron}` } },
                    {
                        loading: "Subscribing ...",
                        success: "Subscription created successfully.",
                        error: "Error creating subscription",
                    }
                )

                const unwrapped = await response?.unwrap?.()
                unwrapped?.status === 201 && onSuccess?.()

            }

            catch (error) { toast.error("error") }

            finally { setSubmitting(false) }

        }

    })

    const formatDateWithoutSeconds = (date: Date) => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const { stock, interval, firstNotification } = formik.values
    const message = stock && interval && firstNotification && (
        <p className="text-center border border-blue-500 text-blue-700 bg-blue-100 p-4 rounded-md text-sm">
            You will receive notifications for {stock['2. name']} stock price changes every {interval} minutes, starting from {formatDateWithoutSeconds(firstNotification)}.
        </p>
    )

    return (
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>

            <div className='flex flex-col gap-2'>
                <Search
                    regions={user?.regions ?? ["India/Bombay", "Paris"]}
                    onSelect={(item) => formik.setFieldValue('stock', item)}
                />
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor='interval' className='ml-2'>Interval</Label>
                <div className='flex justify-center items-center gap-4'>
                    <Input
                        id='interval'
                        name='interval'
                        type='number'
                        placeholder='10'
                        min='10'
                        value={interval}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span>Minutes</span>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor='firstNotification' className='ml-2'>First Notification</Label>
                <DatetimePicker
                    value={firstNotification}
                    onChange={(date) => formik.setFieldValue('firstNotification', date)}
                    format={[
                        ["months", "days", "years"],
                        ["hours", "minutes", "am/pm"],
                    ]}
                />
            </div>

            {message}

            <LoadingButton
                isSubmitting={formik.isSubmitting}
                loadingText="Subscribing ..."
                submitText="Subscribe"
                onClick={formik.submitForm}
            />

        </form>
    )
}

export { SubscriptionForm }
