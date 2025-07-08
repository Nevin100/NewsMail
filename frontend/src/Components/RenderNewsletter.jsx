const RenderNewsletter = ({ html }) => {
  return (
    <iframe
      title="Newsletter Preview"
      className="w-full h-[700px] border rounded-md shadow"
      sandbox=""
      srcDoc={html}
    />
  );
};

export default RenderNewsletter;
