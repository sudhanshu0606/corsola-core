const channelGroups: Record<string, string[]> = {
    '📧 Email-Based': ['email'],
    '📱 SMS & Phone': ['sms', 'call', 'voicemail'],
    '💬 Messaging Apps': [
        'whatsapp', 'telegram', 'signal', 'viber', 'messenger', 'wechat', 'line'
    ],
    '💼 Work Collaboration Tools': ['slack', 'microsoft teams', 'discord'],
    '🌐 Social Media': ['facebook', 'instagram', 'twitter', 'linkedIn', 'threads']
}

const channelLabels: Record<string, string> = {
    email: 'Email',
    sms: 'SMS',
    call: 'Call',
    voicemail: 'Voicemail',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    signal: 'Signal',
    viber: 'Viber',
    messenger: 'Messenger',
    wechat: 'WeChat',
    line: 'LINE',
    slack: 'Slack',
    microsoftTeams: 'Microsoft Teams',
    discord: 'Discord',
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    threads: 'Threads',
}

const reports = [
    { key: 'dayEnd', title: 'Day End Reports' },
    { key: 'weekEnd', title: 'Week End Reports' },
    { key: 'monthEnd', title: 'Month End Reports' },
    { key: 'yearEnd', title: 'Year End Reports' }
]

const formatChannel = (channel: string) =>
    channelLabels[channel] || channel.charAt(0).toUpperCase() + channel.slice(1)

export { channelGroups, channelLabels, reports, formatChannel }