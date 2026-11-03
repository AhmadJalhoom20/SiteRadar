import Link from "next/link";
import { Check, ArrowRight, Info } from "@phosphor-icons/react/dist/ssr";
import { PublicHeader, PublicFooter } from "@/components/public-shell";
import {publicMetadata} from '@/lib/seo';
import {currentUser} from '@/server/auth';
export const metadata = publicMetadata('Pricing | SiteRadar','Free includes unlimited projects, audits and saved reports. Basic, Pro and Max are coming soon. No payment is collected.','/pricing');
export default async function Pricing() {
  const user=await currentUser();
  return (
    <div className="public-site">
      <PublicHeader active="pricing" />
      <main className="public-container pricing-page">
        <div className="public-page-title">
          <h1>
            A clearer view.
            <br />
            No limits on getting started.
          </h1>
          <p>Free is unlimited. Basic, Pro, and Max are still being built.</p>
        </div>
        <div className="pricing-grid">
          {["Free", "Basic", "Pro", "Max"].map((name, i) => (
            <article
              className={`price-plan ${i === 0 ? "available-plan" : ""}`}
              key={name}
            >
              <div className="plan-heading">
                <h2>{name}</h2>
                <span className="small-chip">
                  {i === 0 ? "AVAILABLE NOW" : "COMING SOON"}
                </span>
              </div>
              <div className="plan-price">
                {i === 0 ? (
                  <>
                    <strong>$0</strong>
                    <span>/ no subscription</span>
                  </>
                ) : (
                  <strong>Coming soon</strong>
                )}
              </div>
              <p>
                {i === 0
                  ? "Everything available today, with unlimited usage."
                  : "Details and pricing will be announced when this plan launches."}
              </p>
              {i === 0 ? (
                <Link className="btn primary full" href={user?'/app':'/sign-up'}>
                  {user?'Open your Free workspace':'Start with Free'}
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <button disabled className="btn full">
                  Coming soon
                </button>
              )}
              <ul>
                {(i === 0
                  ? [
                      "Unlimited projects",
                      "Unlimited audits and history",
                      "Unlimited saved keywords",
                      "Lighthouse performance checks",
                      "SEO & accessibility findings",
                      "CSV, JSON, and repair prompts",
                      "No credit card required",
                    ]
                  : [
                      "Not available for purchase",
                      "No payment collected",
                      "Free remains available",
                    ]
                ).map((f) => (
                  <li key={f}>
                    <Check size={16} />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="pricing-note">
          <Info size={21} />
          <p>
            <strong>No hidden upgrade gate.</strong> Free has no plan quotas.
            Individual crawls use configurable time and resource safeguards.
            External search-data providers may charge separately; connecting one
            is optional.
          </p>
        </div>
        <div className="pricing-faq">
          <h2>A few things to know.</h2>
          <article>
            <h3>How long will Free stay unlimited?</h3>
            <p>
              Free is unlimited until the product owner explicitly changes the
              policy. There are no paid upgrades to buy today.
            </p>
          </article>
          <article>
            <h3>Do I need a search-provider account?</h3>
            <p>
              Only for live keyword positions and search competitors. Website
              audits, performance, accessibility, exports, and repair prompts
              work without it.
            </p>
          </article>
          <article>
            <h3>Can I audit my site again?</h3>
            <p>
              Yes. Open the saved project and choose Run again. Your URL,
              market, device, and keywords are remembered.
            </p>
          </article>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
