import Link from "next/link";
import { 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaTwitter, 
  FaMapPin, 
  FaPhone, 
  FaEnvelope 
} from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-midnight text-white">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-heading text-xl font-bold mb-4">
            THE LORD&apos;S <span className="text-accent">HOUR</span> MINISTRIES
            <span className="block text-sm font-normal text-gray-300">
              Liberation Centre
            </span>
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            A people prepared for His coming. Liberating mankind from the prison house of darkness into the marvelous light of Christ (Isaiah 42:6-7).
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link href="/events" className="hover:text-accent transition-colors">Events</Link></li>
            <li><Link href="/media/sermons" className="hover:text-accent transition-colors">Sermons</Link></li>
            <li><Link href="/branches" className="hover:text-accent transition-colors">Branches</Link></li>
            <li><Link href="/give" className="hover:text-accent transition-colors">Give</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FaPhone size={16} className="text-accent shrink-0 mt-0.5" />
              <span>+234 708 507 3850 (Nigeria)</span>
            </li>
            <li className="flex items-start gap-2">
              <FaEnvelope size={16} className="text-accent shrink-0 mt-0.5" />
              <span>Thelordshourministriesinc@gmail.com</span>
            </li>
            <li className="flex items-start gap-2">
              <FaMapPin size={16} className="text-accent shrink-0 mt-0.5" />
              <span>Boundary Street, Off Egba Road, Benin City, Edo State, Nigeria</span>
            </li>
            <li className="flex items-start gap-2">
              <FaMapPin size={16} className="text-accent shrink-0 mt-0.5" />
              <span>Via Cappi 26 Castelleone 26012 (C.R), Italy</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-accent transition-colors"><FaFacebook size={24} /></Link>
            <Link href="#" className="hover:text-accent transition-colors"><FaInstagram size={24} /></Link>
            <Link href="#" className="hover:text-accent transition-colors"><FaYoutube size={24} /></Link>
            <Link href="#" className="hover:text-accent transition-colors"><FaTwitter size={24} /></Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700/50 py-4 text-center text-sm text-gray-400">
        &copy; {currentYear} The Lord&apos;s Hour Ministries. All rights reserved.
      </div>
    </footer>
  );
}