import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioPlayerProvider, useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { useTimeTheme } from "@/hooks/use-time-theme";
import { PlayerBar } from "@/components/PlayerBar";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ChannelPage from "./pages/ChannelPage.tsx";
import About from "./pages/About.tsx";
import News from "./pages/News.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import Channels from "./pages/Channels.tsx";
import Originals from "./pages/Originals.tsx";
import Survey from "./pages/Survey.tsx";
import SurveyConfirmation from "./pages/SurveyConfirmation.tsx";

const queryClient = new QueryClient();

import { usePreviousPathTracker } from "@/hooks/use-previous-path";
import { GeoBlockProvider } from "@/contexts/GeoBlockContext";

function GlobalPlayerBar() {
  const { currentChannel, isPlaying, volume, togglePlayPause, stop, changeVolume } = useAudioPlayerContext();
  return (
    <PlayerBar
      channel={currentChannel}
      isPlaying={isPlaying}
      volume={volume}
      onTogglePlayPause={togglePlayPause}
      onStop={stop}
      onVolumeChange={changeVolume}
    />
  );
}

function RouteTracker() {
  usePreviousPathTracker();
  return null;
}

const App = () => {
  useTimeTheme();
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AudioPlayerProvider>
        <BrowserRouter>
          <RouteTracker />
          <GeoBlockProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/channel/:id" element={<ChannelPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/news" element={<News />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/originals" element={<Originals />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/survey/thanks" element={<SurveyConfirmation />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <GlobalPlayerBar />
          </GeoBlockProvider>
        </BrowserRouter>
      </AudioPlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
