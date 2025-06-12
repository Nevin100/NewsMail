const Footer = () => {
  return (
    <footer className="border py-10 w-screen mt-[1rem] rounded-t-[50px] -ml-[50vw] -mr-[50vw] left-1/2 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-start">
        <div className="w-full  mb-8 md:mb-0 text-center">
          <p className="text-base md:text-lg lg:text-xl">
            News Mail @CopyRights Reserved 2025
          </p>
        </div>

        {/* <div className="w-full md:w-1/2 mb-8 md:mb-0 text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 border-b-2 inline-block">
            Media Platforms
          </h3>
          <ul className="list-none space-y-3">
            <li>
              <a
                href="#"
                className="text-base md:text-lg lg:text-xl transition-colors duration-200 ease-in-out text-[#210F09]hover:text-pink-400"
              >
                <FaXTwitter />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base md:text-lg lg:text-xl transition-colors duration-200 ease-in-out  hover:text-pink-400"
              >
                <FaInstagramSquare />
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
