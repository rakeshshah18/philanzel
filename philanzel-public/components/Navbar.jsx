"use client";
// Custom style for dropdown-item underline on hover
const customDropdownStyle = `
  .dropdown-menu .dropdown-item.text-white.active-underline {
    background: none !important;
    color: #fff !important;
    text-decoration: underline;
    text-decoration-color: #007bff;
    text-underline-offset: 3px;
    text-decoration-thickness: 2px;
    text-decoration-skip-ink: auto;
    box-shadow: none !important;
    display: inline-block;
  }
  .dropdown-menu .dropdown-item.text-white:hover, .dropdown-menu .dropdown-item.text-white:focus {
    background: none !important;
    color: #fff !important;
    text-decoration: underline;
    text-decoration-color: #007bff;
    text-underline-offset: 3px;
    text-decoration-thickness: 2px;
    text-decoration-skip-ink: auto;
    box-shadow: none !important;
    display: inline-block;
  }
  .nav-link.text-dark.active-underline {
    text-decoration: underline;
    text-decoration-color: #007bff;
    text-underline-offset: 3px;
    text-decoration-thickness: 2px;
    text-decoration-skip-ink: auto;
    display: inline-block;
  }
  .phone-link.text-dark:hover, .phone-link.text-dark:focus {
    color: #007bff !important;
  }
`;

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaYoutube, FaFacebook, FaLinkedin, FaInstagram, FaRegPaperPlane, FaRegEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Navbar = () => {
  const pathname = usePathname();
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <>
      <style>{customDropdownStyle}</style>
      <nav className="bg-white shadow-sm border-b text-dark" style={{ padding: 0, margin: 0, border: 0, height: '100px' }}>
        <div className="d-flex flex-row align-items-center justify-content-between w-100" style={{ padding: '0 360px', fontSize: '13px', marginTop: 0, paddingTop: 0, border: 0 }} >
          {/* Logo on the left */}
          <div style={{ minWidth: 120 }}>
            <img src="/philanzel-logo.png" alt="Logo" style={{ height: '90px' }} />
          </div>
          {/* Main content on the right */}
          <div className="d-flex flex-column align-items-end w-100" style={{ fontWeight: 600, fontSize: '14px' }}>
            {/* Upper info row */}
            <div className="d-flex flex-row align-items-start justify-content-end w-100" style={{ gap: '1.8rem', paddingTop: 0, marginTop: 0, lineHeight: 1 }}>
              <div className="d-flex align-items-center" style={{ lineHeight: 1, marginTop: 0 }}>
                <FaRegPaperPlane className="me-1" style={{ marginTop: 0, lineHeight: 1 }} />
                <a href="#" className="text-decoration-none text-dark" style={{ marginTop: 0, lineHeight: 1 }}>Join Million Dollar Club</a>
              </div>
              <div className="d-flex align-items-center" style={{ lineHeight: 1, marginTop: 0 }}>
                <FaRegEnvelope className="me-1" style={{ marginTop: 0, lineHeight: 1 }} />
                <a href="mailto:coach@philanzel.com" className="text-decoration-none text-dark" style={{ marginTop: 0, lineHeight: 1 }}>coach@philanzel.com</a>
              </div>
              <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
                <a href="#" className="text-dark" aria-label="YouTube"><FaYoutube size={16} /></a>
                <a href="#" className="text-dark" aria-label="Facebook"><FaFacebook size={15} /></a>
                <a href="#" className="text-dark" aria-label="Instagram"><FaInstagram size={15} /></a>
                <a href="#" className="text-dark" aria-label="LinkedIn"><FaLinkedin size={15} /></a>
              </div>
            </div>
            {/* Navigation row */}
            <div className="w-100 py-2 pt-3 " style={{ fontWeight: 600, paddingLeft: '20px' }}>
              <ul className="nav justify-content-end gap-0.5">
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark${pathname === '/' || pathname === '/#' ? ' active-underline' : ''}`}
                    href="/#"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark${pathname === '/#' ? ' active-underline' : ''}`}
                    href="/#"
                  >
                    About
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a className={`nav-link dropdown-toggle text-dark${pathname === '/services' ? ' active-underline' : ''}`} href="#" id="servicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Our Services
                  </a>
                  <ul className="dropdown-menu custom-dropdown-menu" aria-labelledby="servicesDropdown" style={{ borderRadius: 0, backgroundColor: '#2a3035ff' }}>
                    <li><a className="dropdown-item text-white" href="#">Retirement Solutions</a></li>
                    <li><a className="dropdown-item text-white" href="#">Mutual Fund Distribution</a></li>
                    <li><a className="dropdown-item text-white" href="#">Insurance</a></li>
                    <li><a className="dropdown-item text-white" href="#">Training & Handholding</a></li>
                    <li><a className="dropdown-item text-white" href="#">Alternative Investment Fund (AIF)</a></li>
                    <li><a className="dropdown-item text-white" href="#">Health Insurance</a></li>
                    <li><a className="dropdown-item text-white" href="#">Portfolio Management Services (PMS)</a></li>
                    <li><a className="dropdown-item text-white" href="#">PE FUND</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className={`nav-link dropdown-toggle text-dark${pathname === '/calculators' ? ' active-underline' : ''}`} href="#" id="calculatorsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Calculators
                  </a>
                  <ul className="dropdown-menu custom-dropdown-menu" aria-labelledby="calculatorsDropdown" style={{ borderRadius: 0, backgroundColor: '#2a3035ff' }}>
                    <li><a className="dropdown-item text-white" href="#">Systematic Investment Planner</a></li>
                    <li><a className="dropdown-item text-white" href="#">Lumpsum Investment</a></li>
                    <li><a className="dropdown-item text-white" href="#">Systematic Withdrawal Planner</a></li>
                    <li><a className="dropdown-item text-white" href="#">Pension</a></li>
                    <li><a className="dropdown-item text-white" href="#">Crorepati Calculator</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className={`nav-link dropdown-toggle text-dark${pathname === '/events' ? ' active-underline' : ''}`} href="#" id="eventsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Events
                  </a>
                  <ul className="dropdown-menu custom-dropdown-menu" aria-labelledby="eventsDropdown" style={{ borderRadius: 0, backgroundColor: '#2a3035ff' }}>
                    <li><a className="dropdown-item text-white" href="#">Philanzel Connect</a></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark${pathname === '/careers' ? ' active-underline' : ''}`}
                    href="/careers"
                  >
                    Careers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark${pathname === '/become-partner' ? ' active-underline' : ''}`}
                    href="/become-partner"
                  >
                    Become a Partner
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark${pathname === '/contact-us' ? ' active-underline' : ''}`}
                    href="/contact-us"
                  >
                    Contact Us
                  </Link>
                </li>
                <div className="d-flex flex-row align-items-center" style={{ gap: '8px', fontWeight: 'normal', borderLeft: '1.5px solid #d1d5db', borderRight: '1.5px solid #d1d5db', padding: '0 16px' }}>
                  <FaPhoneAlt size={18} className="text-dark" />
                  <div className='d-flex flex-column justify-content-center' style={{ gap: '2px' }}>
                    <span style={{ fontSize: '15px', margin: 0, fontWeight: 600 }}>Have any Question?</span>
                    <Link className="nav-link text-dark ps-0 py-0 phone-link" href="/" style={{ fontWeight: 700 }} >+91- 96 25 11 64 58</Link>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;