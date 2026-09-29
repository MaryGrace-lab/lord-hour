import { FaEye, FaBullseye, FaBookOpen } from "react-icons/fa";

const cards = [
  {
    Icon: FaEye,
    title: "Our Vision",
    body: "To liberate mankind from the prison house of darkness into the marvelous light of Christ (Isaiah 42:6–7).",
  },
  {
    Icon: FaBullseye,
    title: "Our Mission",
    body: "To use the Word to raise men who will live exemplary lives full of excellence.",
  },
  {
    Icon: FaBookOpen,
    title: "What We Believe",
    body: "We believe in the full gospel of Jesus Christ, the power of prayer, and the authority of God's Word.",
  },
];

export function VisionMission() {
  return (
    <section
      className="py-12 sm:py-16 bg-gray-50"
      aria-labelledby="vision-mission-heading"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2
            id="vision-mission-heading"
            className="font-heading text-3xl md:text-4xl text-primary"
          >
            Vision &amp; Mission
          </h2>
          <div className="w-12 h-px bg-accent mx-auto mt-5" aria-hidden />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
            >
              <Icon
                className="text-primary mx-auto mb-3"
                size={36}
                aria-hidden
              />
              <h3 className="font-heading text-2xl mb-2">{title}</h3>
              <p className="text-gray-700 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}