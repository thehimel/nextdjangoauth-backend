import {useTranslation} from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="p-2">
      <div className="flex flex-wrap gap-2 justify-center">
        <p>{t('common.welcome')}</p>
      </div>
    </div>
  );
};

export default Home;
