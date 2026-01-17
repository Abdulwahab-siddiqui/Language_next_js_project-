'use client';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {t('common.welcome')}
        </h1>
        <p className="text-lg text-gray-600">
          This is a multilingual Next.js application with internationalization support.
        </p>
      </div>
    </div>
  );
}
