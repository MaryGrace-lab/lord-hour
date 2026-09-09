import { Card, CardContent } from "@/components/ui/card";
import { FaEye, FaBullseye, FaBookOpen } from "react-icons/fa";

export function VisionMission() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <FaEye className="text-primary mx-auto mb-3 text-4xl" />
              <h3 className="font-heading text-2xl mb-2">Our Vision</h3>
              <p className="text-gray-700">
                To liberate mankind from the prison house of darkness into the marvelous light of Christ (Isaiah 42:6–7).
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <FaBullseye className="text-primary mx-auto mb-3 text-4xl" />
              <h3 className="font-heading text-2xl mb-2">Our Mission</h3>
              <p className="text-gray-700">
                To use the Word to raise men who will live exemplary lives full of excellence.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <FaBookOpen className="text-primary mx-auto mb-3 text-4xl" />
              <h3 className="font-heading text-2xl mb-2">What We Believe</h3>
              <p className="text-gray-700">
                We believe in the full gospel of Jesus Christ, the power of prayer, and the authority of God&apos;s Word.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}