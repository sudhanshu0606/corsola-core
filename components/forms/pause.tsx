"use client"

import React from 'react'

import { useFormik } from 'formik'
import { toast } from "sonner"

import { Label } from '@/components/ui/label'
import { DatetimePicker } from '@/components/ui/datetime-picker'

import { LoadingButton } from '@/components/wrappers/button'

import { useSessionStorage } from '@/store/storage'
import { PATCH } from '@/utilities/requests/PATCH'

interface IPauseFormProps {
    stock: string;
    interval: string
    uuid: string
    onSuccess?: () => void
}

const PauseForm: React.FC<IPauseFormProps> = ({
    stock,
    interval,
    uuid,
    onSuccess
}) => {

    const { electron, setElectron, removeElectron } = useSessionStorage()

    const formik = useFormik({

        initialValues: {
            uuid: uuid,
            resumeDate: new Date(),
            interval: interval,
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            try {

                const response = await PATCH(
                    '/api/subscription/pause',
                    values,
                    { headers: { 'Authorization': `Bearer ${electron}` } },
                    {
                        loading: "Pausing subscription...",
                        success: "Subscription paused successfully.",
                        error: "Error pausing subscription",
                    }
                )

                const unwrapped = await response?.unwrap?.()
                unwrapped?.status === 200 && onSuccess?.()

            }

            catch (error) { toast.error("Error pausing subscription") }

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

    const { resumeDate } = formik.values
    const message = resumeDate && (
        <p className="text-center border border-blue-500 text-blue-700 bg-blue-100 p-4 rounded-md text-sm">
            Now you will receive notifications for {stock} stock price changes every {interval} minutes, starting from {formatDateWithoutSeconds(resumeDate)}.
        </p>
    )

    return (
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>

            <div className='flex flex-col gap-2'>
                <Label htmlFor='resumeDate' className='ml-2'>Resume Date</Label>
                <DatetimePicker
                    value={formik.values.resumeDate}
                    onChange={(date) => formik.setFieldValue('resumeDate', date)}
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
                disabled={formik.values.resumeDate <= new Date()}
            />

        </form>
    )

}

export { PauseForm }