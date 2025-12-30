'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, Calendar, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../business-contexts/LanguageContext';
import { useAuth } from '../business-contexts/AuthContext';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import tr from 'react-phone-number-input/locale/tr.json';
import en from 'react-phone-number-input/locale/en.json';
import el from 'react-phone-number-input/locale/el.json';
import businessCountries from '../lib/businessCountries.json';
import TermsModal from './TermsModal';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  // Modal modları: 'login' | 'register' | 'forgotPassword'
  const [modalMode, setModalMode] = useState('login');
  const { translate, currentLanguage } = useLanguage();
  
  // Forgot password state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  
  // Backward compatibility
  const isLoginMode = modalMode === 'login';
  
  // Ülke listesini dile göre hazırla - Kıbrıs ve Türkiye en başta
  const countries = useMemo(() => {
    const allCountries = businessCountries.map(country => {
      let name = country.name; // default English
      if (currentLanguage === 'tr') {
        name = country.turkish_name;
      } else if (currentLanguage === 'el') {
        name = country.greek_name_gr;
      }
      return {
        code: country.code,
        name: name
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    
    // Kıbrıs ve Türkiye'yi en başa al
    const cyprus = allCountries.find(c => c.code === 'CY');
    const turkey = allCountries.find(c => c.code === 'TR');
    const others = allCountries.filter(c => c.code !== 'CY' && c.code !== 'TR');
    
    return [cyprus, turkey, ...others].filter(Boolean);
  }, [currentLanguage]);
  
  // Telefon input için locale seç
  const phoneLocale = useMemo(() => {
    if (currentLanguage === 'tr') return tr;
    if (currentLanguage === 'el') return el;
    return en; // default English
  }, [currentLanguage]);
  
  // Telefon input için default ülke - Rumca için Kıbrıs, diğerleri için Türkiye
  const phoneDefaultCountry = useMemo(() => {
    return currentLanguage === 'el' ? 'CY' : 'TR';
  }, [currentLanguage]);
  
  // Şehir listeleri - sadece Kıbrıs ve Türkiye için
  // Kıbrıs şehirleri - dil desteğiyle
  const cyprusCitiesData = {
    tr: ['Lefkoşa', 'Gazimağusa', 'Girne', 'Güzelyurt', 'Lefke', 'İskele', 'Limasol', 'Larnaka', 'Baf'],
    en: ['Nicosia', 'Famagusta', 'Kyrenia', 'Morphou', 'Lefka', 'Iskele', 'Limassol', 'Larnaca', 'Paphos'],
    el: ['Λευκωσία', 'Αμμόχωστος', 'Κερύνεια', 'Μόρφου', 'Λεύκα', 'Ίσκελε', 'Λεμεσός', 'Λάρνακα', 'Πάφος']
  };
  
  const cyprusCities = cyprusCitiesData[currentLanguage] || cyprusCitiesData.en;
  
  const turkeyCities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
    'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
    'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
    'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
    'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
    'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis',
    'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
    'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
    'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Şırnak', 'Sivas',
    'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
  ];
  
  // Modal açıldığında scroll'u kontrol et
  useEffect(() => {
    if (isOpen) {
      // Mevcut scroll pozisyonunu kaydet
      const scrollY = window.scrollY;
      
      // Body scroll'u tamamen disable et
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Kaydedilen scroll pozisyonunu geri yükle
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    // Cleanup
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Modal kapanınca state'i resetle
  const handleClose = () => {
    setModalMode('login'); // Login moduna geri dön
    setFormData({
      email: '',
      password: '',
      name: '',
      surname: '',
      confirmPassword: '',
      country: '',
      city: '',
      mobile: '',
      gender: '',
      dob: '',
      termsAndConditions: false,
      newsletter: false
    });
    setError('');
    setFieldErrors({});
    // Forgot password state'lerini resetle
    setForgotPasswordEmail('');
    setForgotPasswordSuccess(false);
    setForgotPasswordError('');
    onClose();
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    // Register fields
    name: '',
    surname: '',
    confirmPassword: '',
    country: '',
    city: '',
    mobile: '',
    gender: '',
    dob: '',
    termsAndConditions: false,
    newsletter: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Ülke değiştiğinde şehri sıfırla
    if (name === 'country') {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
        city: '' // Şehri temizle
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    setError('');
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      mobile: value || ''
    });
    if (fieldErrors.mobile) {
      setFieldErrors({ ...fieldErrors, mobile: '' });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 1500;

    if (!isLoginMode) {
      // Register validations - REGISTRATION_API_GUIDE.md'ye göre
      if (!formData.name || formData.name.length < 2 || formData.name.length > 25) {
        errors.name = 'Ad 2-25 karakter arası olmalıdır';
      }

      if (!formData.surname || formData.surname.length < 2 || formData.surname.length > 25) {
        errors.surname = 'Soyad 2-25 karakter arası olmalıdır';
      }

      if (!formData.email || formData.email.length < 4 || formData.email.length > 60 || !validateEmail(formData.email)) {
        errors.email = 'Geçerli bir e-posta adresi giriniz (4-60 karakter)';
      }

      if (!formData.password || formData.password.length < 6 || formData.password.length > 25) {
        errors.password = 'Şifre 6-25 karakter arası olmalıdır';
      }

      if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Şifreler eşleşmiyor';
      }

      // Telefon numarası sadece büyük ekranlarda zorunlu
      if (!isSmallScreen) {
        if (!formData.mobile || formData.mobile.length < 6 || formData.mobile.length > 25 || !isValidPhoneNumber(formData.mobile)) {
          errors.mobile = 'Geçerli bir telefon numarası giriniz';
        }
      } else {
        // Küçük ekranlarda telefon girilmişse validate et
        if (formData.mobile && formData.mobile.length > 0) {
          if (formData.mobile.length < 6 || formData.mobile.length > 25 || !isValidPhoneNumber(formData.mobile)) {
            errors.mobile = 'Geçerli bir telefon numarası giriniz';
          }
        }
      }

      if (!formData.country || formData.country.length < 2) {
        errors.country = 'Ülke seçiniz';
      }

      // CY veya TR için şehir zorunlu (REGISTRATION_API_GUIDE.md'ye göre)
      if ((formData.country === 'CY' || formData.country === 'TR') && (!formData.city || formData.city.length < 2)) {
        errors.city = 'Şehir giriniz (Kıbrıs ve Türkiye için zorunlu)';
      }

      // Cinsiyet sadece büyük ekranlarda zorunlu
      if (!isSmallScreen && (!formData.gender || formData.gender.length < 2)) {
        errors.gender = 'Cinsiyet seçiniz';
      }

      // Doğum tarihi sadece büyük ekranlarda zorunlu
      if (!isSmallScreen && (!formData.dob || formData.dob.length < 2)) {
        errors.dob = 'Doğum tarihi giriniz';
      }

      if (!formData.termsAndConditions) {
        errors.termsAndConditions = 'Kullanım şartlarını kabul etmelisiniz';
      }
    } else {
      // Login validations
      if (!formData.email || !validateEmail(formData.email)) {
        errors.email = 'Geçerli bir e-posta adresi giriniz';
      }

      if (!formData.password) {
        errors.password = 'Şifre giriniz';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        // Login
        await login({
          email: formData.email,
          password: formData.password
        });
        onClose();
        resetForm();
      } else {
        // Register - tüm verilerle
        await register(formData);
        // Modal kapanmıyor - doğrulama modalı açılacak
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      surname: '',
      confirmPassword: '',
      country: '',
      city: '',
      mobile: '',
      gender: '',
      dob: '',
      termsAndConditions: false,
      newsletter: false
    });
    setError('');
    setFieldErrors({});
  };

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const switchMode = () => {
    if (modalMode === 'login') {
      setModalMode('register');
    } else {
      setModalMode('login');
    }
    resetForm();
  };

  // Forgot password submit handler
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    setForgotPasswordError('');
    setForgotPasswordSuccess(false);
    
    // Email format kontrolü
    if (!validateEmail(forgotPasswordEmail)) {
      setForgotPasswordError('Lütfen geçerli bir email adresi giriniz.');
      return;
    }
    
    setForgotPasswordLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setForgotPasswordSuccess(true);
        setForgotPasswordEmail('');
      } else {
        setForgotPasswordError(data.message || 'Şifre sıfırlama maili gönderilemedi.');
      }
    } catch (err) {
      setForgotPasswordError('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalWidth = modalMode === 'register' ? 'max-w-4xl' : 'max-w-md';
  const modalPadding = modalMode === 'register' ? 'px-5 pt-3 pb-2' : 'px-8 pt-8 pb-6';
  const formPadding = modalMode === 'register' ? 'px-5 pb-4' : 'px-8 pb-8';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-10 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${modalWidth} mx-4 my-4 transform transition-all duration-300 scale-100 border border-gray-100 max-h-[95vh] overflow-y-auto`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className={`${modalPadding} text-center`}>
          {/* Üstte 2 logo yan yana */}
          <div className={`flex items-center justify-center gap-3 ${modalMode === 'register' ? 'mb-2' : 'mb-4'}`}>
          <img 
              src="/img/kuponkıbrıs-logo.png" 
              alt="Kupon Kıbrıs Logo" 
              className={`${modalMode === 'register' ? 'h-8' : 'h-10'} w-auto`}
            />
            
            {/* Dikey çizgi - logo boyu */}
            <div className={`w-px bg-gray-300 ${modalMode === 'register' ? 'h-10' : 'h-13'}`}></div>
            
            <img 
              src="/img/gisekibris-logo.png" 
              alt="Gise Kıbrıs Logo" 
              className={`${modalMode === 'register' ? 'h-10' : 'h-12'} w-auto`}
            />
          </div>
          <p className={`${modalMode === 'register' ? 'text-sm mb-2' : 'text-ms mb-6'} text-black`}>
            {modalMode === 'login'
              ? translate('loginModal.loginSubtitle')
              : modalMode === 'register'
              ? translate('loginModal.registerSubtitle')
              : 'Şifrenizi mi unuttunuz?'
            }
          </p>
          {modalMode === 'forgotPassword' && (
            <p className="text-sm text-gray-600">
              Email adresinizi girin, size sıfırlama bağlantısı gönderelim.
            </p>
          )}
        </div>

        {/* Forgot Password Form */}
        {modalMode === 'forgotPassword' ? (
          <form onSubmit={handleForgotPasswordSubmit} className={formPadding}>
            {/* Error Message */}
            {forgotPasswordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
                <svg className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {forgotPasswordError}
              </div>
            )}
            
            {/* Success Message */}
            {forgotPasswordSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center">
                <svg className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sıfırlama bağlantısı gönderildi! Lütfen spam klasörünü de kontrol edin.
              </div>
            )}
            
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="E-posta *"
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black shadow-sm focus:shadow-md"
                    disabled={forgotPasswordSuccess}
                  />
                  <Mail size={18} className="absolute left-3 top-3.5 text-[var(--primary-color)]" />
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={forgotPasswordLoading || forgotPasswordSuccess}
                className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white py-3 rounded-lg font-bold hover:from-[var(--primary-dark)] hover:to-[var(--primary-darker)] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {forgotPasswordLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Gönderiliyor...
                  </div>
                ) : (
                  'Şifre Sıfırlama Linki Gönder'
                )}
              </button>
              
              {/* Back to Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('login');
                    setForgotPasswordEmail('');
                    setForgotPasswordSuccess(false);
                    setForgotPasswordError('');
                  }}
                  className="text-[var(--primary-color)] hover:text-[var(--primary-dark)] hover:underline transition-colors duration-200 font-medium text-sm"
                >
                  ← Giriş sayfasına dön
                </button>
              </div>
            </div>
            
            {/* Alt Logo */}
            <div className="pt-5 text-center">
              <img 
                src="/img/PracticApp-Logo-1 (1).png" 
                alt="PracticApp Logo" 
                className="h-6 w-auto mx-auto"
              />
            </div>
          </form>
        ) : (
        /* Login/Register Form */
        <form onSubmit={handleSubmit} className={formPadding}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className={`${modalMode === 'register' ? 'space-y-2.5' : 'space-y-3.5'}`}>
            {/* Register Fields */}
            {!isLoginMode && (
              <>
                {/* Name & Surname */}
              <div className="grid grid-cols-2 gap-3">
                  <div>
                <div className="relative">
                  <input
                    type="text"
                        name="name"
                        value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`${translate('loginModal.name')} *`}
                        className={`w-full px-3 py-2.5 pl-10 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px]`}
                      />
                      <User size={17} className="absolute left-3 top-3 text-[var(--primary-color)]" />
                    </div>
                    {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        placeholder={`${translate('loginModal.surname')} *`}
                        className={`w-full px-3 py-2.5 pl-10 border ${fieldErrors.surname ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px]`}
                      />
                      <User size={17} className="absolute left-3 top-3 text-[var(--primary-color)]" />
                    </div>
                    {fieldErrors.surname && <p className="text-red-500 text-xs mt-1">{fieldErrors.surname}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={`${translate('loginModal.email')} *`}
                      className={`w-full px-3 py-2.5 pl-10 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px]`}
                    />
                    <Mail size={17} className="absolute left-3 top-3 text-[var(--primary-color)]" />
                  </div>
                  {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={`${translate('loginModal.password')} *`}
                        className={`w-full px-3 py-2.5 pl-10 pr-10 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px]`}
                      />
                      <Lock size={17} className="absolute left-3 top-3 text-[var(--primary-color)]" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[var(--primary-color)] hover:text-[var(--primary-dark)] transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder={`${translate('loginModal.confirmPassword')} *`}
                        className={`w-full px-3 py-2.5 pl-10 pr-10 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#AE256D] focus:border-[#AE256D] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px]`}
                      />
                      <Lock size={17} className="absolute left-3 top-3 text-[var(--primary-color)]" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-[var(--primary-color)] hover:text-[var(--primary-dark)] transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <div className="phone-input-wrapper">
                    <PhoneInput
                      international
                      limitMaxLength
                      countryCallingCodeEditable={false}
                      maxLength={17}
                      defaultCountry={phoneDefaultCountry}
                      labels={phoneLocale}
                      placeholder={`${translate('loginModal.mobile')} *`}
                      value={formData.mobile}
                      onChange={handlePhoneChange}
                      className={`w-full ${fieldErrors.mobile ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {fieldErrors.mobile && <p className="text-red-500 text-xs mt-1">{fieldErrors.mobile}</p>}
                </div>

                {/* Country & City */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">{translate('loginModal.country')} *</label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 pl-10 border ${fieldErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px] appearance-none`}
                      >
                        <option value="" className="text-gray-400">{translate('loginModal.select')}</option>
                        {countries.map(country => (
                          <option key={country.code} value={country.code} className="text-black">
                            {country.name}
                          </option>
                        ))}
                      </select>
                      <MapPin size={17} className="absolute left-3 top-3 text-[var(--primary-color)] pointer-events-none" />
                    </div>
                    {fieldErrors.country && <p className="text-red-500 text-xs mt-1">{fieldErrors.country}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">
                      {translate('loginModal.city')} {(formData.country === 'CY' || formData.country === 'TR') && '*'}
                    </label>
                    <div className="relative">
                      {(formData.country === 'CY' || formData.country === 'TR') ? (
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2.5 pl-10 border ${fieldErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px] appearance-none`}
                        >
                          <option value="" className="text-gray-400">{translate('loginModal.select')}</option>
                          {(formData.country === 'CY' ? cyprusCities : turkeyCities).map(city => (
                            <option key={city} value={city} className="text-black">{city}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder={translate('loginModal.cityPlaceholder')}
                          className={`w-full px-3 py-2.5 pl-10 border ${fieldErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px]`}
                        />
                      )}
                      <MapPin size={17} className="absolute left-3 top-3 text-[var(--primary-color)] pointer-events-none" />
                    </div>
                    {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
                  </div>
                </div>

                {/* Gender & Date of Birth */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">{translate('loginModal.gender')} *</label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 pl-10 border ${fieldErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px] appearance-none`}
                      >
                        <option value="" className="text-gray-400">{translate('loginModal.genderPlaceholder')}</option>
                        <option value="male" className="text-black">{translate('loginModal.male')}</option>
                        <option value="female" className="text-black">{translate('loginModal.female')}</option>
                        <option value="other" className="text-black">{translate('loginModal.other')}</option>
                      </select>
                      <User size={17} className="absolute left-3 top-3 text-[var(--primary-color)] pointer-events-none" />
                    </div>
                    {fieldErrors.gender && <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">{translate('loginModal.dob')} *</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                    onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full px-3 py-2.5 pl-10 border ${fieldErrors.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black text-[15px]`}
                  />
                      <Calendar size={17} className="absolute left-3 top-3 text-[var(--primary-color)] pointer-events-none" />
                    </div>
                    {fieldErrors.dob && <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>}
                  </div>
                </div>

                {/* Terms & Newsletter */}
                <div className="space-y-2 pt-1">
                  <div>
                    <div 
                      className="flex items-start gap-2 cursor-pointer"
                      onClick={() => setShowTermsModal(true)}
                    >
                      <input
                        type="checkbox"
                        name="termsAndConditions"
                        checked={formData.termsAndConditions}
                        readOnly
                        className="mt-1 w-4 h-4 text-[var(--primary-color)] border-gray-300 rounded focus:ring-[var(--primary-color)] cursor-pointer"
                      />
                      <span className={`text-sm ${fieldErrors.termsAndConditions ? 'text-red-500' : 'text-gray-700'}`}>
                        <span className="text-[var(--primary-color)] hover:text-[var(--primary-dark)] underline font-medium">
                          {translate('loginModal.termsAndConditions')}
                        </span>
                        <span className="text-gray-700">{' '}{translate('loginModal.termsAccept') || 'kabul ediyorum'} *</span>
                      </span>
                    </div>
                    {fieldErrors.termsAndConditions && <p className="text-red-500 text-xs mt-1 ml-6">{fieldErrors.termsAndConditions}</p>}
                  </div>
                  
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-[#AE256D] border-gray-300 rounded focus:ring-[#AE256D]"
                    />
                    <span className="text-sm text-gray-700">
                      {translate('loginModal.newsletter')}
                    </span>
                  </label>
              </div>
              </>
            )}

            {/* Login Fields */}
            {isLoginMode && (
              <>
            {/* Email */}
                <div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={`${translate('loginModal.email')} *`}
                      className={`w-full px-4 py-3 pl-11 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black shadow-sm focus:shadow-md`}
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-[var(--primary-color)]" />
                  </div>
                  {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
                <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={`${translate('loginModal.password')} *`}
                      className={`w-full px-4 py-3 pl-11 pr-11 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 bg-gray-50 focus:bg-white text-black shadow-sm focus:shadow-md`}
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-[var(--primary-color)]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-[var(--primary-color)] hover:text-[var(--primary-dark)] transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
                  {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setModalMode('forgotPassword')}
                    className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-dark)] hover:underline transition-colors duration-200 font-medium"
                  >
                    Şifremi Unuttum
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${modalMode === 'register' ? 'mt-4 py-3 text-base' : 'mt-6 py-4 text-lg'} bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white rounded-lg font-bold hover:from-[var(--primary-dark)] hover:to-[var(--primary-darker)] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {translate('loginModal.loading')}
              </div>
            ) : (
              isLoginMode ? translate('loginModal.loginButton') : translate('loginModal.registerButton')
            )}
          </button>

          {/* Switch Mode */}
          <div className={`${modalMode === 'register' ? 'mt-4' : 'mt-8'} text-center`}>
            <p className={`text-gray-700 ${modalMode === 'register' ? 'text-sm' : 'text-base'} font-medium`}>
              {isLoginMode ? translate('loginModal.noAccount') : translate('loginModal.haveAccount')}
            </p>
            <button
              type="button"
              onClick={switchMode}
              className={`${modalMode === 'register' ? 'mt-1' : 'mt-3'} font-bold transition-colors duration-200 hover:underline ${modalMode === 'register' ? 'text-sm' : 'text-base'} ${
                isLoginMode 
                  ? 'text-[var(--success-color)] hover:text-[var(--success-dark)]' 
                  : 'text-[var(--primary-color)] hover:text-[var(--primary-dark)]'
              }`}
            >
              {isLoginMode ? translate('loginModal.createAccount') : translate('loginModal.login')}
            </button>
          </div>

          {/* Alt Logo */}
          <div className={`${modalMode === 'register' ? 'pt-3' : 'pt-5'} text-center`}>
            <img 
              src="/img/PracticApp-Logo-1 (1).png" 
              alt="PracticApp Logo" 
              className={`${modalMode === 'register' ? 'h-5' : 'h-6'} w-auto mx-auto`}
            />
          </div>
        </form>
        )}
      </div>

      {/* Global Primary Color & Phone Input Custom Styles */}
      <style jsx global>{`
        :root {
          --primary-color: #22c55e;
          --primary-dark: #16a34a;
          --primary-darker: #15803d;
          --success-color: #22c55e;
          --success-dark: #16a34a;
        }
        
        .phone-input-wrapper .PhoneInput {
          display: flex;
          align-items: center;
          position: relative;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background-color: #f9fafb;
          padding: 0.625rem 0.875rem;
          transition: all 0.2s;
        }
        .phone-input-wrapper .PhoneInput:focus-within {
          background-color: #fff;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(174, 37, 109, 0.1);
        }
        .phone-input-wrapper .PhoneInputCountry {
          display: flex;
          align-items: center;
          margin-right: 0.5rem;
        }
        .phone-input-wrapper .PhoneInputCountryIcon {
          width: 1.375rem;
          height: 1.375rem;
        }
        .phone-input-wrapper .PhoneInputCountrySelectArrow {
          margin-left: 0.25rem;
          color: var(--primary-color);
          width: 0.5rem;
          height: 0.5rem;
        }
        .phone-input-wrapper .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          width: 4rem;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          color: #000;
        }
        .phone-input-wrapper .PhoneInputCountrySelect option {
          color: #000;
          background-color: #fff;
        }
        .phone-input-wrapper .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: #000;
          font-size: 0.9375rem;
          padding: 0;
        }
      `}</style>

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setFormData({ ...formData, termsAndConditions: true });
          // Clear field error
          if (fieldErrors.termsAndConditions) {
            setFieldErrors({ ...fieldErrors, termsAndConditions: '' });
          }
        }}
      />
    </div>
  );
};

export default LoginModal;

