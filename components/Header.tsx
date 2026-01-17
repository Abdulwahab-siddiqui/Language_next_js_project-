'use client';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from './LanguageSwitch';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">MyApp</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <span className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer">
              {t('navigation.home')}
            </span>
            <span className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer">
              {t('navigation.about')}
            </span>
            <span className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer">
              {t('navigation.services')}
            </span>
            <span className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer">
              {t('navigation.contact')}
            </span>
            <span className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer">
              {t('navigation.blog')}
            </span>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center">
            <LanguageSwitch />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}