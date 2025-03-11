const Footer = () => {
  return (
    <footer className="border py-10 w-screen mt-[-1.5rem] rounded-t-[50px] -ml-[50vw] -mr-[50vw] left-1/2 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-start">
        <div className="w-full md:w-1/3 mb-8 md:mb-0 text-center">
          <p className="text-base md:text-lg lg:text-xl">
            tensor Boy &apos; website{" "}
            <a
              href="https://jaipur.manipal.edu/"
              className="text-white hover:text-amber-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              #
            </a>{" "}
            and{" "}
            <a
              href="https://www.geekroom.in/"
              className="text-white hover:text-amber-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              #Website
            </a>
            , ##
          </p>
        </div>

        <div className="w-full md:w-1/3 mb-8 md:mb-0 text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 border-b-2inline-block">
            Useful Links
          </h3>
          <ul className="list-none space-y-3">
            <li>
              <a
                href="https://linktr.ee/geekroom"
                className="text-base md:text-lg lg:text-xl transition-colors duration-200 ease-in-out text-[#210F09]hover:text-pink-400"
              >
                Useful Link 1
              </a>
            </li>
            <li>
              <a
                href="https://codemanipal.devfolio.co/"
                className="text-base md:text-lg lg:text-xl transition-colors duration-200 ease-in-out  hover:text-pink-400"
              >
                Useful Link 2
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/3 text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 border-b-2 border-pink-500 inline-block">
            ###
          </h3>
          <address className="not-italic text-sm md:text-base lg:text-lg">
            #
            <br />
            #
            <br />#
          </address>
          <div className="flex justify-center mt-4 space-x-6">
            <a href="mailto:community@geekroom.in" aria-label="Email">
              <span className="flex items-center justify-center p-3 transition duration-200 ease-in-out transform hover:scale-110 hover:text-pink-400">
                <i
                  className="fa-solid fa-envelope"
                  style={{
                    color: "rgb(255, 166, 169)",
                    opacity: 0.9,
                    fontSize: "1.5rem",
                  }}
                ></i>
              </span>
            </a>
            <a
              href="https://x.com/geek__room_"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center justify-center p-3 transition duration-200 ease-in-out transform hover:scale-110 hover:text-pink-400">
                <i
                  className="fa-brands fa-x-twitter"
                  style={{
                    color: "rgb(255, 166, 169)",
                    opacity: 0.9,
                    fontSize: "1.5rem",
                  }}
                ></i>
              </span>
            </a>
            <a
              href="https://www.instagram.com/_geek.room/"
              aria-label="Instagram"
            >
              <span className="flex items-center justify-center p-3 transition duration-200 ease-in-out transform hover:scale-110 hover:text-pink-400">
                <i
                  className="fa-brands fa-instagram"
                  style={{
                    color: "rgb(255, 166, 169)",
                    opacity: 0.9,
                    fontSize: "1.5rem",
                  }}
                ></i>
              </span>
            </a>
            <a
              href="https://www.linkedin.com/company/code-kshetra/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center justify-center p-3 transition duration-200 ease-in-out transform hover:scale-110 hover:text-pink-400">
                <i
                  className="fa-brands fa-linkedin-in"
                  style={{
                    color: "rgb(255, 166, 169)",
                    opacity: 0.9,
                    fontSize: "1.5rem",
                  }}
                ></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
