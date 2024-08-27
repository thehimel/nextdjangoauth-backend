import NavBar from "@/components/navigation/navbar/NavBar.tsx";
import useClearSessionToken from "@/hooks/clearSessionTokenOnLoad.ts";
import {quantum} from "ldrs";
import {useTheme} from "next-themes";
import {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {Toaster} from "sonner";
import {useAppSelector} from "./store/hooks.ts";
import Footer from "@/components/navigation/Footer.tsx";

const App = () => {
  const darkMode = useAppSelector((state) => state.base.darkMode);
  const { setTheme } = useTheme();
  const theme = darkMode ? 'dark' : 'light';

  const clearSessionToken = useClearSessionToken();

  useEffect(() => {
    setTheme(theme);
    quantum.register(); // Register quantum once when App mounts
    clearSessionToken().then(null);
  }, [darkMode, setTheme, theme, clearSessionToken]);

  return (
    <div className={`min-h-screen ${theme} text-foreground bg-background`}>
      <NavBar/>
      <Toaster position="top-center" expand={true} theme={darkMode ? "dark" : "light"} />
      <main className="mb-14 p-8 flex items-start justify-center">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
};

export default App;
