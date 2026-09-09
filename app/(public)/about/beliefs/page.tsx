import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Believe | The Lord's Hour Ministries",
  description:
    "Our core beliefs at The Lord's Hour Ministries, rooted in the Word of God.",
};

export default function BeliefsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          What We Believe
        </h1>
      </header>

      {/* Beliefs Content */}
      <div className="space-y-8">
        <section>
          <h2 className="font-heading text-2xl font-semibold text-accent mb-2">
            The Bible
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We believe the Bible is the inspired, infallible, and authoritative
            Word of God, revealing His will for humanity.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-accent mb-2">
            God
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in one God, eternally existing in three persons: Father,
            Son, and Holy Spirit.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-accent mb-2">
            Jesus Christ
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in the deity of our Lord Jesus Christ, His virgin birth,
            His sinless life, His miracles, His atoning death, His bodily
            resurrection, and His ascension to the right hand of the Father.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-accent mb-2">
            Salvation
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We believe that salvation is by grace through faith in Jesus Christ,
            not by works, and that all who repent and believe are born again.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-accent mb-2">
            The Holy Spirit
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in the present ministry of the Holy Spirit, who indwells
            and empowers believers for holy living and service.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-accent mb-2">
            The Church
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in the spiritual unity of all believers in our Lord Jesus
            Christ and in the importance of the local church for worship,
            fellowship, and discipleship.
          </p>
        </section>
      </div>
    </div>
  );
}