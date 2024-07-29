import {useTheme} from "next-themes";
import {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {Toaster} from "sonner";
import {useAppSelector} from "./store/hooks.ts";
import Footer from "@/components/navigation/Footer.tsx";
import NavigationBar from "@/components/navigation/NavigationBar.tsx";

const App = () => {
  const darkMode = useAppSelector((state) => state.base.darkMode);
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setTheme]);

  return (
    <div className="min-h-screen">
      <NavigationBar/>
      <Toaster position="top-center" theme={darkMode ? "dark" : "light"} />
      <main className="mb-14 p-8 flex items-start justify-center">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
};

export default App;
