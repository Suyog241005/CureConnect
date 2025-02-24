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

  const products = [
    {
      id: 1,
      name: 'Basic Tee',
      href: '#',
      imageSrc: 'https://beetroot.co/wp-content/uploads/sites/2/2024/05/Preview_Telemedicine-trends-2024.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    // More products...
  ]



  const logoutUser = async (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  // const navigation = [
  //   { name: 'Dashboard', href: '#', current: true },
  //   { name: 'Team', href: '#', current: false },
  //   { name: 'Projects', href: '#', current: false },
  //   { name: 'Calendar', href: '#', current: false },
  // ]

  // function classNames(...classes) {
  //   return classes.filter(Boolean).join(' ')
  // }

  return (
    <div className="fixed top-0 z-50 mt-6 w-screen px-10">
      <nav className="bg-gray-800 rounded-2xl">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <a href="/">
                  <img className="h-8 w-auto" src={xd} alt="Your Company" />
                </a>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-10">
                  <a href="/" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">{t('navbar.dashboard')}</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{t('navbar.telemedicine')}</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{t('navbar.analysis')}</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{t('navbar.chatbot')}</a>
                  <a href="/consult" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{t('navbar.consult')}</a>
                </div>
              </div>
              <div className="flex items-center">
                <select
                  onChange={changeLanguage}
                  value={i18n.language}
                  className="p-2 border border-white-400 rounded-md bg-gray-500 text-white ml-12 text-xs"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3">
                <a href="/login">
                  {!isAuthenticated ?
                    <button className="relative flex rounded-md min-w-6 font-medium bg-white px-2 py-1 bg text-sm focus:ring-2 focus:ring-white">
                      Login
                    </button>
                    :
                    <button onClick={logoutUser} className="relative flex rounded-md min-w-6 font-medium bg-white px-2 py-1 bg text-sm focus:ring-2 focus:ring-white">
                      Logout
                    </button>
                  }
                </a>
              </div>
              <div className="relative ml-3">
                <a href="/account">
                  <div className="relative flex rounded-md w-8 h-8 font-medium bg-white bg text-sm focus:ring-2 focus:ring-white">
                    <img className="rounded-md" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Profile Image" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <a href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">{t('navbar.dashboard')}</a>
              <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{t('navbar.telemedicine')}</a>
              <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{t('navbar.analysis')}</a>
              <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{t('navbar.chatbot')}</a>
            </div>
          </div>
        )}
      </nav>

    </div>
  );
}
