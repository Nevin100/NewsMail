const About = () => {
  return (
    <div className="p-4 md:p-6 mt-14 min-h-screen">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* About Content Section */}
        <div className="lg:col-span-4 bg-base-200 p-6 md:p-10 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-10 text-center text-primary">
            About NewsMailer 📬
          </h1>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-amber-500">
              Our Mission 🚀
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              <strong>NewsMailer</strong> is your personalized newsletter
              platform that scrapes online news legally and emails you 5
              handpicked stories - daily or weekly. Clean. Smart. Custom.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-amber-500">
              Why NewsMailer? 💡
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              Most newsletters are generic. <strong>NewsMailer</strong> changes
              that. Every user receives{" "}
              <span className="font-bold text-amber-600">
                5 curated news stories{" "}
              </span>
              tailored just for them. Simple, fresh, and spam-free.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-amber-500">
              Meet the Creator 👨‍💻
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src="https://avatars.githubusercontent.com/u/146621784?v=4"
                alt="Nevin Bali"
                className="w-36 h-36 rounded-full shadow"
              />
              <p className="text-xl leading-relaxed text-center sm:text-left">
                Hey! I&apos;m{" "}
                <strong className="text-primary">Nevin Bali</strong>, a
                developer & design enthusiast 👨‍💻.
                <br />
                NewsMailer is a product of my curiosity, caffeine, and code ☕.
              </p>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-2 text-amber-500">
              Let&apos;s Connect 🤝
            </h2>
            <p className="text-md sm:text-lg text-gray-700">
              Reach out via email or check out my GitHub to explore more tools.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <a
                href="mailto:nevinbali10@gmail.com"
                className="px-5 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
              >
                ✉️ Email
              </a>
              <a
                href="https://github.com/Nevin100"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
              >
                🔗 GitHub
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
