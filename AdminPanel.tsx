
import React, { useState, useEffect } from 'react';
import type { Movie } from './movieTypes';
import type { FabIconType, AppMode } from './App';
import { BackButton } from './BackButton';
import { PlusIcon, MinusIcon, TrashIcon, CameraIcon } from './components/icons';


interface AdminPanelProps {
  movies: Movie[];
  announcement: string;
  introVideoUrl: string | null;
  featuredMovieId: number | null;
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
  onUpdateIntroVideo: (url: string) => void;
  onSetFeaturedMovie: (id: number | null) => void;
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

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPosterUrl = URL.createObjectURL(file);
      setEditedMovie(prev => ({ ...prev, posterOverrideUrl: newPosterUrl }));
      setHasChanges(true);
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
        <img src={editedMovie.posterOverrideUrl || editedMovie.posterPath} alt={editedMovie.title} className="w-20 rounded object-cover aspect-[2/3]" />
        <label htmlFor={`poster-upload-${movie.id}`} className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded">
            <CameraIcon className="w-6 h-6 mb-1" />
            <span className="text-xs text-center">เปลี่ยนรูป</span>
            <span className="text-xs text-slate-300 mt-1">(400x600px)</span>
            <input
                id={`poster-upload-${movie.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePosterChange}
            />
        </label>
      </div>

      <div className="flex-grow w-full space-y-3">
        <div>
          <label htmlFor={`title-${movie.id}`} className="block text-xs font-medium text-slate-400 mb-1">ชื่อภาพยนตร์</label>
          <input
            id={`title-${movie.id}`}
            type="text"
            value={editedMovie.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500"
            placeholder="ชื่อภาพยนตร์"
          />
        </div>

        <div>
            <label htmlFor={`summary-${movie.id}`} className="block text-xs font-medium text-slate-400 mb-1">เรื่องย่อ (Summary)</label>
            <textarea
                id={`summary-${movie.id}`}
                value={editedMovie.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full h-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500 resize-y"
                placeholder="เรื่องย่อของภาพยนตร์"
                rows={3}
            />
        </div>

        <div>
          <label htmlFor={`booking-${movie.id}`} className="block text-xs font-medium text-slate-400 mb-1">ลิงก์จองตั๋ว / โปรโมชั่น</label>
          <input
            id={`booking-${movie.id}`}
            type="url"
            value={editedMovie.bookingUrl || ''}
            onChange={(e) => handleChange('bookingUrl', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500"
            placeholder="https://example.com/promotion"
          />
        </div>

        <div>
          <label htmlFor={`booking-text-${movie.id}`} className="block text-xs font-medium text-slate-400 mb-1">ข้อความปุ่มจองตั๋ว</label>
          <input
            id={`booking-text-${movie.id}`}
            type="text"
            value={editedMovie.bookingButtonText || ''}
            onChange={(e) => handleChange('bookingButtonText', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500"
            placeholder="เช่น จองตั๋ว / ชมโปรโมชั่น"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-slate-300">โปสเตอร์เคลื่อนไหว</span>
            <button
                onClick={handleToggleAnimation}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                editedMovie.isAnimated ? 'bg-indigo-500' : 'bg-slate-600'
                }`}
                aria-label="Toggle animated poster"
            >
                <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    editedMovie.isAnimated ? 'translate-x-6' : 'translate-x-1'
                }`}
                />
            </button>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 mt-2 border-t border-slate-700 pt-3">
            <button 
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors text-sm"
            >
                บันทึก
            </button>
            <button 
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors text-sm"
            >
                ยกเลิก
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NewMovieForm: React.FC<{ onSave: (newMovieData: Omit<Movie, 'id'>) => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    const [newMovie, setNewMovie] = useState<Omit<Movie, 'id'>>({
        title: '',
        summary: '',
        posterPath: '',
        bookingUrl: '',
        bookingButtonText: '',
        isAnimated: false,
    });

    const handleChange = (field: keyof Omit<Movie, 'id'>, value: string | boolean) => {
        setNewMovie(prev => ({ ...prev, [field]: value }));
    };

    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const posterUrl = URL.createObjectURL(file);
            handleChange('posterPath', posterUrl);
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
                    <p className="text-xs text-slate-500 mb-2">ขนาดที่แนะนำ: 400x600 pixels</p>
                    {newMovie.posterPath ? (
                        <div className="relative group w-24">
                            <img src={newMovie.posterPath} alt="Poster preview" className="h-auto w-full object-contain rounded bg-slate-700 aspect-[2/3]" />
                            <label htmlFor="new-poster-upload" className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded">
                                <CameraIcon className="w-6 h-6 mb-1" />
                                <span className="text-xs text-center">เปลี่ยนรูป</span>
                                <input id="new-poster-upload" type="file" accept="image/*" className="hidden" onChange={handlePosterChange} />
                            </label>
                        </div>
                    ) : (
                        <label className="w-full text-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-4 rounded-md transition-colors block">
                            <div className="flex flex-col items-center justify-center">
                                <CameraIcon className="w-8 h-8 mb-2 text-slate-400"/>
                                <span>อัปโหลดรูปโปสเตอร์*</span>
                            </div>
                            <input id="new-poster-upload" type="file" accept="image/*" className="hidden" onChange={handlePosterChange} />
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
    movies, 
    announcement, 
    introVideoUrl, 
    featuredMovieId, 
    isFabEnabled,
    fabIcon,
    mainTitle,
    subtitle,
    headerImageUrl,
    onUpdateMovie, 
    onAddNewMovie,
    onRemoveMovie,
    onSetAnnouncement, 
    onUpdateIntroVideo, 
    onSetFeaturedMovie,
    onSetIsFabEnabled,
    onSetFabIcon,
    onSetMainTitle,
    onSetSubtitle,
    onSetHeaderImageUrl,
    onClose 
}) => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(announcement);
  const [editorColumns, setEditorColumns] = useState(1);
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const MIN_EDITOR_COLS = 1;
  const MAX_EDITOR_COLS = 2;

  const handleIncreaseEditorCols = () => setEditorColumns(prev => Math.min(prev + 1, MAX_EDITOR_COLS));
  const handleDecreaseEditorCols = () => setEditorColumns(prev => Math.max(prev - 1, MIN_EDITOR_COLS));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSaveAnnouncement = () => onSetAnnouncement(currentAnnouncement);
  
  const handleIntroVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      onUpdateIntroVideo(videoUrl);
    }
  };

  const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      onSetHeaderImageUrl(imageUrl);
    }
  };

  const handleRemoveHeaderImage = () => {
    onSetHeaderImageUrl(null);
  };

  const handleFeaturedMovieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value ? parseInt(e.target.value, 10) : null;
    onSetFeaturedMovie(id);
  };
  
  const handleFabIconChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSetFabIcon(e.target.value as FabIconType);
  };
  
  const handleSaveNewMovie = (newMovieData: Omit<Movie, 'id'>) => {
    onAddNewMovie(newMovieData);
    setIsAddingMovie(false);
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in-fast"
        onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">แผงควบคุมผู้ดูแล</h2>
            <BackButton onClick={onClose} />
        </header>

        <div className="p-6 overflow-y-auto space-y-8">
            <section>
                <h3 className="text-xl font-semibold text-indigo-300 mb-3">การตั้งค่าทั่วไป</h3>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="main-title-input" className="block text-sm font-medium text-slate-300 mb-2">ชื่อเรื่องหลัก (เมื่อไม่มีรูปหัวเรื่อง)</label>
                        <input id="main-title-input" type="text" value={mainTitle} onChange={(e) => onSetMainTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100" />
                    </div>
                     <div>
                        <label htmlFor="subtitle-input" className="block text-sm font-medium text-slate-300 mb-2">คำโปรย (เมื่อไม่มีรูปหัวเรื่อง)</label>
                        <input id="subtitle-input" type="text" value={subtitle} onChange={(e) => onSetSubtitle(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">รูปหัวเรื่อง (Header Image)</label>
                        <p className="text-xs text-slate-400 mb-2">อัปโหลดรูปภาพเพื่อใช้แทนที่ชื่อเรื่องและคำโปรย ขนาดที่แนะนำ: 1200x300 pixels</p>
                        {headerImageUrl ? (
                            <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
                            <img src={headerImageUrl} alt="Header preview" className="h-12 w-auto object-contain rounded bg-slate-700" />
                            <div className="flex-grow"></div>
                            <button
                                onClick={handleRemoveHeaderImage}
                                className="px-3 py-1.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors text-sm"
                            >
                                ลบรูปภาพ
                            </button>
                            </div>
                        ) : (
                            <label className="w-full text-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors block">
                            อัปโหลดรูปภาพ
                            <input type="file" accept="image/*" className="hidden" onChange={handleHeaderImageChange} />
                            </label>
                        )}
                    </div>
                    <div>
                        <label htmlFor="featured-movie-select" className="block text-sm font-medium text-slate-300 mb-2">ภาพยนตร์แนะนำ (Featured Movie)</label>
                        <select 
                          id="featured-movie-select"
                          value={featuredMovieId ?? ''} 
                          onChange={handleFeaturedMovieChange}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100"
                        >
                          <option value="">-- ไม่มี --</option>
                          {movies.map(movie => (
                            <option key={movie.id} value={movie.id}>{movie.title}</option>
                          ))}
                        </select>
                    </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <label htmlFor="fab-enabled-toggle" className="text-sm font-medium text-slate-300">เปิดใช้งานปุ่มผู้ช่วย AI</label>
                        <button
                            id="fab-enabled-toggle"
                            onClick={() => onSetIsFabEnabled(!isFabEnabled)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isFabEnabled ? 'bg-indigo-500' : 'bg-slate-600'}`}
                            aria-label="Toggle AI Assistant Button"
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isFabEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                     {isFabEnabled && (
                      <div>
                        <label htmlFor="fab-icon-select" className="block text-sm font-medium text-slate-300 mb-2">ไอคอนปุ่มผู้ช่วย</label>
                        <select 
                          id="fab-icon-select"
                          value={fabIcon} 
                          onChange={handleFabIconChange}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100"
                        >
                          <option value="chat">Chat</option>
                          <option value="help">Help</option>
                          <option value="info">Info</option>
                        </select>
                      </div>
                    )}
                    <div>
                        <p className="text-sm text-slate-400 mb-2">อัปโหลดวิดีโอที่จะแสดงเป็น Intro เมื่อเปิดแอป</p>
                        <label className="w-full text-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors block">
                            {introVideoUrl ? 'เปลี่ยนวิดีโอไตเติ้ล' : 'อัปโหลดวิดีโอไตเติ้ล'}
                            <input type="file" accept="video/*" className="hidden" onChange={handleIntroVideoChange} />
                        </label>
                        {introVideoUrl && <p className="text-xs text-cyan-400 mt-2 text-center">มีวิดีโอไตเติ้ลแล้ว</p>}
                    </div>
                </div>
            </section>
            
            <section>
                <h3 className="text-xl font-semibold text-indigo-300 mb-3">ประกาศทั่วไป</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <textarea 
                        value={currentAnnouncement}
                        onChange={(e) => setCurrentAnnouncement(e.target.value)}
                        placeholder="เช่น โปรโมชั่นพิเศษสุดสัปดาห์นี้..."
                        className="w-full h-24 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-colors text-slate-100 placeholder-slate-500 resize-none"
                    />
                    <button onClick={handleSaveAnnouncement} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors h-fit">
                        บันทึก
                    </button>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-indigo-300">จัดการเนื้อหาภาพยนตร์</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsAddingMovie(true)} 
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-1"
                      aria-label="Add new movie"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>เพิ่มใหม่</span>
                    </button>
                    <span className="text-sm text-slate-400 hidden sm:inline">คอลัมน์:</span>
                    <button 
                      onClick={handleDecreaseEditorCols} 
                      disabled={editorColumns === MIN_EDITOR_COLS} 
                      className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease number of columns"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleIncreaseEditorCols} 
                      disabled={editorColumns === MAX_EDITOR_COLS} 
                      className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase number of columns"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {isAddingMovie && <NewMovieForm onSave={handleSaveNewMovie} onCancel={() => setIsAddingMovie(false)} />}
                <div className={`grid ${editorColumns === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                    {movies.map(movie => (
                        <MovieEditor key={movie.id} movie={movie} onUpdate={onUpdateMovie} onRemove={onRemoveMovie}/>
                    ))}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};
