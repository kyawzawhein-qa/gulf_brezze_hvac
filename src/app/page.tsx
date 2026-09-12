import ChatWidget from "@/components/ChatWidget";
import DemoBadge from "@/components/DemoBadge";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Scrollytelling from "@/components/Scrollytelling";
import Services from "@/components/Services";
import Trust from "@/components/Trust";
import { getSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <DemoBadge text={content.settings.demoBadgeText} />
      <Header
        brandName={content.settings.brandName}
        tagline={content.settings.tagline}
        phone={content.settings.phone}
        phoneHref={content.settings.phoneHref}
        logoMarkWhitePath={content.settings.logoMarkWhitePath}
        logoWordmarkWhitePath={content.settings.logoWordmarkWhitePath}
      />
      <main>
        <Scrollytelling captions={content.captions.map((c) => ({ at: c.at, text: c.text }))} />
        <Hero
          eyebrow={content.hero.eyebrow}
          headline={content.hero.headline}
          subhead={content.hero.subhead}
          primaryCta={content.hero.primaryCta}
          secondaryCta={content.hero.secondaryCta}
          stats={content.heroStats}
        />
        <Services
          section={content.servicesSection}
          services={content.services}
          cities={content.settings.serviceCities}
        />
        <HowItWorks section={content.howSection} steps={content.howSteps} />
        <Trust
          section={content.trustSection}
          reviews={content.reviews}
          stats={content.trustStats}
        />
        <FinalCTA
          phone={content.settings.phone}
          phoneHref={content.settings.phoneHref}
          eyebrow={content.finalCta.eyebrow}
          heading={content.finalCta.heading}
          body={content.finalCta.body}
          primaryBtn={content.finalCta.primaryBtn}
          secondaryBtn={content.finalCta.secondaryBtn}
          tertiaryBtn={content.finalCta.tertiaryBtn}
          footnote={content.finalCta.footnote}
        />
      </main>
      <Footer
        brandName={content.settings.brandName}
        footerBlurb={content.settings.footerBlurb}
        phone={content.settings.phone}
        phoneHref={content.settings.phoneHref}
        logoMarkPath={content.settings.logoMarkPath}
      />
      <ChatWidget
        welcomeText={content.chat.welcomeText}
        validZips={content.chat.validZips}
        issues={content.chat.issues}
        slots={content.chat.slots}
        launcherLabel={content.chat.launcherLabel}
        avatarPath={content.settings.chatAvatarPath}
      />
    </>
  );
}
