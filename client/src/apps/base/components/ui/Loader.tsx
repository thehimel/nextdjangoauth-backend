import 'ldrs/quantum'
import {useAppSelector} from "@/core/store/hooks.ts";


const Loader = () => {
  const darkMode = useAppSelector((state) => state.base.darkMode);
  const color = darkMode ? 'white' : 'black';

  return (
    <div className="flex items-center justify-center min-h-screen -mt-36">
      <l-quantum size="146" speed="1.8" color={color}></l-quantum>
    </div>
  );
}

export default Loader;
