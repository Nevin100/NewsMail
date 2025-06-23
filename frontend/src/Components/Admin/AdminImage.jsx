const AdminImage = ({ title }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-2">
      <div className="max-w-md text-center">
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Row 1 */}
          <div className="flex gap-4">
            <div className="w-25 h-25 rounded-2xl bg-primary/10 animate-pulse" />
          </div>

          {/* Row 2 */}
          <div className="flex gap-4">
            <div className="w-27 h-27 rounded-2xl bg-primary/10" />
            <div className="w-27 h-27 rounded-2xl bg-primary/10 animate-pulse" />
          </div>

          {/* Row 3 */}
          <div className="flex gap-4">
            <div className="w-30 h-30 rounded-2xl bg-primary/10 animate-pulse" />
            <div className="w-30 h-30 rounded-2xl bg-primary/10" />
            <div className="w-30 h-30 rounded-2xl bg-primary/10 animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
      </div>
    </div>
  );
};

export default AdminImage;
