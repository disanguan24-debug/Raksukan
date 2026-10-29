import React, { useState } from 'react';
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  HelpCircle,
  FileText,
  Camera,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PhotoGuideModal } from './PhotoGuideModal';

export const Footer: React.FC = () => {
  const { settings, setCurrentView } = useStore();
  const [modalPolicy, setModalPolicy] = useState<'privacy' | 'terms' | null>(null);
  const [photoGuideOpen, setPhotoGuideOpen] = useState(false);

  return (
    <footer className="bg-[#16382b] text-[#f4efe6] pt-12 pb-24 md:pb-12 border-t border-[#122e23]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#e2c17b] text-[#16382b] font-serif font-bold text-base flex items-center justify-center">
                KR
              </div>
              <span className="font-serif font-bold text-base text-white">
                Kampoeng Raksukan
              </span>
            </div>
            <p className="text-xs text-[#d1c8b8] leading-relaxed">
              Marketplace fashion UMKM resmi milik komunitas warga Opat Parungkuda, Kabupaten Sukabumi.
              Mendukung pengrajin batik, penjahit busana muslim, dan perajin kriya lokal.
            </p>
            <div className="text-xs text-[#e2c17b] font-medium pt-1">
              &quot;{settings.tagline}&quot;
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="space-y-3 text-xs">
            <h3 className="font-semibold text-white tracking-wider uppercase text-[11px]">
              Menu Marketplace
            </h3>
            <ul className="space-y-2 text-[#d1c8b8]">
              <li>
                <button
                  onClick={() => setCurrentView('beranda')}
                  className="hover:text-white transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('katalog')}
                  className="hover:text-white transition-colors"
                >
                  Katalog Fashion Lengkap
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('pesanan')}
                  className="hover:text-white transition-colors"
                >
                  Lacak Pesanan Saya
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('seller')}
                  className="hover:text-white transition-colors"
                >
                  Gabung Menjadi Penjual Warga
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPhotoGuideOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-[#e2c17b]"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Petunjuk Foto Produk Sendiri
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kebijakan & Syarat */}
          <div className="space-y-3 text-xs">
            <h3 className="font-semibold text-white tracking-wider uppercase text-[11px]">
              Informasi Hukum & Transaksi
            </h3>
            <ul className="space-y-2 text-[#d1c8b8]">
              <li>
                <button
                  onClick={() => setModalPolicy('terms')}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Syarat & Ketentuan Penggunaan
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalPolicy('privacy')}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Kebijakan Privasi Data Warga
                </button>
              </li>
              <li>
                <span className="text-[#a69d8e]">Jaminan Mutu Jahitan & Garansi Tukar Size</span>
              </li>
              <li>
                <span className="text-[#a69d8e]">Dukungan COD Wilayah Sukabumi</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & WhatsApp */}
          <div className="space-y-3 text-xs">
            <h3 className="font-semibold text-white tracking-wider uppercase text-[11px]">
              Kontak Pengelola
            </h3>
            <div className="space-y-2 text-[#d1c8b8]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e2c17b] shrink-0 mt-0.5" />
                <span>{settings.alamat}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e2c17b] shrink-0" />
                <span>{settings.email_kontak}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.nomor_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  'Halo Pengelola Kampoeng Raksukan Warga Opat Parungkuda, saya ingin bertanya seputar produk fashion:'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold rounded text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Pengelola</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#1d4838] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#a69d8e] gap-2">
          <div>
            © {new Date().getFullYear()} Kampoeng Raksukan Warga Opat Parungkuda, Kabupaten Sukabumi.
          </div>
          <div className="flex items-center gap-1">
            <span>Diberdayakan oleh Warga Opat untuk UMKM Berkelanjutan</span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {modalPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs text-[#1c2420]">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0ebd9]">
              <h3 className="font-serif font-bold text-base text-[#1e4535]">
                {modalPolicy === 'terms' ? 'Syarat & Ketentuan Penggunaan' : 'Kebijakan Privasi'}
              </h3>
              <button
                onClick={() => setModalPolicy(null)}
                className="p-1 text-[#8a7f72] hover:text-[#1c2420]"
              >
                Tutup
              </button>
            </div>

            <div className="text-xs text-[#554b40] space-y-3 leading-relaxed">
              {modalPolicy === 'terms' ? (
                <>
                  <p>
                    <strong>1. Keaslian Produk:</strong> Seluruh produk fashion di Kampoeng Raksukan diproduksi atau dikurasi langsung oleh anggota UMKM warga Opat Parungkuda, Sukabumi.
                  </p>
                  <p>
                    <strong>2. Pemesanan & Pembayaran:</strong> Pemesanan yang masuk melalui aplikasi diverifikasi sebelum pengiriman. Pembeli dapat menggunakan Transfer Bank, QRIS, atau COD.
                  </p>
                  <p>
                    <strong>3. Penjual Terdaftar:</strong> Penjual wajib menjaga kualitas kain dan jahitan serta memperbarui status stok secara tepat waktu.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Kerahasiaan Data:</strong> Nomor WhatsApp, nama, dan alamat hanya digunakan khusus untuk pengiriman paket dan konfirmasi pesanan.
                  </p>
                  <p>
                    <strong>2. Tidak Dijual:</strong> Kami menjamin data pribadi warga dan pembeli tidak akan pernah diperjualbelikan kepada pihak ketiga manapun.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Guide Modal */}
      <PhotoGuideModal
        isOpen={photoGuideOpen}
        onClose={() => setPhotoGuideOpen(false)}
      />
    </footer>
  );
};
