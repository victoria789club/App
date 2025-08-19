
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { HomeView } from './components/HomeView';
import { DetailView } from './components/DetailView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './AdminLogin';
import { IntroVideo } from './components/IntroVideo';
import { MovieIcon } from './components/icons';
import { FloatingActionButton } from './components/FloatingActionButton';
import type { Movie } from './movieTypes';
import { mockMovies } from './data/mockMovies';
import { UserLinkManagerView } from './components/UserLinkManagerView';

export type FabIconType = 'chat' | 'help' | 'info';
export type AppMode = 'content' | 'links';

const APP_MODE_KEY = 'app_mode';
const REDIRECT_URL_KEY = 'redirect_url';
const MAINTENANCE_IMAGE_URL_KEY = 'maintenance_image_url';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(null);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [featuredMovieId, setFeaturedMovieId] = useState<number | null>(2); // Default to "Dune: Part Two"
  const [isFabEnabled, setIsFabEnabled] = useState(false);
  const [fabIcon, setFabIcon] = useState<FabIconType>('chat');
  const [mainTitle, setMainTitle] = useState('Movie World AI');
  const [subtitle, setSubtitle] = useState('ค้นพบภาพยนตร์และสัมผัสประสบการณ์โปรโมทด้วยพลังของ AI');
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('content');

  // Add state for redirect and maintenance URLs to fix AdminPanel props error
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [maintenanceImageUrl, setMaintenanceImageUrl] = useState<string | null>(null);


  const [settingsTapCount, setSettingsTapCount] = useState(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isAnyModalOpen = selectedMovie || isAdminPanelOpen || isLoginModalOpen;

  useEffect(() => {
    // Load persisted settings from local storage on initial load
    const savedMode = localStorage.getItem(APP_MODE_KEY) as AppMode;
    if (savedMode && (savedMode === 'content' || savedMode === 'links')) {
      setAppMode(savedMode);
    }
    const savedRedirectUrl = localStorage.getItem(REDIRECT_URL_KEY);
    if (savedRedirectUrl) {
      setRedirectUrl(savedRedirectUrl);
    }
    const savedMaintenanceImageUrl = localStorage.getItem(MAINTENANCE_IMAGE_URL_KEY);
    if (savedMaintenanceImageUrl) {
      setMaintenanceImageUrl(savedMaintenanceImageUrl);
    }
  }, []);
  
  const handleSetAppMode = (mode: AppMode) => {
    setAppMode(mode);
    localStorage.setItem(APP_MODE_KEY, mode);
  };

  // Add handlers for redirect and maintenance URLs
  const handleSetRedirectUrl = (url: string) => {
    setRedirectUrl(url);
    if (url) {
      localStorage.setItem(REDIRECT_URL_KEY, url);
    } else {
      localStorage.removeItem(REDIRECT_URL_KEY);
    }
  };

  const handleSetMaintenanceImageUrl = (url: string | null) => {
    setMaintenanceImageUrl(url);
    if (url) {
      localStorage.setItem(MAINTENANCE_IMAGE_URL_KEY, url);
    } else {
      localStorage.removeItem(MAINTENANCE_IMAGE_URL_KEY);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : '';
  }, [isAnyModalOpen]);
  
  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedMovie(null);
  }, []);
  
  const handleSettingsClick = () => {
    if (isAdminAuthenticated) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleSecretTap = () => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    const newCount = settingsTapCount + 1;
    setSettingsTapCount(newCount);

    if (newCount >= 4) {
      handleSettingsClick();
      setSettingsTapCount(0);
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        setSettingsTapCount(0);
      }, 1500); // Reset taps after 1.5 seconds of inactivity
    }
  };

  const handleCloseAdminPanel = () => {
    setIsAdminPanelOpen(false);
  };
  
  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsLoginModalOpen(false);
    setIsAdminPanelOpen(true);
  };
  
  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleUpdateMovie = (updatedMovie: Movie) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => movie.id === updatedMovie.id ? updatedMovie : movie)
    );
  };
  
  const handleAddNewMovie = (newMovieData: Omit<Movie, 'id'>) => {
    setMovies(prevMovies => {
      const newMovie: Movie = {
        ...newMovieData,
        id: Date.now(), // Use timestamp for a simple unique ID
      };
      return [...prevMovies, newMovie];
    });
  };

  const handleRemoveMovie = (movieId: number | string) => {
    // If the removed movie is the featured movie, reset the feature.
    if (featuredMovieId === movieId) {
      setFeaturedMovieId(null);
    }
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
  };

  const handleUpdateIntroVideo = (url: string) => {
    setIntroVideoUrl(url);
    setIsIntroFinished(false); // Reset to show the new video next time
  };

  const handleIntroFinish = () => {
    setIsIntroFinished(true);
  };
  
  const handleSetFeaturedMovie = (id: number | null) => {
    setFeaturedMovieId(id);
  };

  if (introVideoUrl && !isIntroFinished) {
    return <IntroVideo videoSrc={introVideoUrl} onFinish={handleIntroFinish} />;
  }


  return (
    <>
      <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <header className="w-full max-w-5xl text-center mb-8 relative">
          {headerImageUrl && appMode === 'content' ? (
            <div className="my-4">
              <img src={headerImageUrl} alt="Movie World AI Header" className="w-full h-auto object-contain max-h-40" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-4 mb-2">
                <MovieIcon className="w-12 h-12 text-indigo-400" />
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 text-transparent bg-clip-text">
                  {appMode === 'content' ? mainTitle : 'User Link Manager'}
                </h1>
              </div>
              <p className="text-slate-400 text-lg">
                {appMode === 'content' ? subtitle : 'จัดการข้อมูลลิงก์ของผู้ใช้'}
              </p>
            </>
          )}
          <div 
            onClick={handleSecretTap} 
            className="absolute top-0 right-0 w-20 h-20 -m-4 cursor-default"
            aria-label="Secret admin panel trigger"
          />
        </header>

        <main className="w-full max-w-5xl flex-grow">
          {appMode === 'content' ? (
            <HomeView 
              movies={movies} 
              onSelectMovie={handleSelectMovie}
              announcement={announcement}
              featuredMovieId={featuredMovieId}
            />
          ) : (
            <UserLinkManagerView />
          )}
        </main>
        
        <footer className="w-full max-w-5xl text-center mt-12 text-slate-500 text-sm">
          <p>สงวนลิขสิทธิ์ © {new Date().getFullYear()} {mainTitle}. All Rights Reserved.</p>
        </footer>
      </div>

      {selectedMovie && (
        <DetailView movie={selectedMovie} onBack={handleCloseDetail} />
      )}
      
      {isLoginModalOpen && (
        <AdminLogin onSuccess={handleLoginSuccess} onClose={handleLoginClose} />
      )}

      {isAdminPanelOpen && (
        <AdminPanel
          movies={movies}
          announcement={announcement}
          introVideoUrl={introVideoUrl}
          featuredMovieId={featuredMovieId}
          isFabEnabled={isFabEnabled}
          fabIcon={fabIcon}
          mainTitle={mainTitle}
          subtitle={subtitle}
          headerImageUrl={headerImageUrl}
          appMode={appMode}
          redirectUrl={redirectUrl}
          maintenanceImageUrl={maintenanceImageUrl}
          onUpdateMovie={handleUpdateMovie}
          onAddNewMovie={handleAddNewMovie}
          onRemoveMovie={handleRemoveMovie}
          onSetAnnouncement={setAnnouncement}
          onUpdateIntroVideo={handleUpdateIntroVideo}
          onSetFeaturedMovie={handleSetFeaturedMovie}
          onSetIsFabEnabled={setIsFabEnabled}
          onSetFabIcon={setFabIcon}
          onSetMainTitle={setMainTitle}
          onSetSubtitle={setSubtitle}
          onSetHeaderImageUrl={setHeaderImageUrl}
          onSetAppMode={handleSetAppMode}
          onSetRedirectUrl={handleSetRedirectUrl}
          onSetMaintenanceImageUrl={handleSetMaintenanceImageUrl}
          onClose={handleCloseAdminPanel}
        />
      )}
      
      {!isAnyModalOpen && isFabEnabled && appMode === 'content' && (
        <FloatingActionButton icon={fabIcon} onClick={() => {}} disabled={true} />
      )}
    </>
  );
};

export default App;
