import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  KeyRound,
  User,
  Store as StoreIcon,
  ShoppingBag,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEMO_CREDENTIALS, DemoCredentialInfo } from '../data/initialData';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginUser, registerUser } = useStore();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [selectedRolePreset, setSelectedRolePreset] = useState<string | null>(null);

  // Register form state
  const [regNama, setRegNama] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regAlamat, setRegAlamat] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!authModalOpen) return null;

  // Handle selecting a demo role credential
  const handleSelectRolePreset = (item: DemoCredentialInfo) => {
    setSelectedRolePreset(item.role);
    setLoginIdentifier(item.username);
    setLoginPassword(item.password);
    setErrorMsg('');
  };

  // Direct 1-click login for fast testing
  const handleDirectLogin = async (cred: DemoCredentialInfo) => {
    setSelectedRolePreset(cred.role);
    setLoginIdentifier(cred.username);
    setLoginPassword(cred.password);
    setErrorMsg('');
    setIsLoading(true);
    const res = await loginUser(cred.username, cred.password);
    setIsLoading(false);
    if (res.success) {
      setSuccessMsg(`Login berhasil sebagai ${cred.roleTitle}! Mengalihkan ke dashboard...`);
      setTimeout(() => {
        setAuthModalOpen(false);
        setSuccessMsg('');
      }, 600);
    } else {
      setErrorMsg(res.error || 'Gagal login.');
    }
  };

  // Check detected role from input
  const detectedRole = (() => {
    const clean = loginIdentifier.trim().toLowerCase();
    if (!clean) return null;
    if (clean === 'admin' || clean === 'admin.raksukan@wargaopat.id') {
      return { title: 'Pengelola / Admin (Kang Hendra)', badge: 'bg-[#1e4535] text-[#e2c17b]', pass: 'adminraksukan2026' };
    }
    if (clean === 'asep_batik' || clean === 'asep' || clean === 'asep.batik@wargaopat.id') {
      return { title: 'Penjual UMKM (Mang Asep)', badge: 'bg-[#c86d44] text-white', pass: 'batikparungkuda' };
    }
    if (clean === 'siti_nurhaliza' || clean === 'siti' || clean === 'siti.nur@gmail.com') {
      return { title: 'Member Warga (Siti Nurhaliza)', badge: 'bg-[#2c5282] text-white', pass: 'wargaopat2026' };
    }
    return null;
  })();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginIdentifier.trim()) {
      setErrorMsg('Harap masukkan username atau email Anda.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Harap masukkan password Anda.');
      return;
    }

    setIsLoading(true);
    const res = await loginUser(loginIdentifier.trim(), loginPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Login berhasil! Mengalihkan ke dashboard sesuai peran...');
      setTimeout(() => {
        setAuthModalOpen(false);
        setSuccessMsg('');
      }, 700);
    } else {
      setErrorMsg(res.error || 'Gagal login. Periksa kembali username/email dan password Anda.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!agreeTerms) {
      setErrorMsg('Anda wajib menyetujui Syarat Penggunaan dan Kebijakan Privasi.');
      return;
    }

    if (regWhatsapp.length < 9) {
      setErrorMsg('Nomor WhatsApp minimal 9 digit.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    const res = await registerUser({
      nama: regNama.trim(),
      username: regUsername.trim() || undefined,
      email: regEmail.trim(),
      nomor_whatsapp: regWhatsapp.trim(),
      alamat: regAlamat.trim(),
      password: regPassword,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Registrasi berhasil! Anda telah masuk sebagai Member Warga resmi.');
      setTimeout(() => {
        setAuthModalOpen(false);
        setSuccessMsg('');
      }, 1200);
    } else {
      setErrorMsg(res.error || 'Gagal mendaftar.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#e6decb] p-6 space-y-5 my-8">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-[#8a7f72] hover:text-[#1e4535] rounded-full hover:bg-[#f4efe6] transition-colors"
          title="Tutup dialog login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-11 h-11 rounded-lg bg-[#1e4535] text-[#e2c17b] font-serif font-bold text-lg flex items-center justify-center mx-auto shadow-xs">
            KR
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1e4535]">
            Akses Masuk & Autentikasi Peran
          </h2>
          <p className="text-xs text-[#6b6255]">
            Kampoeng Raksukan Warga Opat Parungkuda
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#f0ebd9] text-xs font-semibold">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
              tab === 'login'
                ? 'border-[#1e4535] text-[#1e4535] font-bold'
                : 'border-transparent text-[#8a7f72] hover:text-[#1e4535]'
            }`}
          >
            Masuk (Login Berdasarkan Peran)
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
              tab === 'register'
                ? 'border-[#1e4535] text-[#1e4535] font-bold'
                : 'border-transparent text-[#8a7f72] hover:text-[#1e4535]'
            }`}
          >
            Daftar Member Warga Baru
          </button>
        </div>

        {/* Error and Success alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200 flex items-start gap-2">
            <Lock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-50 text-green-800 text-xs rounded-md border border-green-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ===================== LOGIN TAB ===================== */}
        {tab === 'login' && (
          <div className="space-y-4">
            {/* Quick Role Preset Cards */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#5c5347]">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#c86d44]" />
                  Pilih Akun Demo & Otomatis Isi Kredensial:
                </span>
                <span className="text-[10px] text-[#8a7f72]">(Klik kartu / tombol masuk cepat)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_CREDENTIALS.map((cred) => {
                  const isSelected = selectedRolePreset === cred.role;
                  return (
                    <div
                      key={cred.role}
                      className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#1e4535] bg-[#eef5f1] ring-1 ring-[#1e4535]'
                          : 'border-[#e6decb] bg-[#faf8f5] hover:bg-[#f3ece0]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectRolePreset(cred)}
                        className="w-full text-left cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-[#1e4535]">
                            {cred.role === 'admin' && '👑 Pengelola'}
                            {cred.role === 'seller' && '🏪 Penjual UMKM'}
                            {cred.role === 'member' && '🛍️ Member Warga'}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#1e4535]" />
                          )}
                        </div>
                        <div className="text-[10px] text-[#4a4237] font-medium leading-tight truncate">
                          {cred.name}
                        </div>
                        <div className="text-[9px] text-[#736859] mt-1 font-mono bg-white/70 px-1 py-0.5 rounded border border-[#ded5c2]">
                          User: {cred.username}
                        </div>
                      </button>

                      {/* Direct Fast Login button */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleDirectLogin(cred)}
                        className="mt-2 w-full py-1 text-[10px] font-semibold rounded bg-[#1e4535]/10 hover:bg-[#1e4535] text-[#1e4535] hover:text-white transition-colors cursor-pointer text-center"
                        title={`Masuk langsung sebagai ${cred.roleTitle}`}
                      >
                        Masuk Cepat ➔
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detected Role Alert if user types manual username */}
            {detectedRole && (
              <div className="px-3 py-1.5 rounded-md bg-[#eaf4ee] border border-[#b8dec4] text-[11px] text-[#1e4535] flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1e4535]" />
                  <span>Akun: <strong>{detectedRole.title}</strong></span>
                </span>
                <button
                  type="button"
                  onClick={() => setLoginPassword(detectedRole.pass)}
                  className="text-[10px] underline font-semibold hover:text-[#16382b] cursor-pointer"
                >
                  Isi Password Otomatis
                </button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-1">
              {/* Username or Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#383129] flex items-center justify-between">
                  <span>Username atau Email</span>
                  <span className="text-[10px] text-[#8a7f72] font-normal">
                    Contoh: admin / asep_batik / siti_nurhaliza
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8a7f72]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => {
                      setLoginIdentifier(e.target.value);
                      setSelectedRolePreset(null);
                    }}
                    placeholder="Masukkan username atau alamat email"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#d6cdbc] rounded-md focus:outline-hidden focus:border-[#1e4535] focus:ring-1 focus:ring-[#1e4535]"
                  />
                </div>
              </div>

              {/* Password Input with Eye Icon Toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#383129]">
                    Password
                  </label>
                  <span className="text-[10px] text-[#8a7f72]">
                    Klik icon mata untuk melihat password
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8a7f72]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password akun"
                    className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-[#d6cdbc] rounded-md focus:outline-hidden focus:border-[#1e4535] focus:ring-1 focus:ring-[#1e4535]"
                  />
                  {/* Eye Toggle Icon Button */}
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7f72] hover:text-[#1e4535] transition-colors cursor-pointer"
                    title={showLoginPassword ? 'Sembunyikan password' : 'Lihat password'}
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </button>
            </form>

            {/* Role Credential Details Info Box */}
            <div className="p-3 bg-[#faf8f5] rounded-lg border border-[#e6decb] space-y-1.5 text-[11px] text-[#554b40]">
              <div className="font-semibold text-[#1e4535] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#1e4535]" />
                Daftar Akun & Password Resmi Pengujian:
              </div>
              <ul className="space-y-1 text-[10px] text-[#6b6255] pl-1">
                <li>
                  <strong className="text-[#1e4535]">Pengelola (Admin):</strong> user: <code className="bg-white px-1 py-0.5 rounded border border-[#e0d6c4]">admin</code> | pass: <code className="bg-white px-1 py-0.5 rounded border border-[#e0d6c4]">adminraksukan2026</code>
                </li>
                <li>
                  <strong className="text-[#c86d44]">Penjual UMKM:</strong> user: <code className="bg-white px-1 py-0.5 rounded border border-[#e0d6c4]">asep_batik</code> | pass: <code className="bg-white px-1 py-0.5 rounded border border-[#e0d6c4]">batikparungkuda</code>
                </li>
                <li>
                  <strong className="text-[#2c5282]">Member Warga:</strong> user: <code className="bg-white px-1 py-0.5 rounded border border-[#e0d6c4]">siti_nurhaliza</code> | pass: <code className="bg-white px-1 py-0.5 rounded border border-[#e0d6c4]">wargaopat2026</code>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ===================== REGISTER TAB ===================== */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#383129] block">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regNama}
                  onChange={(e) => setRegNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#383129] block">
                  Username Akun <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  placeholder="Contoh: budi_santoso"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#383129] block">
                  Email Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@warga.com"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#383129] block">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={regWhatsapp}
                  onChange={(e) => setRegWhatsapp(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">
                Alamat / Domisili Parungkuda <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={regAlamat}
                onChange={(e) => setRegAlamat(e.target.value)}
                placeholder="Contoh: RT 03/04 Parungkuda, Sukabumi"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>

            {/* Password input with Eye toggle */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] flex items-center justify-between">
                <span>Buat Password Baru <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-[#8a7f72]">Min. 6 karakter</span>
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Ketik password rahasia Anda"
                  className="w-full pl-3 pr-10 py-1.5 text-xs bg-white border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7f72] hover:text-[#1e4535] cursor-pointer"
                  title={showRegPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showRegPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 pt-1 text-xs text-[#554b40] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#d6cdbc] text-[#1e4535] cursor-pointer"
              />
              <span>
                Saya menyetujui syarat penggunaan dan kebijakan privasi toko online UMKM warga.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded-md transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Member Warga Sekarang</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
