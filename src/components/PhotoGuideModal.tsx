import React from 'react';
import {
  X,
  Camera,
  Upload,
  Sun,
  Crop,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Link2,
} from 'lucide-react';

interface PhotoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoGuideModal: React.FC<PhotoGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#e6decb] p-6 sm:p-8 space-y-6 my-8 text-[#1c2420]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8a7f72] hover:text-[#1e4535] rounded-full transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#f0ebd9]">
          <div className="w-10 h-10 rounded-lg bg-[#1e4535] text-[#e2c17b] flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1e4535]">
              Petunjuk Menambah & Memotret Foto Produk Sendiri
            </h2>
            <p className="text-xs text-[#6b6255]">
              Panduan praktis bagi warga dan penjual UMKM agar produk fashion terlihat profesional & menarik pembeli.
            </p>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-4 text-xs sm:text-sm text-[#554b40] leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
          {/* Langkah 1 */}
          <div className="p-4 bg-[#faf8f5] rounded-lg border border-[#e6decb] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1e4535] text-sm">
              <span className="w-6 h-6 rounded-full bg-[#1e4535] text-white text-xs flex items-center justify-center">
                1
              </span>
              <span>Cara Memilih Foto Langsung dari HP atau Laptop</span>
            </div>
            <p className="pl-8 text-xs text-[#554b40]">
              Anda tidak perlu mahir koding atau hosting foto! Pada formulir produk:
            </p>
            <ul className="pl-8 list-disc list-inside space-y-1 text-xs text-[#554b40]">
              <li>
                Klik tombol <strong>&quot;Pilih File Foto dari Galeri HP / Laptop&quot;</strong>.
              </li>
              <li>
                Pilih foto produk dari galeri ponsel Anda atau langsung jepret dengan kamera ponsel.
              </li>
              <li>
                Foto akan otomatis dipratinjau di layar dan tersimpan ke katalog toko Anda.
              </li>
            </ul>
          </div>

          {/* Langkah 2 */}
          <div className="p-4 bg-[#faf8f5] rounded-lg border border-[#e6decb] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1e4535] text-sm">
              <span className="w-6 h-6 rounded-full bg-[#1e4535] text-white text-xs flex items-center justify-center">
                2
              </span>
              <span>Tips Memotret Busana UMKM yang Menjual</span>
            </div>
            <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="flex items-start gap-2">
                <Sun className="w-4 h-4 text-[#c86d44] shrink-0 mt-0.5" />
                <div>
                  <strong>Pencahayaan Alami:</strong>
                  <p className="text-[#6b6255]">
                    Potret di dekat jendela atau teras rumah di pagi atau sore hari. Hindari lampu flash langsung yang membuat warna batik/gamis tidak akurat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Crop className="w-4 h-4 text-[#c86d44] shrink-0 mt-0.5" />
                <div>
                  <strong>Latar Belakang Bersih:</strong>
                  <p className="text-[#6b6255]">
                    Gunakan dinding putih/krem polos, lantai kayu, atau gantungkan baju dengan rapi pada hanger kayu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#c86d44] shrink-0 mt-0.5" />
                <div>
                  <strong>Tampak Utuh & Rapi:</strong>
                  <p className="text-[#6b6255]">
                    Setrika pakaian sebelum dipotret agar serat kain dan potongan baju tampak anggun dan rapi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c86d44] shrink-0 mt-0.5" />
                <div>
                  <strong>Proporsi Gambar:</strong>
                  <p className="text-[#6b6255]">
                    Gunakan rasio 4:3 atau 1:1 (persegi) agar tidak terpotong saat ditampilkan di katalog aplikasi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Langkah 3 */}
          <div className="p-4 bg-[#faf8f5] rounded-lg border border-[#e6decb] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1e4535] text-sm">
              <span className="w-6 h-6 rounded-full bg-[#1e4535] text-white text-xs flex items-center justify-center">
                3
              </span>
              <span>Opsi Alternatif: Menggunakan Tautan (URL Foto Online)</span>
            </div>
            <p className="pl-8 text-xs text-[#554b40]">
              Jika Anda sudah memiliki link foto dari Supabase Storage, Google Drive (pastikan opsi siapa saja yang memiliki link dapat melihat aktif), atau layanan hosting gambar lain, cukup tempelkan link URL tersebut ke kolom input URL foto.
            </p>
          </div>

          {/* Ketentuan Teknis */}
          <div className="p-3 bg-[#e8f2ec] rounded-lg border border-[#c2ded0] text-xs text-[#1e4535] space-y-1">
            <strong>Format & Ukuran yang Didukung:</strong>
            <p>
              Mendukung format gambar <strong>JPG, JPEG, PNG, dan WEBP</strong>. Disarankan ukuran file di bawah <strong>3 MB</strong> per foto agar proses unggah dan pembukaan katalog oleh pembeli berlangsung cepat dan hemat kuota internet.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded-md transition-colors shadow-xs"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
