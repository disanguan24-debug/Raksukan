import React, { useEffect, useState } from 'react';
import {
  X,
  Save,
  Upload,
  Image as ImageIcon,
  HelpCircle,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant } from '../types';
import { PhotoGuideModal } from './PhotoGuideModal';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isAdminEdit?: boolean;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isAdminEdit = false,
}) => {
  const { categories, updateProduct } = useStore();

  const [namaProduk, setNamaProduk] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [harga, setHarga] = useState<number>(0);
  const [stok, setStok] = useState<number>(0);
  const [deskripsi, setDeskripsi] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [ukuranInput, setUkuranInput] = useState('');
  const [warnaInput, setWarnaInput] = useState('');
  const [status, setStatus] = useState<'aktif' | 'menunggu_persetujuan' | 'ditolak' | 'nonaktif'>(
    'aktif'
  );

  const [notice, setNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when product prop changes
  useEffect(() => {
    if (product) {
      setNamaProduk(product.nama_produk);
      setCategoryId(product.category_id);
      setHarga(product.harga);
      setStok(product.stok);
      setDeskripsi(product.deskripsi);
      setFotoUrl(product.foto && product.foto.length > 0 ? product.foto[0] : '');
      setStatus(product.status);

      const sizes = Array.from(new Set(product.variants?.map((v) => v.ukuran).filter(Boolean)));
      const colors = Array.from(new Set(product.variants?.map((v) => v.warna).filter(Boolean)));
      setUkuranInput(sizes.join(', '));
      setWarnaInput(colors.join(', '));
      setNotice('');
      setErrorMsg('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('File yang dipilih harus berupa gambar (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file foto maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFotoUrl(reader.result);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!namaProduk.trim()) {
      setErrorMsg('Nama produk tidak boleh kosong.');
      return;
    }

    if (harga < 0) {
      setErrorMsg('Harga produk tidak boleh bernilai negatif.');
      return;
    }

    if (stok < 0) {
      setErrorMsg('Jumlah stok tidak boleh negatif.');
      return;
    }

    setIsSaving(true);

    const sizes = ukuranInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = warnaInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const updatedVariants: ProductVariant[] = [];
    sizes.forEach((sz, idx) => {
      colors.forEach((col, cIdx) => {
        updatedVariants.push({
          id: `var-${product.id}-${idx}-${cIdx}`,
          product_id: product.id,
          ukuran: sz,
          warna: col,
          stok: Math.ceil(stok / (sizes.length * colors.length || 1)),
          harga_tambahan: 0,
        });
      });
    });

    const categoryObj = categories.find((c) => c.id === categoryId);

    updateProduct(product.id, {
      nama_produk: namaProduk.trim(),
      slug: namaProduk.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category_id: categoryId,
      category_name: categoryObj?.nama_kategori || product.category_name,
      harga: Number(harga),
      stok: Number(stok),
      deskripsi: deskripsi.trim(),
      foto: fotoUrl ? [fotoUrl] : product.foto,
      status: status,
      variants: updatedVariants.length > 0 ? updatedVariants : product.variants,
    });

    setIsSaving(false);
    setNotice('Data produk berhasil diperbarui!');
    setTimeout(() => {
      setNotice('');
      onClose();
    }, 1200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#e6decb] p-6 space-y-5 my-8 text-[#1c2420]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#8a7f72] hover:text-[#1e4535] rounded-full transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#f0ebd9]">
            <div className="w-10 h-10 rounded-lg bg-[#efe9dc] text-[#1e4535] flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5 text-[#c86d44]" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1e4535]">
                Ubah & Perbaiki Data Produk
              </h2>
              <p className="text-xs text-[#6b6255]">
                Koreksi nama, harga, jumlah stok, foto, atau varian produk yang keliru.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {notice && (
            <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
            {/* Nama Produk */}
            <div className="space-y-1">
              <label className="font-semibold text-[#383129] block">
                Nama Produk Fashion <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaProduk}
                onChange={(e) => setNamaProduk(e.target.value)}
                placeholder="Nama produk busana..."
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>

            {/* Kategori & Harga */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#383129] block">Kategori</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#383129] block">
                  Harga Satuan (Rupiah) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={harga}
                  onChange={(e) => setHarga(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Stok & Status (jika admin) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#383129] block">
                  Jumlah Stok Ready <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stok}
                  onChange={(e) => setStok(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#383129] block">Status Produk</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden bg-white"
                >
                  <option value="aktif">Aktif (Tampil di Toko)</option>
                  <option value="nonaktif">Nonaktif (Sembunyikan Sementara)</option>
                  <option value="menunggu_persetujuan">Menunggu Persetujuan</option>
                  {isAdminEdit && <option value="ditolak">Ditolak</option>}
                </select>
              </div>
            </div>

            {/* Ukuran & Warna */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#383129] block">
                  Variasi Ukuran (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={ukuranInput}
                  onChange={(e) => setUkuranInput(e.target.value)}
                  placeholder="S, M, L, XL, All Size"
                  className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#383129] block">
                  Pilihan Warna (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={warnaInput}
                  onChange={(e) => setWarnaInput(e.target.value)}
                  placeholder="Hitam, Terracotta, Hijau Sage"
                  className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
                />
              </div>
            </div>

            {/* Foto Produk Section */}
            <div className="space-y-2 pt-2 border-t border-[#f0ebd9]">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#383129] block">Foto Produk</label>
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="text-[11px] font-semibold text-[#1e4535] hover:text-[#c86d44] flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Petunjuk Menambah Foto</span>
                </button>
              </div>

              {/* Preview foto */}
              <div className="flex items-center gap-4 p-3 bg-[#faf8f5] rounded-lg border border-[#e6decb]">
                <div className="w-20 h-20 rounded bg-white overflow-hidden border border-[#d6cdbc] shrink-0 flex items-center justify-center">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-[#8a7f72]" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e4535] text-white rounded text-xs font-semibold hover:bg-[#16382b] cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Foto dari Galeri HP / Laptop</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {fotoUrl && (
                    <button
                      type="button"
                      onClick={() => setFotoUrl('')}
                      className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus Foto Saat Ini
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#736859] block">
                  Atau masukkan URL / Link Foto Online langsung:
                </span>
                <input
                  type="text"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://... link gambar foto"
                  className="w-full px-3 py-1.5 text-xs border border-[#d6cdbc] rounded focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1">
              <label className="font-semibold text-[#383129] block">Deskripsi & Rincian Bahan</label>
              <textarea
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan bahan, furing, kenyamanan, atau petunjuk perawatan..."
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#f0ebd9] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#d6cdbc] rounded text-[#554b40] hover:bg-[#faf8f5] transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Petunjuk Foto Modal */}
      <PhotoGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
};
