import { create } from 'zustand'

import { POST } from '@/utilities/requests/POST'
import { IProfiles, ISubscription } from '@/interfaces'

interface INotificationsStore {
    subscription: ISubscription | null
    setSubscription: (subscription: ISubscription) => void
    enabledChannel: Record<string, boolean>
    toggleChannel: (channel: string) => void
    enabledProfiles: IProfiles
    toggleProfile: (channel: keyof IProfiles, profile: string) => void
    setEnabledProfiles: (profiles: IProfiles) => void
    save: (token: string) => Promise<void>
}

const useNotificationsStore = create<INotificationsStore>((set, get) => ({

    subscription: null,

    setSubscription: (subscription) => set({ subscription }),

    enabledChannel: {},

    toggleChannel: (channel) =>
        set((state) => {
            const isEnabled = !!state.enabledChannel[channel]
            return {
                enabledChannel: isEnabled ? {} : { [channel]: true }
            }
        }),

    enabledProfiles: {
        email: [],
        sms: [],
        call: [],
        voicemail: [],
        whatsapp: [],
        telegram: [],
        signal: [],
        viber: [],
        messenger: [],
        wechat: [],
        line: [],
        slack: [],
        microsoftTeams: [],
        discord: [],
        facebook: [],
        instagram: [],
        twitter: [],
        linkedin: [],
        threads: [],
    },

    toggleProfile: (channel, profile) =>
        set((state) => {
            const current = state.enabledProfiles[channel] || []
            const isAlreadyEnabled = current.includes(profile)

            const updatedProfiles = isAlreadyEnabled
                ? current.filter(p => p !== profile)
                : [...current, profile]

            return {
                enabledProfiles: {
                    ...state.enabledProfiles,
                    [channel]: updatedProfiles
                }
            }
        }),

    setEnabledProfiles: (profiles:IProfiles) => set({ enabledProfiles: profiles }),

    save: async (token: string) => {
        
        const { subscription, enabledProfiles } = get()

        await POST(
            '/api/notifications/save',
            {
                subscriptionId: subscription?.uuid,
                notifications: enabledProfiles
            },
            {
                headers: { 'Authorization': `Bearer ${token}` }
            },
            {
                loading: "Saving notification preferences . . .",
                success: "Notification preferences saved successfully",
                error: "Error saving notification preferences",
            }
        )

    }

}))

export { useNotificationsStore }
