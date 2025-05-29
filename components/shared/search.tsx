"use client"

import React, { useCallback, useEffect, useState } from 'react'

import axios from 'axios'
import { useDebounce } from '@uidotdev/usehooks'

import { Input } from '@/components/ui/input'
import { SkeletonSuggestion } from '@/components/skeletons/suggestions'

import { Suggestion } from '@/types'

import { Loader2, Lock, X } from 'lucide-react'

const API_KEYS = [
    "JA5JCODWU2QKUUWY",
    "33AC8HCCEXTM09XQ",
    "GKWWM87GZLKLPD69",
    "NG3WAWJD382N4IY4",
    "YLXPGQ99R90YRULB",
    "TNWJCYJE7ICFZK4G",
    "50BKPQZIQAQLCG86"
];

const API_KEY = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];

interface ISearchResponse {
    bestMatches?: Suggestion[];
    Information?: string;
};

interface ISearchProps {
    regions: string[]
    onSelect?: (item: Suggestion | null) => void;
};

const Search = ({ regions, onSelect }: ISearchProps) => {

    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selected, setSelected] = useState<Suggestion | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const debounced = useDebounce(input, 500);

    const fetchSuggestions = useCallback(async (query: string, signal: AbortSignal) => {

        if (selected) return;

        setLoading(true);
        setError('');

        try {

            const URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`;
            const response = await axios.get(URL, { signal });

            const { bestMatches, Information }: ISearchResponse = response?.data;

            if (Information) {
                setError("There was an error fetching suggestions. Please try again later.");
                setSuggestions([]);
                return;
            }

            if (bestMatches) {
                const filtered = bestMatches.filter((item: Suggestion) => item['3. type'] === 'Equity');
                setSuggestions(filtered);
                return;
            }

        } catch (error: any) {

            if (axios.isCancel(error)) return;
            setError('Failed to fetch suggestions.');
            setSuggestions([]);

        } finally { setLoading(false) }

    }, [selected]);

    useEffect(() => {
        if (!debounced) {
            setSuggestions([]);
            setError('');
            return;
        }

        const controller = new AbortController();
        fetchSuggestions(debounced, controller.signal);

        return () => controller.abort();
    }, [debounced, fetchSuggestions]);

    const handleSelect = (item: Suggestion) => {
        setSelected(item);
        setInput(item['2. name']);
        setSuggestions([]);
        setError('');
        onSelect?.(item);
    };

    return (
        <section className='flex flex-col gap-2 relative'>

            <div className="relative w-full">
                <Input
                    type="text"
                    value={input}
                    placeholder={loading ? 'Searching . . .' : 'Search for a stock or a company'}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!!selected}
                    className={`${(loading || input) ? 'pr-10' : ''}`}
                />

                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    </div>
                )}

                {!loading && input && (
                    <button
                        onClick={() => {
                            setInput('');
                            setSuggestions([]);
                            setSelected(null);
                            setError('');
                        }}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear input"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {loading && (
                <ul className="absolute top-full mt-2 w-full z-10 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto scrollbar-hide">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonSuggestion key={index} />
                    ))}
                </ul>
            )}

            {error && <p className='text-red-500 text-xs ml-2'>{error}</p>}

            {(!loading && !error) && suggestions.length > 0 && (
                <ul className="absolute top-full mt-2 w-full z-10 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto scrollbar-hide" role="listbox">
                    {suggestions.map((item, index) => {
                        const region = item['4. region'];
                        const isAllowedRegion = regions.includes(region);

                        return (
                            <li
                                key={item['1. symbol']}
                                onClick={() => isAllowedRegion && handleSelect(item)}
                                className={`px-4 py-3 border-b last:border-none transition-colors duration-150 ${isAllowedRegion
                                    ? 'cursor-pointer hover:bg-gray-100'
                                    : 'cursor-not-allowed bg-gray-50 text-gray-400'
                                    }`}
                                role="option"
                            >
                                <div className='flex items-center justify-between'>
                                    <div className="text-sm font-semibold flex flex-col justify-between">
                                        <span>{item['2. name']}</span>
                                        <div className="text-xs text-gray-500">{item['1. symbol']} — {region}</div>
                                    </div>
                                    {!isAllowedRegion && (
                                        <div className='flex items-center gap-2'>
                                            <span className='text-xs font-semibold'>Upgrade</span>
                                            <span title="Restricted"><Lock size={14} /></span>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {input && (!loading && !error && !selected) && suggestions.length === 0 && (
                <div className="text-sm text-gray-500 bg-gray-100 border border-gray-300 px-3 py-2 rounded">
                    No Stocks found.
                </div>
            )}

        </section>
    )
};

export default Search;
