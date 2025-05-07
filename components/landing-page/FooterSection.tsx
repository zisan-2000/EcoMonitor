// components/landing-page/FooterSection.tsx
import Link from "next/link";
import { SectionWrapper } from "./SectionWrapper";

const footerLinks = [
  {
    title: "Features",
    links: [
      { label: "Weather Monitoring", href: "#" },
      { label: "Water Quality", href: "#" },
      { label: "Data Analytics", href: "#" },
      { label: "Reporting", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API", href: "#" },
      { label: "Support", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export const FooterSection = () => {
  return (
    <SectionWrapper
      id="contact"
      bgColor="bg-gray-900"
      waveColor="#111827"
      waveFlip={false}
    >
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">EcoMonitor</h3>
          <p className="text-gray-300 text-sm">
            Professional environmental monitoring dashboard for weather and
            water quality data.
          </p>
        </div>

        {footerLinks.map((section) => (
          <div key={section.title}>
            <h4 className="text-white font-bold mb-4">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
        &copy; {new Date().getFullYear()} EcoMonitor. All rights reserved.
      </div>
    </SectionWrapper>
  );
};
