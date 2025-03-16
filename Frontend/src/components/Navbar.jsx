import { useState } from "react";
import { useTranslation } from "react-i18next";
import xd from '../assets/xd.png'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../actions/userActions';

import React from 'react'

export default function Navbar() {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector(state => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const logoutUser = async (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <div className="fixed top-0 z-50 w-full bg-gray-800 shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/">
            <img className="h-8 w-auto" src={xd} alt="Logo" />
          </a>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="/" className="text-white hover:text-gray-300">{t('navbar.dashboard')}</a>
          <a href="/telemedicine" className="text-white hover:text-gray-300">{t('navbar.telemedicine')}</a>
          <a href="/analysis" className="text-white hover:text-gray-300">{t('navbar.analysis')}</a>
          <a href="health" className="text-white hover:text-gray-300">{t('navbar.health_tips')}</a>
          <a href="/consult" className="text-white hover:text-gray-300">{t('navbar.consult')}</a>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <select
            onChange={changeLanguage}
            value={i18n.language}
            className="p-2 bg-gray-700 text-white rounded-md text-xs"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
          {!isAuthenticated ? (
            <a href="/login" className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium">Login</a>
          ) : (
            <button onClick={logoutUser} className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium">Logout</button>
          )}
          <a href="/account">
            <img className="w-8 h-8 rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Profile" />
          </a>
        </div>
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✖' : '☰'}
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white space-y-2 p-4">
          <a href="/" className="block py-2">{t('navbar.dashboard')}</a>
          <a href="#" className="block py-2">{t('navbar.telemedicine')}</a>
          <a href="#" className="block py-2">{t('navbar.analysis')}</a>
          <a href="#" className="block py-2">{t('navbar.health_tips')}</a>
          <a href="/consult" className="block py-2">{t('navbar.consult')}</a>
          <div className="flex justify-between items-center py-2">
            <select
              onChange={changeLanguage}
              value={i18n.language}
              className="p-2 bg-gray-700 text-white rounded-md text-xs"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
            {!isAuthenticated ? (
              <a href="/login" className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium">Login</a>
            ) : (
              <button onClick={logoutUser} className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium">Logout</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
