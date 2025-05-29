"use client"

import React from 'react'

import { useFormik } from 'formik'
import { toast } from "sonner"

import { Label } from '@/components/ui/label'
import { DatetimePicker } from '@/components/ui/datetime-picker'

import { LoadingButton } from '@/components/wrappers/button'

import { useSessionStorage } from '@/store/storage'
import { PATCH } from '@/utilities/requests/PATCH'

interface IPlayFormProps {
    stock: string;
    interval: string
    uuid: string
    onSuccess?: () => void
}

const PlayForm: React.FC<IPlayFormProps> = ({
    stock,
    interval,
    uuid,
    onSuccess
}) => {

    const { electron, setElectron, removeElectron } = useSessionStorage()

    const formik = useFormik({

        initialValues: {
            uuid: uuid,
            startDate: new Date(),
            interval: interval
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            try {

                const response = await PATCH(
                    '/api/subscription/play',
                    values,
                    { headers: { 'Authorization': `Bearer ${electron}` } },
                    {
                        loading: "Playing subscription...",
                        success: "Subscription played successfully.",
                        error: "Error playing subscription",
                    }
                )

                const unwrapped = await response?.unwrap?.()
                unwrapped?.status === 200 && onSuccess?.()

            }

            catch (error) { toast.error("Error playing subscription") }

            finally { setSubmitting(false) }

        },

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

    const { startDate } = formik.values
    const message = startDate && (
        <p className="text-center border border-blue-500 text-blue-700 bg-blue-100 p-4 rounded-md text-sm">
            Now you will receive notifications for {stock} stock price changes every {interval} minutes, starting from {formatDateWithoutSeconds(startDate)}.
        </p>
    )

    return (
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>

            <div className='flex flex-col gap-2'>
                <Label htmlFor='startDate' className='ml-2'>Start Date</Label>
                <DatetimePicker
                    value={formik.values.startDate}
                    onChange={(date) => formik.setFieldValue('startDate', date)}
                    format={[
                        ["months", "days", "years"],
                        ["hours", "minutes", "am/pm"],
                    ]}
                />
            </div>

            {message}

            <LoadingButton
                isSubmitting={formik.isSubmitting}
                loadingText="Pausing..."
                submitText="Pause Subscription"
                onClick={formik.submitForm}
                disabled={formik.values.startDate <= new Date()}
            />

        </form>
    )

}

export { PlayForm }