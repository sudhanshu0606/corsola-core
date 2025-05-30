"use client"

import React, { useEffect, useState } from 'react'

import axios from 'axios';
import { toast } from 'sonner';

import { useSessionStorage } from '@/store/storage';

import { ISubscription } from '@/interfaces';

interface IOverviewProps { subscription: ISubscription | null }

type GlobalQuote = {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
};

const API_KEY = "YLXPGQ99R90YRULB"

const Overview = ({ subscription }: IOverviewProps) => {

    const [quote, setQuote] = useState<GlobalQuote | null>(null);

    const [status, setStatus] = useState({ isLoading: true });
    const [error, setError] = useState<string | null>(null);

    const { electron, setElectron, removeElectron } = useSessionStorage();

    useEffect(() => {

        if (!electron || !subscription?.symbol) return;

        const fetchStockData = async () => {

            try {

                setError(null);
                setStatus(prev => ({ ...prev, isLoading: true }));

                const URL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${subscription?.symbol}&apikey=${API_KEY}`;
                const { data } = await axios.get("");

                const quote = data["Global Quote"] as GlobalQuote;
                if (!quote) {
                    setError("No quote data available.");
                    return;
                }

                setQuote(quote);

            } catch (error) {

                setError("Failed to fetch real-time stock data.");
                toast.error("Failed to fetch real-time stock data. Please try again later.");

            } finally { setStatus(prev => ({ ...prev, isLoading: false })) }

        };

        fetchStockData();

    }, [subscription?.symbol]);

    return (
        <section>overview</section>
    )
}

export default Overview