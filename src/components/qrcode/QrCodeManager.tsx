import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  ExternalLink,
  Smartphone,
  Plus,
  Trash2,
  Wifi,
  Sparkles,
  Check,
} from 'lucide-react';
import { RestaurantTable } from '../../types';

export const QrCodeManager: React.FC = () => {
  const {
    activeRestaurant,
    tables,
    saveTable,
    deleteTable,
    openCustomerMenuForTable,
    showToast,
  } = useApp();

  const [selectedTableNumber, setSelectedTableNumber] = useState<string>(tables[0]?.tableNumber || '1');
  const [activeTab, setActiveTab] = useState<'table' | 'general'>('table');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // New table modal state
  const [isNewTableModalOpen, setIsNewTableModalOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableSection, setNewTableSection] = useState('Main Dining');
  const [newTableCapacity, setNewTableCapacity] = useState(4);

  // Determine the URL encoded into the QR code
  const baseUrl = window.location.origin + window.location.pathname;
  const qrTargetUrl =
    activeTab === 'general'
      ? `${baseUrl}?restaurant=${activeRestaurant.slug}`
      : `${baseUrl}?restaurant=${activeRestaurant.slug}&table=${selectedTableNumber}`;

  useEffect(() => {
    QRCode.toDataURL(qrTargetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#1c1917', // deep stone-900
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR generation error', err);
      });
  }, [qrTargetUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrTargetUrl);
    setCopied(true);
    showToast('Direct menu link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${activeRestaurant.slug}-table-${selectedTableNumber}-qr.png`;
    a.click();
    showToast('QR code downloaded', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) return;
    const newTbl: RestaurantTable = {
      id: `tbl_${Date.now()}`,
      restaurantId: activeRestaurant.id,
      tableNumber: newTableNumber.trim(),
      section: newTableSection.trim(),
      capacity: newTableCapacity,
      status: 'available',
    };
    saveTable(newTbl);
    setSelectedTableNumber(newTbl.tableNumber);
    setNewTableNumber('');
    setIsNewTableModalOpen(false);
  };

  const currentTableObj = tables.find((t) => t.tableNumber === selectedTableNumber);

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Screen Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                Table QR Codes &amp; Tabletop Tent Cards
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Print high-resolution QR codes that launch your digital menu instantly on customer
                smartphones without app downloads.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Table Tent</span>
              </button>

              <button
                onClick={() =>
                  openCustomerMenuForTable(
                    activeRestaurant.id,
                    activeTab === 'general' ? '1' : selectedTableNumber
                  )
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulate Phone Scan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Table Selector & Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mode Switcher */}
            <div className="bg-white p-1 rounded-2xl border border-stone-200 flex">
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'table'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Per-Table QR Codes</span>
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'general'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Storefront / Takeaway QR</span>
              </button>
            </div>

            {activeTab === 'table' ? (
              /* Table Selector Grid */
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    Select Table ({tables.length} tables configured)
                  </span>
                  <button
                    onClick={() => setIsNewTableModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Table</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
                  {tables.map((tbl) => (
                    <button
                      key={tbl.id}
                      onClick={() => setSelectedTableNumber(tbl.tableNumber)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedTableNumber === tbl.tableNumber
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-black shadow-xs ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50'
                      }`}
                    >
                      <div className="text-sm">T-{tbl.tableNumber}</div>
                      <div className="text-[10px] text-stone-400 font-medium">
                        {tbl.capacity} seats
                      </div>
                    </button>
                  ))}
                </div>

                {currentTableObj && (
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div>
                      Section: <strong className="text-stone-800">{currentTableObj.section || 'General'}</strong>
                    </div>
                    {tables.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove Table ${currentTableObj.tableNumber}?`)) {
                            deleteTable(currentTableObj.id);
                            setSelectedTableNumber(tables.filter(t => t.id !== currentTableObj.id)[0]?.tableNumber || '1');
                          }
                        }}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Table</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-xs space-y-2 text-stone-600">
                <div className="font-bold text-stone-900 text-sm">Storefront General Menu QR</div>
                <p>
                  This universal QR code opens your digital menu without pre-selecting a specific table.
                  Ideal for storefront posters, takeaway flyers, social media bios, or counter stands.
                </p>
              </div>
            )}

            {/* Link & Download Tools */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-stone-900">Encoded QR Target URL</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={qrTargetUrl}
                  className="flex-1 px-3 py-2 text-xs bg-stone-100 rounded-xl border border-stone-200 text-stone-700 select-all font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleDownloadQr}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res PNG</span>
                </button>

                <button
                  onClick={() =>
                    openCustomerMenuForTable(
                      activeRestaurant.id,
                      activeTab === 'general' ? '1' : selectedTableNumber
                    )
                  }
                  className="py-2 px-3 rounded-xl border border-stone-300 text-stone-800 hover:bg-stone-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Printable Tabletop Tent Card Preview */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md bg-stone-900 p-3 rounded-3xl shadow-xl">
              <div className="text-center text-xs font-bold text-amber-400 py-2">
                PRINTABLE TABLETOP TENT CARD PREVIEW
              </div>

              {/* White Tent Card */}
              <div
                id="printable-tent-card"
                className="bg-white rounded-2xl p-8 border-2 border-stone-800 shadow-md text-center space-y-5"
              >
                {/* Logo & Header */}
                <div>
                  <div className="w-14 h-14 rounded-2xl mx-auto overflow-hidden border border-stone-200 shadow-xs mb-2">
                    <img
                      src={activeRestaurant.logoUrl}
                      alt={activeRestaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-stone-900">
                    {activeRestaurant.name}
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    {activeRestaurant.tagline || activeRestaurant.cuisineType}
                  </p>
                </div>

                {/* Table Badge */}
                {activeTab === 'table' ? (
                  <div className="inline-block px-5 py-1.5 rounded-full bg-stone-950 text-white font-extrabold text-sm tracking-wide">
                    TABLE #{selectedTableNumber}
                  </div>
                ) : (
                  <div className="inline-block px-5 py-1.5 rounded-full bg-stone-950 text-white font-extrabold text-sm tracking-wide">
                    WELCOME GUEST
                  </div>
                )}

                {/* QR Code Container */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-inner">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Menu QR Code"
                      className="w-56 h-56 mx-auto object-contain"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-stone-400">
                      Generating QR...
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                    SCAN WITH YOUR PHONE CAMERA
                  </div>
                  <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                    View full digital menu with photos, allergen details &amp; order directly from your table.
                    No app download needed.
                  </p>
                </div>

                {/* Free Guest WiFi Box */}
                {activeRestaurant.wifiName && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-stone-700 flex items-center justify-center gap-3">
                    <Wifi className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <div>
                      Free Guest WiFi: <strong>{activeRestaurant.wifiName}</strong>
                      {activeRestaurant.wifiPassword && (
                        <span className="ml-2">
                          Pass: <strong>{activeRestaurant.wifiPassword}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Table Modal */}
      {isNewTableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <h2 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-200">
              Add New Dining Table
            </h2>
            <form onSubmit={handleAddTable} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Table Number or Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9, 10, Rooftop-1"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Section</label>
                <input
                  type="text"
                  placeholder="e.g. Terrace, Window, Patio"
                  value={newTableSection}
                  onChange={(e) => setNewTableSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Guest Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewTableModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
