'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Mock kampanya verileri (sadece gise için - kupon gerçek API'den gelecek)
const mockCampaigns = {
  gise: [
    { id: '1', name: 'Yılbaşı Konseri 2024', userCount: 1250 },
    { id: '2', name: 'Tiyatro Festivali', userCount: 890 },
    { id: '3', name: 'Stand-up Gecesi', userCount: 456 },
    { id: '4', name: 'Caz Festivali', userCount: 2100 },
    { id: '5', name: 'Rock Konseri', userCount: 3200 },
    { id: '6', name: 'Bale Gösterisi', userCount: 780 },
  ],
};

type User = {
  id: string;
  email: string;
  fullName: string | null;
  role?: { id: string; name: string } | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const GISE_KUPON_API_URL = process.env.NEXT_PUBLIC_GISE_KUPON_API_URL || 'http://localhost:3001';

type MailTemplate = {
  id: string;
  name: string;
  description: string | null;
  htmlContent: string;
  cssContent: string | null;
};

type Platform = 'gise' | 'kupon' | null;
type Campaign = { id: string; name: string; userCount: number };
type MailProviderType = { id: string; name: string; type: string; isDefault: boolean };

export default function MailPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<Campaign[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [draggedCampaign, setDraggedCampaign] = useState<Campaign | null>(null);
  // Gerçek kullanıcı verileri
  const [allUsersList, setAllUsersList] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  // Template verileri
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  // Mail gönderimi
  const [sending, setSending] = useState(false);
  const [mailProviders, setMailProviders] = useState<MailProviderType[]>([]);
  // Kampanya verileri (kupon için gerçek API'den)
  const [kuponCampaigns, setKuponCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignSearch, setCampaignSearch] = useState('');
  // Kampanyadan gelen kullanıcılar
  const [campaignUsers, setCampaignUsers] = useState<Record<string, User[]>>({});

  // Kullanıcıları ve şablonları API'den çek
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const users = await response.json();
          setAllUsersList(users);
        }
      } catch (error) {
        console.error('Kullanıcılar yüklenirken hata:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/templates`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTemplates(data);
        }
      } catch (error) {
        console.error('Şablonlar yüklenirken hata:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/mail/providers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMailProviders(data);
          // Varsayılan provider'ı seç
          const defaultProvider = data.find((p: MailProviderType) => p.isDefault);
          if (defaultProvider) {
            setSelectedProvider(defaultProvider.id);
          }
        }
      } catch (error) {
        console.error('Mail sağlayıcıları yüklenirken hata:', error);
      }
    };

    fetchUsers();
    fetchTemplates();
    fetchProviders();
  }, []);

  // Kupon platformu seçildiğinde kampanyaları çek
  useEffect(() => {
    if (selectedPlatform === 'kupon') {
      const fetchKuponCampaigns = async () => {
        setLoadingCampaigns(true);
        try {
          const response = await fetch(`${GISE_KUPON_API_URL}/campaigns/public`);
          if (response.ok) {
            const campaigns = await response.json();
            // Kampanya verisini uygun formata çevir
            const formattedCampaigns = campaigns.map((c: any) => ({
              id: c.id,
              name: c.title,
              userCount: c._count?.coupons || 0,
            }));
            setKuponCampaigns(formattedCampaigns);
          }
        } catch (error) {
          console.error('Kupon kampanyaları yüklenirken hata:', error);
        } finally {
          setLoadingCampaigns(false);
        }
      };
      fetchKuponCampaigns();
    }
  }, [selectedPlatform]);

  // Kampanya seçildiğinde kullanıcıları otomatik çek (sadece kupon için)
  const fetchCampaignUsers = async (campaignId: string) => {
    if (selectedPlatform !== 'kupon') return;
    if (campaignUsers[campaignId]) return; // Zaten çekilmiş
    
    try {
      const response = await fetch(`${GISE_KUPON_API_URL}/campaigns/public/${campaignId}/users`);
      if (response.ok) {
        const data = await response.json();
        const users = data.users.map((u: any, index: number) => ({
          id: `campaign-${campaignId}-${index}`,
          email: u.email,
          fullName: u.fullName || null,
        }));
        setCampaignUsers(prev => ({ ...prev, [campaignId]: users }));
        // Otomatik olarak kullanıcıları seçilenlere ekle
        setSelectedUsers(prev => {
          const newUsers = users.filter((u: User) => !prev.find(su => su.email === u.email));
          return [...prev, ...newUsers];
        });
      }
    } catch (error) {
      console.error('Kampanya kullanıcıları yüklenirken hata:', error);
    }
  };

  const totalSteps = 4;

  // Platformuna göre kampanyaları getir (gise: mock, kupon: gerçek API)
  const availableCampaigns = selectedPlatform === 'gise' 
    ? mockCampaigns.gise 
    : selectedPlatform === 'kupon' 
      ? kuponCampaigns 
      : [];
  const filteredCampaigns = availableCampaigns
    .filter((c) => !selectedCampaigns.find((sc) => sc.id === c.id))
    .filter((c) => campaignSearch === '' || 
      c.name.toLowerCase().includes(campaignSearch.toLowerCase())
    );

  // Email bazlı duplicate kontrolü - aynı email bir daha eklenemesin
  const selectedEmails = selectedUsers.map(u => u.email.toLowerCase());
  const filteredUsers = allUsersList.filter(
    (u) => !selectedEmails.includes(u.email.toLowerCase())
  ).filter(
    (u) => userSearch === '' || 
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.fullName && u.fullName.toLowerCase().includes(userSearch.toLowerCase()))
  );
  const totalUsers = selectedCampaigns.reduce((acc, c) => acc + c.userCount, 0) + selectedUsers.length;

  const handleDragStart = (campaign: Campaign) => {
    setDraggedCampaign(campaign);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedCampaign && !selectedCampaigns.find((c) => c.id === draggedCampaign.id)) {
      setSelectedCampaigns([...selectedCampaigns, draggedCampaign]);
      // Kupon platform için kullanıcıları otomatik çek
      if (selectedPlatform === 'kupon') {
        fetchCampaignUsers(draggedCampaign.id);
      }
    }
    setDraggedCampaign(null);
  };

  const removeCampaign = (id: string) => {
    setSelectedCampaigns(selectedCampaigns.filter((c) => c.id !== id));
    // Kampanyadan gelen kullanıcıları da kaldır
    if (campaignUsers[id]) {
      const emailsToRemove = campaignUsers[id].map(u => u.email);
      setSelectedUsers(prev => prev.filter(u => !emailsToRemove.includes(u.email)));
    }
  };

  const addAllCampaigns = () => {
    setSelectedCampaigns(availableCampaigns);
    // Kupon için tüm kampanyaların kullanıcılarını çek
    if (selectedPlatform === 'kupon') {
      availableCampaigns.forEach(c => fetchCampaignUsers(c.id));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedPlatform !== null;
      case 2: return selectedCampaigns.length > 0 || selectedUsers.length > 0;
      case 3: return selectedTemplate !== null && subject.trim() !== '';
      case 4: return selectedProvider !== null;
      default: return false;
    }
  };

  const handleSend = async () => {
    if (!selectedTemplate || !selectedProvider) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('accessToken');
      // Seçilen kullanıcıların email listesini al
      const recipientEmails = selectedUsers.map(u => u.email);
      
      const response = await fetch(`${API_URL}/mail/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          recipients: recipientEmails,
          templateId: selectedTemplate,
          providerId: selectedProvider,
          platform: selectedPlatform,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`✅ Mail gönderimi tamamlandı!\n\nToplam: ${result.totalRecipients}\nBaşarılı: ${result.successCount}\nBaşarısız: ${result.failCount}`);
        // Formu sıfırla
        setCurrentStep(1);
        setSelectedCampaigns([]);
        setSelectedUsers([]);
        setSubject('');
        setSelectedTemplate(null);
      } else {
        alert(`❌ Hata: ${result.message || 'Mail gönderilemedi'}`);
      }
    } catch (error) {
      console.error('Mail gönderilirken hata:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Toplu Mail Gönderimi</h1>
          <p className="text-sm text-gray-500 mt-1">Kampanya bazlı toplu mail gönderimi</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8">
          {[
            { step: 1, title: 'Platform', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { step: 2, title: 'Hedef Kitle', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { step: 3, title: 'Şablon', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
            { step: 4, title: 'Gönderim', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    currentStep === item.step
                      ? 'bg-[#2b2973] text-white'
                      : currentStep > item.step
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentStep > item.step ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  currentStep === item.step ? 'text-[#2b2973]' : 'text-gray-500'
                }`}>
                  {item.title}
                </span>
              </div>
              {index < 3 && (
                <div className={`w-12 lg:w-20 h-0.5 mx-2 rounded-full ${
                  currentStep > item.step ? 'bg-green-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Platform Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Platform Seçin</h2>
              <p className="text-sm text-gray-500">Mail göndermek istediğiniz platformu seçin</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <button
                  onClick={() => setSelectedPlatform('gise')}
                  className={`relative p-8 rounded-2xl border-2 transition-all flex items-center justify-center ${
                    selectedPlatform === 'gise'
                      ? 'border-[#a02073] bg-pink-50'
                      : 'border-gray-200 hover:border-[#a02073] hover:bg-pink-50/50'
                  }`}
                >
                  <Image 
                    src="/GPW.png" 
                    alt="Gişe Kıbrıs" 
                    width={200} 
                    height={60} 
                    className="h-50 w-auto"
                  />
                  {selectedPlatform === 'gise' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-[#a02073] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setSelectedPlatform('kupon')}
                  className={`relative p-8 rounded-2xl border-2 transition-all flex items-center justify-center ${
                    selectedPlatform === 'kupon'
                      ? 'border-[#2aa146] bg-green-50'
                      : 'border-gray-200 hover:border-[#2aa146] hover:bg-green-50/50'
                  }`}
                >
                  <Image 
                    src="/KKW.png" 
                    alt="Kupon Kıbrıs" 
                    width={200} 
                    height={200} 
                    className="h-50 w-auto"
                  />
                  {selectedPlatform === 'kupon' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-[#2aa146] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}


          {/* Step 2: Campaign/User Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Hedef Kitle Seçimi</h2>
                  <p className="text-sm text-gray-500">Kampanyaları sürükleyip havuza bırakın</p>
                </div>
                <button
                  onClick={addAllCampaigns}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Tümünü Ekle
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* Available Campaigns */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Mevcut Kampanyalar ({availableCampaigns.length})
                    {loadingCampaigns && (
                      <span className="ml-2 text-xs text-gray-400">Yükleniyor...</span>
                    )}
                  </h3>
                  
                  {/* Kampanya Arama Kutusu */}
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Kampanya ara..."
                      value={campaignSearch}
                      onChange={(e) => setCampaignSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-900"
                    />
                    {campaignSearch && (
                      <button
                        onClick={() => setCampaignSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 min-h-[200px] max-h-[300px] overflow-y-auto space-y-2">
                    {loadingCampaigns ? (
                      <div className="h-full flex items-center justify-center py-8">
                        <svg className="animate-spin h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : filteredCampaigns.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        {campaignSearch ? 'Aramanızla eşleşen kampanya bulunamadı' : availableCampaigns.length === 0 ? 'Kampanya bulunamadı' : 'Tüm kampanyalar seçildi'}
                      </div>
                    ) : (
                      filteredCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          draggable
                          onDragStart={() => handleDragStart(campaign)}
                          className="bg-white p-3 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing hover:border-purple-300 hover:shadow-sm transition-all flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{campaign.name}</p>
                            <p className="text-xs text-gray-500">{campaign.userCount.toLocaleString()} kullanıcı</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>
                      ))
                    )}
                  </div>

                 
                </div>

                {/* Selected Campaigns Pool */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Seçilen Havuz
                    {(selectedCampaigns.length > 0 || selectedUsers.length > 0) && (
                      <>
                        <span className="text-xs text-green-600 font-semibold">
                          {totalUsers.toLocaleString()} kullanıcı
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCampaigns([]);
                            setSelectedUsers([]);
                            setCampaignUsers({});
                          }}
                          className="ml-auto text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Tümünü Temizle
                        </button>
                      </>
                    )}
                  </h3>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 min-h-[280px] max-h-[400px] overflow-y-auto border-2 border-dashed transition-all ${
                      draggedCampaign ? 'border-green-400 bg-green-100' : 'border-green-200'
                    }`}
                  >
                    {selectedCampaigns.length === 0 && selectedUsers.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-green-600">
                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-sm font-medium">Kampanyaları veya kullanıcıları ekleyin</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Seçilen Kullanıcılar */}
                        {selectedUsers.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-blue-600 font-medium mb-2">Seçilen Kullanıcılar ({selectedUsers.length})</p>
                            {selectedUsers.map((user) => (
                              <div
                                key={user.id}
                                className="bg-blue-50 p-2 rounded-lg border border-blue-200 flex items-center gap-2 mb-1 group"
                              >
                                <div className="w-6 h-6 rounded-full bg-[#2b2973] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                  {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-900 text-xs truncate">{user.fullName || '-'}</p>
                                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                </div>
                                <button
                                  onClick={() => setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))}
                                  className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 flex-shrink-0"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Seçilen Kampanyalar */}
                        {selectedCampaigns.map((campaign) => (
                          <div
                            key={campaign.id}
                            className="bg-white p-3 rounded-lg border border-green-200 flex items-center justify-between group"
                          >
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{campaign.name}</p>
                              <p className="text-xs text-gray-500">{campaign.userCount.toLocaleString()} kullanıcı</p>
                            </div>
                            <button
                              onClick={() => removeCampaign(campaign.id)}
                              className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
               {/* Tüm Kullanıcılar Bölümü */}
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mt-4">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Tüm Kullanıcılar ({allUsersList.length})
                    {loadingUsers && (
                      <span className="ml-2 text-xs text-gray-400">Yükleniyor...</span>
                    )}
                    {filteredUsers.length > 0 && (
                      <button
                        onClick={() => {
                          // Email duplicate kontrolü ile ekle
                          const newUsers = filteredUsers.filter(
                            u => !selectedEmails.includes(u.email.toLowerCase())
                          );
                          setSelectedUsers([...selectedUsers, ...newUsers]);
                        }}
                        className="ml-auto text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Tümünü Ekle
                      </button>
                    )}
                  </h3>
                  
                  {/* Arama Kutusu */}
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Kullanıcı ara (isim veya e-posta)..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900"
                    />
                    {userSearch && (
                      <button
                        onClick={() => setUserSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-xl p-3 min-h-[350px] max-h-[350px] overflow-y-auto">
                    {loadingUsers ? (
                      <div className="flex items-center justify-center py-8">
                        <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-8">
                        {userSearch ? 'Aramanızla eşleşen kullanıcı bulunamadı' : 'Tüm kullanıcılar seçildi'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              // Email duplicate kontrolü
                              if (!selectedEmails.includes(user.email.toLowerCase())) {
                                setSelectedUsers([...selectedUsers, user]);
                              }
                            }}
                            className="bg-white p-2.5 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all flex items-center gap-2 text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#2b2973] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                              {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 text-xs truncate">{user.fullName || '-'}</p>
                              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                            </div>
                            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
            </div>
          )}

          {/* Step 3: Template Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Şablon ve Konu</h2>
              <p className="text-sm text-gray-500">Mail için şablon seçin ve konu girin</p>
              
              {/* Konu Alanı */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mail Konusu</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Mail konusunu yazın..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-900"
                />
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {loadingTemplates ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4">Henüz şablon oluşturulmamış</p>
                    <a href="/panel/templates/new" className="text-[#2b2973] font-medium hover:underline">Şablon Oluştur →</a>
                  </div>
                ) : (
                  templates.map((template) => (
                    <div key={template.id} className="relative">
                      <button
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`w-full relative p-4 rounded-xl border-2 transition-all text-left ${
                          selectedTemplate === template.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 overflow-hidden">
                          {template.htmlContent ? (
                            <iframe
                              srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:4px;transform:scale(0.25);transform-origin:top left;width:400%;pointer-events:none;}${template.cssContent || ''}</style></head><body>${template.htmlContent}</body></html>`}
                              className="w-full h-full border-0 pointer-events-none"
                              title={template.name}
                              sandbox=""
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description || 'Açıklama yok'}</p>
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                      {/* Önizleme Butonu */}
                      <button
                        onClick={() => setPreviewTemplate(template.id)}
                        className="absolute bottom-16 right-2 px-2 py-1 bg-white border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Önizle
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Şablon Önizleme Modal */}
          {previewTemplate && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{templates.find(t => t.id === previewTemplate)?.name} - Önizleme</h3>
                      <p className="text-xs text-gray-500">{templates.find(t => t.id === previewTemplate)?.description || 'Şablon önizlemesi'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Body - Mail Önizleme */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Email Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="font-medium">Kimden:</span>
                        <span>noreply@practicapp.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="font-medium">Kime:</span>
                        <span className="text-blue-600">{totalUsers} kullanıcı</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-600">Konu:</span>
                        <span className="font-semibold text-gray-900">{subject || '(Konu girilmedi)'}</span>
                      </div>
                    </div>

                    {/* Email Body - Dinamik HTML içerik (iframe ile izolasyon) */}
                    <div className="bg-white overflow-hidden">
                      {(() => {
                        const currentTemplate = templates.find(t => t.id === previewTemplate);
                        if (currentTemplate?.htmlContent) {
                          // CSS'i style etiketi olarak HTML'e embed et
                          const fullHtml = currentTemplate.cssContent 
                            ? `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:Arial,sans-serif;}*{max-width:100%;box-sizing:border-box;}img{height:auto;}${currentTemplate.cssContent}</style></head><body>${currentTemplate.htmlContent}</body></html>`
                            : `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:Arial,sans-serif;}*{max-width:100%;box-sizing:border-box;}img{height:auto;}</style></head><body>${currentTemplate.htmlContent}</body></html>`;
                          return (
                            <iframe
                              srcDoc={fullHtml}
                              className="w-full border-0"
                              style={{ height: '400px', maxHeight: '50vh' }}
                              title="Email Önizleme"
                              sandbox="allow-same-origin"
                            />
                          );
                        }
                        return (
                          <div className="text-center py-8 text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>Şablon içeriği bulunamadı</p>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Email Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
                      <p className="text-xs text-gray-500">Bu e-posta PracticApp tarafından gönderilmiştir.</p>
                      <p className="text-xs text-gray-400 mt-1">İptal etmek için tıklayın | Gizlilik Politikası</p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-500">
                    Bu şablon seçildikten sonra mailiniz bu şekilde görünecek
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewTemplate(null)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Kapat
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTemplate(previewTemplate);
                        setPreviewTemplate(null);
                      }}
                      className="px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Bu Şablonu Seç
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Mail Provider Selection */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Gönderim Servisi</h2>
              <p className="text-sm text-gray-500">Mail gönderim servisini seçin</p>
              
              {mailProviders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">Henüz mail sağlayıcısı eklenmemiş</p>
                  <p className="text-sm text-gray-400">Veritabanına bir mail provider ekleyin</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {mailProviders.map((provider) => {
                    // Provider tipine göre renk belirle
                    const colorMap: Record<string, string> = {
                      smtp: 'bg-gray-100 text-gray-600',
                      aws: 'bg-orange-100 text-orange-600',
                      sendpulse: 'bg-blue-100 text-blue-600',
                      mailgun: 'bg-red-100 text-red-600',
                    };
                    const iconMap: Record<string, string> = {
                      smtp: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
                      aws: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
                      sendpulse: 'M13 10V3L4 14h7v7l9-11h-7z',
                      mailgun: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                    };
                    return (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                          selectedProvider === provider.id
                            ? 'border-[#2b2973] bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-10 h-10 ${colorMap[provider.type] || 'bg-gray-100 text-gray-600'} rounded-lg flex items-center justify-center mb-3`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconMap[provider.type] || iconMap.smtp} />
                          </svg>
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm">{provider.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{provider.type.toUpperCase()}</p>
                        {provider.isDefault && (
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-100 text-green-600 text-[10px] font-medium rounded">Varsayılan</span>
                        )}
                        {selectedProvider === provider.id && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-[#2b2973] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Summary */}
              {selectedProvider && (
                <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Özet</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Platform</p>
                      <p className="font-medium text-gray-900">{selectedPlatform === 'gise' ? 'Gişe Kıbrıs' : 'Kupon Kıbrıs'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Konu</p>
                      <p className="font-medium text-gray-900 truncate">{subject}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Hedef Kitle</p>
                      <p className="font-medium text-gray-900">{totalUsers.toLocaleString()} kullanıcı</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Servis</p>
                      <p className="font-medium text-gray-900">{mailProviders.find(p => p.id === selectedProvider)?.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              currentStep === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-[#2b2973] to-[#4a3f9f] text-white hover:shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              İleri
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Gönder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
