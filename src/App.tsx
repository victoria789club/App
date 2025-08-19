import React, { useState, useCallback, useEffect, useRef } from 'react';
import { HomeView } from './components/HomeView';
import { DetailView } from './components/DetailView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { IntroVideo } from './components/IntroVideo';
import { MovieIcon } from './components/icons';
import { FloatingActionButton } from './components/FloatingActionButton';
import type { Movie } from './types';
import { MaintenanceView } from './components/MaintenanceView';
import { db } from './services/firebase';
import { collection, doc, onSnapshot, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

export type FabIconType = 'chat' | 'help' | 'info';
export type AppMode = 'content' | 'links';

// Represents the structure of the settings document in Firestore
interface AppSettings {
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
}

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // This remains local state
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  
  const [settingsTapCount, setSettingsTapCount] = useState(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isAnyModalOpen = selectedMovie || isAdminPanelOpen || isLoginModalOpen;

  // Effect to fetch and listen for real-time updates from Firestore
  useEffect(() => {
    // Listen for movie updates
    const moviesCollectionRef = collection(db, "movies");
    const unsubscribeMovies = onSnapshot(moviesCollectionRef, (snapshot) => {
      const moviesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Movie[];
      setMovies(moviesData.sort((a, b) => (a.order || 0) - (b.order || 0))); // Sort by order if available
    });

    // Listen for app settings updates
    const settingsDocRef = doc(db, "settings", "global");
    const unsubscribeSettings = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as AppSettings);
      } else {
        console.error("Global settings document does not exist in Firestore!");
      }
    });

    // Cleanup listeners on component unmount
    return () => {
      unsubscribeMovies();
      unsubscribeSettings();
    };
  }, []);

  // Helper function to update a specific field in the settings document
  const updateSetting = async (field: keyof AppSettings, value: any) => {
    const settingsDocRef = doc(db, "settings", "global");
    try {
      await updateDoc(settingsDocRef, { [field]: value });
    } catch (error) {
      console.error("Error updating setting:", field, error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : '';
  }, [isAnyModalOpen]);
  
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  const handleSelectMovie = useCallback((movie: Movie) => setSelectedMovie(movie), []);
  const handleCloseDetail = useCallback(() => setSelectedMovie(null), []);
  
  const handleSettingsClick = () => {
    if (isAdminAuthenticated) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleSecretTap = () => {
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    const newCount = settingsTapCount + 1;
    setSettingsTapCount(newCount);
    if (newCount >= 4) {
      handleSettingsClick();
      setSettingsTapCount(0);
    } else {
      tapTimeoutRef.current = setTimeout(() => setSettingsTapCount(0), 1500);
    }
  };

  const handleCloseAdminPanel = () => setIsAdminPanelOpen(false);
  
  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsLoginModalOpen(false);
    setIsAdminPanelOpen(true);
  };
  
  const handleLoginClose = () => setIsLoginModalOpen(false);

  const handleUpdateMovie = async (updatedMovie: Movie) => {
    if (!updatedMovie.id) return;
    const movieDocRef = doc(db, "movies", updatedMovie.id.toString());
    // Exclude 'id' from the object being written to Firestore
    const { id, ...movieData } = updatedMovie;
    await updateDoc(movieDocRef, movieData);
  };
  
  const handleAddNewMovie = async (newMovieData: Omit<Movie, 'id'>) => {
    await addDoc(collection(db, "movies"), {
      ...newMovieData,
      order: movies.length, // Add an order for sorting
    });
  };

  const handleRemoveMovie = async (movieId: number | string) => {
    if (settings?.featuredMovieId?.toString() === movieId.toString()) {
      await updateSetting('featuredMovieId', null);
    }
    await deleteDoc(doc(db, "movies", movieId.toString()));
  };

  const handleIntroFinish = () => setIsIntroFinished(true);
  
  // Loading state while settings are being fetched
  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
      </div>
    );
  }

  if (settings.introVideoUrl && !isIntroFinished) {
    return <IntroVideo videoSrc={settings.introVideoUrl} onFinish={handleIntroFinish} />;
  }
  
  if (settings.appMode === 'links' && !isAnyModalOpen) {
    if (settings.maintenanceImageUrl) {
      return <MaintenanceView imageUrl={settings.maintenanceImageUrl} />;
    }
    if (settings.redirectUrl) {
      useEffect(() => {
        try {
          new URL(settings.redirectUrl);
          window.location.href = settings.redirectUrl;
        } catch (e) {
          console.error("Invalid redirect URL:", settings.redirectUrl);
        }
      }, [settings.redirectUrl]);
      return <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center"><h1 className="text-2xl font-bold">กำลังส่งต่อไปยัง...</h1><p className="text-slate-400 mt-2">Redirecting...</p></div>;
    }
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center text-center p-4">
        <MovieIcon className="w-16 h-16 text-indigo-400 mb-4" />
        <h1 className="text-2xl font-bold">บริการไม่พร้อมใช้งานชั่วคราว</h1>
        <p className="text-slate-400 mt-2">Service is temporarily unavailable. Please check back later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <header className="w-full max-w-5xl text-center mb-8 relative">
          {settings.headerImageUrl && settings.appMode === 'content' ? (
            <div className="my-4">
              <img src={settings.headerImageUrl} alt="Movie World AI Header" className="w-full h-auto object-contain max-h-40" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-4 mb-2">
                <MovieIcon className="w-12 h-12 text-indigo-400" />
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 text-transparent bg-clip-text">
                  {settings.mainTitle}
                </h1>
              </div>
              <p className="text-slate-400 text-lg">{settings.subtitle}</p>
            </>
          )}
          <div onClick={handleSecretTap} className="absolute top-0 right-0 w-20 h-20 -m-4 cursor-default" aria-label="Secret admin panel trigger" />
        </header>

        <main className="w-full max-w-5xl flex-grow">
          <HomeView movies={movies} onSelectMovie={handleSelectMovie} announcement={settings.announcement} featuredMovieId={settings.featuredMovieId} />
        </main>
        
        <footer className="w-full max-w-5xl text-center mt-12 text-slate-500 text-sm">
          <p>สงวนลิขสิทธิ์ © {new Date().getFullYear()} {settings.mainTitle}. All Rights Reserved.</p>
        </footer>
      </div>

      {selectedMovie && <DetailView movie={selectedMovie} onBack={handleCloseDetail} />}
      {isLoginModalOpen && <AdminLogin onSuccess={handleLoginSuccess} onClose={handleLoginClose} />}

      {isAdminPanelOpen && (
        <AdminPanel
          movies={movies}
          announcement={settings.announcement}
          introVideoUrl={settings.introVideoUrl}
          featuredMovieId={settings.featuredMovieId}
          isFabEnabled={settings.isFabEnabled}
          fabIcon={settings.fabIcon}
          mainTitle={settings.mainTitle}
          subtitle={settings.subtitle}
          headerImageUrl={settings.headerImageUrl}
          appMode={settings.appMode}
          redirectUrl={settings.redirectUrl}
          maintenanceImageUrl={settings.maintenanceImageUrl}
          onUpdateMovie={handleUpdateMovie}
          onAddNewMovie={handleAddNewMovie}
          onRemoveMovie={handleRemoveMovie}
          onSetAnnouncement={(val) => updateSetting('announcement', val)}
          onUpdateIntroVideo={(val) => updateSetting('introVideoUrl', val)}
          onSetFeaturedMovie={(val) => updateSetting('featuredMovieId', val)}
          onSetIsFabEnabled={(val) => updateSetting('isFabEnabled', val)}
          onSetFabIcon={(val) => updateSetting('fabIcon', val)}
          onSetMainTitle={(val) => updateSetting('mainTitle', val)}
          onSetSubtitle={(val) => updateSetting('subtitle', val)}
          onSetHeaderImageUrl={(val) => updateSetting('headerImageUrl', val)}
          onSetAppMode={(val) => updateSetting('appMode', val)}
          onSetRedirectUrl={(val) => updateSetting('redirectUrl', val)}
          onSetMaintenanceImageUrl={(val) => updateSetting('maintenanceImageUrl', val)}
          onClose={handleCloseAdminPanel}
        />
      )}
      
      {!isAnyModalOpen && settings.isFabEnabled && settings.appMode === 'content' && (
        <FloatingActionButton icon={settings.fabIcon} onClick={() => {}} disabled={true} />
      )}
    </>
  );
};

export default App;
