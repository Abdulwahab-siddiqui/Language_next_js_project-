'use client';
import { useEffect } from 'react';
import Header from './Header';
import '../lib/i18n';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Set initial direction based on saved language or default
        const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
        document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLanguage;
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
        </>
    );
}