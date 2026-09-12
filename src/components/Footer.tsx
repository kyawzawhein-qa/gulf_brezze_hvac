import Image from "next/image";

type Props = {
  brandName?: string;
  footerBlurb?: string;
  phone?: string;
  phoneHref?: string;
  logoMarkPath?: string;
};

export default function Footer({
  brandName = "Gulf Breeze HVAC",
  footerBlurb = "Sample contractor site · Fort Myers, Cape Coral, Bonita Springs, Lehigh Acres, Estero",
  phone = "(239) 555-0147",
  phoneHref = "tel:+12395550147",
  logoMarkPath = "/brand/logo-mark.svg",
}: Props) {
  return (
    <footer className="border-t border-slate-200 bg-white py-10" role="contentinfo">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <Image
            src={logoMarkPath}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0"
          />
          <div>
            <p className="font-bold text-gb-navy">{brandName}</p>
            <p className="mt-1 text-sm text-gb-muted">{footerBlurb}</p>
          </div>
        </div>
        <div className="text-sm text-gb-muted">
          <p>
            Demo phone:{" "}
            <a href={phoneHref} className="focus-ring rounded font-medium text-gb-teal hover:underline">
              {phone}
            </a>
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} {brandName} (Sample). Not a live business.
          </p>
        </div>
      </div>
    </footer>
  );
}
