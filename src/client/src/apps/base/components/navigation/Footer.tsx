const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="absolute bottom-0 w-full border-t py-4 dark:bg-background">
      <div className="container mx-auto flex justify-center">
        <p>Client &copy; {year}</p>
      </div>
    </footer>
  );
};

export default Footer;
