import { Card, CardContent } from "@/components/ui/card";
import { FaQuoteLeft } from "react-icons/fa";

const testimonies = [
  {
    content: "God answered my prayer for healing. I am forever grateful to The Lord's Hour Ministry.",
    name: "Anonymous",
  },
  {
    content: "Through the teachings, I have grown spiritually and now live a life of excellence.",
    name: "Bro. John",
  },
  {
    content: "The prayer meetings transformed my family. Praise God!",
    name: "Sis. Grace",
  },
];

export function TestimoniesPreview() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl mb-8 text-primary">
          What God Has Done
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonies.map((testimony, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 relative">
                <FaQuoteLeft className="text-accent text-2xl mb-2" />
                <p className="text-gray-700 italic">{testimony.content}</p>
                <p className="text-sm text-gray-500 mt-4">— {testimony.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}