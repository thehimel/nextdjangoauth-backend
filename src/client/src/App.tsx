import {useTheme} from "next-themes";
import {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {useAppSelector} from "./store/hooks.ts";
import Footer from "@/components/Navigation/Footer.tsx";
import NavigationBar from "@/components/Navigation/NavigationBar.tsx";

const App = () => {
  const darkMode = useAppSelector((state) => state.base.darkMode);
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setTheme]);

  return (
    <div className="min-h-screen">
      <NavigationBar/>
      <main className="mb-14">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
};

export default App;
