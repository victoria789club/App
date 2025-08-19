import React, { useState, useEffect } from 'react';
import type { Movie } from '../../types';
import type { FabIconType, AppMode } from '../../App';
import { BackButton } from './BackButton';
import { PlusIcon, MinusIcon, TrashIcon, CameraIcon } from './icons';
import { uploadFile } from '../../services/firebase'; // Import the upload service

// Define a type for upload state
type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface AdminPanelProps {
  movies: Movie[];
  announcement: string;
  introVideoUrl: string | null;
  featuredMovieId: number | null | string;
  isFabEnabled: boolean;
  fabIcon: FabIconType;
  mainTitle: string;
  subtitle: string;
  headerImageUrl: string | null;
  appMode: AppMode;
  redirectUrl: string;
  maintenanceImageUrl: string | null;
  onUpdateMovie: (movie: Movie) => void;
  onAddNewMovie: (newMovieData: Omit<Movie, 'id'>) => void;
  onRemoveMovie: (movieId: number | string) => void;
  onSetAnnouncement: (announcement: string) => void;
  onUpdateIntroVideo: (url: string | null) => void;
  onSetFeaturedMovie: (id: number | null | string) => void;
  onSetIsFabEnabled: (enabled: boolean) => void;
  onSetFabIcon: (icon: FabIconType) => void;
  onSetMainTitle: (title: string) => void;
  onSetSubtitle: (subtitle: string) => void;
  onSetHeaderImageUrl: (url: string | null) => void;
  onSetAppMode: (mode: AppMode) => void;
  onSetRedirectUrl: (url: string) => void;
  onSetMaintenanceImageUrl: (url: string | null) => void;
  onClose: () => void;
}

const MovieEditor: React.FC<{ movie: Movie; onUpdate: (movie: Movie) => void; onRemove: (id: number | string) => void; }> = ({ movie, onUpdate, onRemove }) => {
  const [editedMovie, setEditedMovie] = useState<Movie>(movie);
  const [hasChanges, setHasChanges] = useState(false);
  const [posterUploadState, setPosterUploadState] = useState<UploadState>('idle');


  useEffect(() => {
    setEditedMovie(movie);
    setHasChanges(false);
  }, [movie]);
  
  const handleRemove = () => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${movie.title}"?`)) {
      onRemove(movie.id);
    }
  };

  const handleChange = (field: keyof Omit<Movie, 'id' | 'isAnimated'>, value: string) => {
    setEditedMovie(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPosterUploadState('uploading');
      try {
        const downloadURL = await uploadFile(file, `posters/${file.name}_${Date.now()}`);
        setEditedMovie(prev => ({ ...prev, posterPath: downloadURL }));
        setHasChanges(true);
        setPosterUploadState('success');
      } catch (error) {
        console.error("Error uploading poster:", error);
        setPosterUploadState('error');
      }
    }
  };
  
  const handleToggleAnimation = () => {
    setEditedMovie(prev => ({ ...prev, isAnimated: !prev.isAnimated }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(editedMovie);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedMovie(movie);
    setHasChanges(false);
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg flex flex-col sm:flex-row items-start gap-4 relative">
      <button onClick={handleRemove} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10" aria-label={`Remove ${movie.title}`}>
        <TrashIcon className="w-5 h-5" />
      </button>

      <div className="relative w-20 flex-shrink-0 group">
        <img src={editedMovie.posterPath} alt={editedMovie.title} className="w-20 rounded object-cover aspect-[2/3]" />
        <label htmlFor={`poster-upload-${movie.id}`} className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded">
            {posterUploadState === 'uploading' ? (
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                <CameraIcon className="w-6 h-6 mb-1" />
                <span className="text-xs text-center">เปลี่ยนรูป</span>
                </>
            )}
            <input
                id={`poster-upload-${movie.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePosterChange}
                disabled={posterUploadState === 'uploading'}
            />
        </label>
      </div>

      <div className="flex-grow w-full space-y-3">
        <div>
          <label htmlFor={`title-${movie.id}`} className="block text-xs font-medium text-slate-400 mb-1">ชื่อภาพยนตร์</label>
          <input id={`title-${movie.id}`} type="text" value={editedMovie.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500" placeholder="ชื่อภาพยนตร์" />
        </div>
        <div>
            <label htmlFor={`summary-${movie.id}`} className="block text-xs font-medium text-slate-400 mb-1">เรื่องย่อ (Summary)</label>
            <textarea id={`summary-${movie.id}`} value={editedMovie.summary} onChange={(e) => handleChange('summary', e.target.value)} className="w-full h-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500 resize-y" placeholder="เรื่องย่อของภาพยนตร์" rows={3} />
        </div>
        <div>
          <label htmlFor={`booking-${movie.id}`} className="block text-xs font-medium text-slate-400 mb-1">ลิงก์จองตั๋ว / โปรโมชั่น</label>
          <input id={`booking-${movie.id}`} type="url" value={editedMovie.bookingUrl || ''} onChange={(e) => handleChange('bookingUrl', e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500" placeholder="https://example.com/promotion" />
        </div>
        <div>
          <label htmlFor={`booking-text-${movie.id}`} className="block text-xs font-medium text-slate-400 mb-1">ข้อความปุ่มจองตั๋ว</label>
          <input id={`booking-text-${movie.id}`} type="text" value={editedMovie.bookingButtonText || ''} onChange={(e) => handleChange('bookingButtonText', e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500" placeholder="เช่น จองตั๋ว / ชมโปรโมชั่น" />
        </div>
        <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-slate-300">โปสเตอร์เคลื่อนไหว</span>
            <button onClick={handleToggleAnimation} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${editedMovie.isAnimated ? 'bg-indigo-500' : 'bg-slate-600'}`} aria-label="Toggle animated poster">
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${editedMovie.isAnimated ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2 mt-2 border-t border-slate-700 pt-3">
            <button onClick={handleSave} className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors text-sm">บันทึก</button>
            <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors text-sm">ยกเลิก</button>
          </div>
        )}
      </div>
    </div>
  );
};

const NewMovieForm: React.FC<{ onSave: (newMovieData: Omit<Movie, 'id'>) => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    const [newMovie, setNewMovie] = useState<Omit<Movie, 'id'>>({ title: '', summary: '', posterPath: '', bookingUrl: '', bookingButtonText: '', isAnimated: false });
    const [uploadState, setUploadState] = useState<UploadState>('idle');

    const handleChange = (field: keyof Omit<Movie, 'id'>, value: string | boolean) => {
        setNewMovie(prev => ({ ...prev, [field]: value }));
    };

    const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadState('uploading');
            try {
                const posterUrl = await uploadFile(file, `posters/${file.name}_${Date.now()}`);
                handleChange('posterPath', posterUrl);
                setUploadState('success');
            } catch (error) {
                console.error("Error uploading new poster:", error);
                setUploadState('error');
            }
        }
    };

    const handleSave = () => {
        if (!newMovie.title.trim() || !newMovie.summary.trim() || !newMovie.posterPath.trim()) {
            alert('กรุณากรอกข้อมูลที่จำเป็น: ชื่อภาพยนตร์, เรื่องย่อ, และอัปโหลดโปสเตอร์');
            return;
        }
        onSave(newMovie);
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg mb-4 space-y-3 border border-indigo-500/50">
            <h4 className="text-lg font-semibold text-white">เพิ่มภาพยนตร์ใหม่</h4>
            <div className="space-y-3">
                <input type="text" value={newMovie.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="ชื่อภาพยนตร์*" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500" />
                <textarea value={newMovie.summary} onChange={(e) => handleChange('summary', e.target.value)} placeholder="เรื่องย่อ*" className="w-full h-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500 resize-y" />
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">โปสเตอร์*</label>
                    {newMovie.posterPath ? (
                        <div className="relative group w-24">
                            <img src={newMovie.posterPath} alt="Poster preview" className="h-auto w-full object-contain rounded bg-slate-700 aspect-[2/3]" />
                            <label htmlFor="new-poster-upload" className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded">
                                {uploadState === 'uploading' ? <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"></div> : <><CameraIcon className="w-6 h-6 mb-1" /><span className="text-xs text-center">เปลี่ยนรูป</span></>}
                                <input id="new-poster-upload" type="file" accept="image/*" className="hidden" onChange={handlePosterChange} disabled={uploadState === 'uploading'}/>
                            </label>
                        </div>
                    ) : (
                        <label className="w-full text-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-4 rounded-md transition-colors block">
                            <div className="flex flex-col items-center justify-center">
                                {uploadState === 'uploading' ? <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"></div> : <><CameraIcon className="w-8 h-8 mb-2 text-slate-400"/><span>อัปโหลดรูปโปสเตอร์*</span></>}
                            </div>
                            <input id="new-poster-upload" type="file" accept="image/*" className="hidden" onChange={handlePosterChange} disabled={uploadState === 'uploading'}/>
                        </label>
                    )}
                </div>
                <input type="url" value={newMovie.bookingUrl || ''} onChange={(e) => handleChange('bookingUrl', e.target.value)} placeholder="URL จองตั๋ว / โปรโมชั่น" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500" />
                <input type="text" value={newMovie.bookingButtonText || ''} onChange={(e) => handleChange('bookingButtonText', e.target.value)} placeholder="ข้อความปุ่มจองตั๋ว" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500" />
            </div>
            <div className="flex items-center gap-2 mt-2 border-t border-slate-700 pt-3">
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors text-sm">บันทึก</button>
                <button onClick={onCancel} className="flex-1 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors text-sm">ยกเลิก</button>
            </div>
        </div>
    );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
    movies, announcement, introVideoUrl, featuredMovieId, isFabEnabled, fabIcon, mainTitle, subtitle, headerImageUrl, appMode, redirectUrl, maintenanceImageUrl,
    onUpdateMovie, onAddNewMovie, onRemoveMovie, onSetAnnouncement, onUpdateIntroVideo, onSetFeaturedMovie, onSetIsFabEnabled, onSetFabIcon,
    onSetMainTitle, onSetSubtitle, onSetHeaderImageUrl, onSetAppMode, onSetRedirectUrl, onSetMaintenanceImageUrl, onClose 
}) => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(announcement);
  const [currentRedirectUrl, setCurrentRedirectUrl] = useState(redirectUrl);
  const [editorColumns, setEditorColumns] = useState(1);
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [uploadStates, setUploadStates] = useState({ header: 'idle', intro: 'idle', maintenance: 'idle' });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => { setCurrentRedirectUrl(redirectUrl); }, [redirectUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string, stateKey: keyof typeof uploadStates, callback: (url: string | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadStates(prev => ({ ...prev, [stateKey]: 'uploading' }));
      try {
        const downloadURL = await uploadFile(file, `${path}/${file.name}_${Date.now()}`);
        callback(downloadURL);
        setUploadStates(prev => ({ ...prev, [stateKey]: 'success' }));
      } catch (error) {
        console.error(`Error uploading ${stateKey}:`, error);
        setUploadStates(prev => ({ ...prev, [stateKey]: 'error' }));
      }
    }
  };
  
  const handleSaveNewMovie = (newMovieData: Omit<Movie, 'id'>) => {
    onAddNewMovie(newMovieData);
    setIsAddingMovie(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in-fast" onClick={onClose}>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b border-slate-700 flex justify-between items-center gap-4 relative">
            <h2 className="text-2xl font-bold text-white">แผงควบคุมผู้ดูแล</h2>
            <BackButton onClick={onClose} />
        </header>

        <div className="p-6 overflow-y-auto space-y-8">
            <section>
                <h3 className="text-xl font-semibold text-indigo-300 mb-3">การตั้งค่าทั่วไป</h3>
                <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">โหมดการทำงานของแอป</label>
                      <div className="flex items-center bg-slate-800 p-1 rounded-lg">
                          <button onClick={() => onSetAppMode('content')} className={`flex-1 text-center px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${appMode === 'content' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>จัดการเนื้อหา</button>
                          <button onClick={() => onSetAppMode('links')} className={`flex-1 text-center px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${appMode === 'links' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>จัดการลิงก์</button>
                      </div>
                    </div>
                    <div>
                        <label htmlFor="main-title-input" className="block text-sm font-medium text-slate-300 mb-2">ชื่อเรื่องหลัก</label>
                        <input id="main-title-input" type="text" value={mainTitle} onChange={(e) => onSetMainTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100" />
                    </div>
                    <div>
                        <label htmlFor="subtitle-input" className="block text-sm font-medium text-slate-300 mb-2">คำโปรย</label>
                        <input id="subtitle-input" type="text" value={subtitle} onChange={(e) => onSetSubtitle(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">รูปหัวเรื่อง</label>
                        {headerImageUrl ? (
                            <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
                              <img src={headerImageUrl} alt="Header preview" className="h-12 w-auto object-contain rounded bg-slate-700" />
                              <div className="flex-grow"></div>
                              <button onClick={() => onSetHeaderImageUrl(null)} className="px-3 py-1.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors text-sm">ลบรูปภาพ</button>
                            </div>
                        ) : (
                            <label className={`w-full text-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors block ${uploadStates.header === 'uploading' ? 'cursor-not-allowed' : ''}`}>
                              {uploadStates.header === 'uploading' ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'headers', 'header', onSetHeaderImageUrl)} disabled={uploadStates.header === 'uploading'} />
                            </label>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">วิดีโอไตเติ้ล</label>
                        <label className={`w-full text-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors block ${uploadStates.intro === 'uploading' ? 'cursor-not-allowed' : ''}`}>
                            {uploadStates.intro === 'uploading' ? 'กำลังอัปโหลด...' : (introVideoUrl ? 'เปลี่ยนวิดีโอ' : 'อัปโหลดวิดีโอ')}
                            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'intros', 'intro', onUpdateIntroVideo)} disabled={uploadStates.intro === 'uploading'} />
                        </label>
                        {introVideoUrl && <p className="text-xs text-cyan-400 mt-2 text-center">มีวิดีโอไตเติ้ลแล้ว <button onClick={() => onUpdateIntroVideo(null)} className="text-red-400 underline">(ลบ)</button></p>}
                    </div>
                </div>
            </section>
            
            {appMode === 'links' && (
                <section>
                    <h3 className="text-xl font-semibold text-indigo-300 mb-3">การตั้งค่าโหมดจัดการลิงก์</h3>
                    <div className="space-y-4 bg-slate-800/50 p-4 rounded-lg">
                        <div>
                            <label htmlFor="redirect-url-input" className="block text-sm font-medium text-slate-300 mb-2">URL สำหรับส่งต่อ</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input id="redirect-url-input" type="url" value={currentRedirectUrl} onChange={(e) => setCurrentRedirectUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500" />
                                <button onClick={() => onSetRedirectUrl(currentRedirectUrl)} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors h-fit">บันทึก URL</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">รูปภาพแจ้งเตือน</label>
                            {maintenanceImageUrl ? (
                                <div className="flex items-center gap-4 p-2 bg-slate-700 rounded-lg">
                                    <img src={maintenanceImageUrl} alt="Maintenance preview" className="h-16 w-auto object-contain rounded bg-slate-600" />
                                    <div className="flex-grow"></div>
                                    <button onClick={() => onSetMaintenanceImageUrl(null)} className="px-3 py-1.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors text-sm flex-shrink-0">ลบรูปภาพ</button>
                                </div>
                            ) : (
                                <label className={`w-full text-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors block ${uploadStates.maintenance === 'uploading' ? 'cursor-not-allowed' : ''}`}>
                                    {uploadStates.maintenance === 'uploading' ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'maintenance', 'maintenance', onSetMaintenanceImageUrl)} disabled={uploadStates.maintenance === 'uploading'}/>
                                </label>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {appMode === 'content' && (
                <>
                    <section>
                        <h3 className="text-xl font-semibold text-indigo-300 mb-3">การตั้งค่าเฉพาะโหมดเนื้อหา</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="featured-movie-select" className="block text-sm font-medium text-slate-300 mb-2">ภาพยนตร์แนะนำ</label>
                                <select id="featured-movie-select" value={featuredMovieId?.toString() ?? ''} onChange={(e) => onSetFeaturedMovie(e.target.value || null)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100">
                                    <option value="">-- ไม่มี --</option>
                                    {movies.map(movie => (<option key={movie.id} value={movie.id}>{movie.title}</option>))}
                                </select>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                <label htmlFor="fab-enabled-toggle" className="text-sm font-medium text-slate-300">เปิดใช้งานปุ่มผู้ช่วย AI</label>
                                <button id="fab-enabled-toggle" onClick={() => onSetIsFabEnabled(!isFabEnabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isFabEnabled ? 'bg-indigo-500' : 'bg-slate-600'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isFabEnabled ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                            </div>
                            {isFabEnabled && (
                                <div>
                                <label htmlFor="fab-icon-select" className="block text-sm font-medium text-slate-300 mb-2">ไอคอนปุ่มผู้ช่วย</label>
                                <select id="fab-icon-select" value={fabIcon} onChange={(e) => onSetFabIcon(e.target.value as FabIconType)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100">
                                    <option value="chat">Chat</option>
                                    <option value="help">Help</option>
                                    <option value="info">Info</option>
                                </select>
                                </div>
                            )}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold text-indigo-300 mb-3">ประกาศทั่วไป</h3>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <textarea value={currentAnnouncement} onChange={(e) => setCurrentAnnouncement(e.target.value)} placeholder="เช่น โปรโมชั่นพิเศษ..." className="w-full h-24 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500 resize-none" />
                            <button onClick={() => onSetAnnouncement(currentAnnouncement)} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors h-fit">บันทึก</button>
                        </div>
                    </section>
                    <section>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold text-indigo-300">จัดการเนื้อหาภาพยนตร์</h3>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setIsAddingMovie(true)} className="px-3 py-1.5 text-sm bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-1"><PlusIcon className="w-4 h-4" /><span>เพิ่มใหม่</span></button>
                              <span className="text-sm text-slate-400 hidden sm:inline">คอลัมน์:</span>
                              <button onClick={() => setEditorColumns(1)} disabled={editorColumns === 1} className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><MinusIcon className="w-5 h-5" /></button>
                              <button onClick={() => setEditorColumns(2)} disabled={editorColumns === 2} className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><PlusIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                        {isAddingMovie && <NewMovieForm onSave={handleSaveNewMovie} onCancel={() => setIsAddingMovie(false)} />}
                        <div className={`grid ${editorColumns === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                            {movies.map(movie => (<MovieEditor key={movie.id} movie={movie} onUpdate={onUpdateMovie} onRemove={onRemoveMovie}/>))}
                        </div>
                    </section>
                </>
            )}
        </div>
      </div>
    </div>
  );
};
