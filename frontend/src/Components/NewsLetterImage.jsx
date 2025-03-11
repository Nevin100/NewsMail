const NewsLetterImage = ({ title }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-2">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
      </div>
    </div>
  );
};

export default NewsLetterImage;
