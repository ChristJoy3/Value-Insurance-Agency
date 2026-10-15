/**
 * All agency content, migrated from the legacy site
 * https://www.businessinsurancewashingtondc.com (scraped October 2026,
 * raw capture in scripts/scraped.json).
 *
 * Editing rules: text is verbatim except for light typo/readability fixes
 * (each listed in TYPO_FIXES at the bottom). Never add claims, stats, prices,
 * testimonials or carriers here. Missing facts use [PLACEHOLDER] strings.
 */

export { glossary, glossaryNotice, type GlossaryEntry } from "./glossary";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** A run of body copy. Links are rendered inline after the text. */
export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string; link?: { label: string; href: string } }
  /** `term` is the bold lead-in some legacy list items had, e.g. "Fee-for-Service". */
  | { type: "list"; items: { term?: string; text: string }[] }
  | { type: "footnote"; text: string; link?: { label: string; href: string } };

export type Coverage = {
  slug: string;
  /** Display number in the coverage index, "01"–"16" */
  number: string;
  /** Short name used in the index, nav and footer (matches the legacy footer) */
  name: string;
  /** H1 from the legacy page */
  title: string;
  /** One-line summary for index hover / cards — taken from the page's own copy */
  summary: string;
  /** Migrated body copy */
  body: Block[];
  /** Exact phrases inside `body` that get the "review highlight" sweep */
  highlights: string[];
  /** Legacy closing call-to-action line, if the page had one */
  callLine?: string;
  /** Slugs of related coverage lines */
  related: string[];
  /** Legacy URLs that should redirect to this page */
  legacyPaths: string[];
  seo: { title: string; description: string };
};

export type ResumeEntry = {
  /** e.g. "1984 – present"; omitted where the résumé gives no dates */
  period?: string;
  organization: string;
  text: string;
};

export type Carrier = {
  name: string;
  /** Path under /public, e.g. "/images/carriers/travelers.png" */
  logo: string;
  width: number;
  height: number;
};

/* ------------------------------------------------------------------ */
/* Agency                                                              */
/* ------------------------------------------------------------------ */

export const agency = {
  name: "Value Insurance Agency Inc.",
  shortName: "Value Insurance Agency",
  legacyTagline: "Washington, DC Business Insurance",
  siteUrl: "https://www.businessinsurancewashingtondc.com",
  address: {
    street: "1725 I Street NW",
    city: "Washington",
    region: "DC",
    postalCode: "20006",
    country: "US",
  },
  phone: {
    display: "202-999-2131",
    href: "tel:2029992131",
    e164: "+12029992131",
  },
  /** Online quote form (insurezone, via bit.ly) — must stay working */
  quoteUrl: "https://bit.ly/3TUNnZI",
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=1725+I+Street+NW,+Washington,+DC+20006",
  /** Not published on the legacy site — waiting on the client */
  email: "[EMAIL]",
  hours: "[HOURS]",
  /** States the agency is licensed to serve (About page). Note: the résumé says "Virginia and Washington DC". */
  licensedIn: ["Washington, DC", "Maryland", "Virginia"],
  licensedInShort: ["DC", "MD", "VA"],
  founder: "Arthur Lander",
} as const;

/** True once the client has supplied a real email address. */
export const hasEmail = !agency.email.startsWith("[");

export const socials = [
  // Facebook blocks automated checks; kept pending client confirmation.
  { name: "Facebook", href: "https://www.facebook.com/ValueInsurance", active: true },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/value-insurance-agency-inc-", active: true },
  // Profile exists (115 pins) but has 0 followers — treated as inactive until the client says otherwise.
  { name: "Pinterest", href: "https://www.pinterest.com/ValueIns/", active: false },
] as const;

/* ------------------------------------------------------------------ */
/* Home + About (legacy "/" and "/about/")                             */
/* ------------------------------------------------------------------ */

export const home = {
  eyebrow: "Looking for Property and Casualty Insurance?",
  heroStatement: "Protect the business that you have worked long and hard to grow.",
  intro:
    "Carrying the right amount of coverage is essential to protecting your business. We want to help you find the right coverage that will fit you and your business. Quickly and easily submit your application for a free insurance quote through our easy to use website.",
  suite:
    "As a customer, you will enjoy our suite of options that cover a variety of business insurance types to suit your unique, individual needs.",
  independent:
    "We are an independent agency with the customer in mind. We have relationships with many insurance companies, allowing you to get the right service at a great value. Whether you have the ideal history, preferred companies desire, or a not so perfect history, we find the right coverage, with the best company, at the best price for you.",
  personalTouch:
    "As an independent insurance agent we can offer the right coverages with the personal touch you would expect from your neighborhood insurance agent.",
  /** Legacy meta description */
  quote24h: "Our convenient website allows you to request insurance quotes twenty-four hours a day.",
};

export const about = {
  intro: {
    heading: "Looking for Property and Casualty Insurance? Let Value Insurance Agency Inc. be your guide.",
    text: "Every business has different needs when purchasing insurance. Whether your business is new or established, Value Insurance Agency Inc. can help your business navigate through the maze of options and ensure you get the insurance that is right for you at the right price. Value Insurance Agency Inc. is licensed to serve clients in Washington, DC, Maryland, and Virginia.",
  },
  whyIndependent: {
    heading: "Why use an independent insurance agency?",
    text: "Independent Insurance Agencies and their Agents represent multiple insurance companies and research their partners in order to find you the best combination of price and coverage, as well as determine which type of insurance is best suited for you. Whereas captive agents can sell you the insurance of only one company, an independent agent can make sure you get the most affordable and appropriate coverage. Independent Insurance Agencies and their Agents give you choice!",
  },
  whatIsIndependent: {
    heading: "What is an Independent Insurance Agency?",
    paragraphs: [
      "Independent Insurance Agencies and their Agents represent multiple insurance companies and research their carriers in order to find you the best combination of price and coverage, as well as determine which type of insurance is best suited for you.",
      "Agents representing one insurance company (also called captive agents) can only offer policies that are offered by that company. Choosing an independent insurance agency can ensure you get the most affordable and appropriate coverage from a variety of sources.",
    ],
  },
  welcome: {
    heading: "We welcome new and existing policyholders!",
    text: "For new policyholders, our professional staff will analyze your needs and will suggest policies that meet your requirements and budget. We can also review your existing policies to ensure you are getting the right insurance for the best value.",
  },
  agency: {
    heading: "About Value Insurance Agency Inc.",
    text: "Value Insurance Agency Inc. was developed by Arthur Lander to address the concerns of his clients about their insurance needs. Arthur Lander, the president of Value Insurance Agency Inc., has over 30 years experience as a Certified Public Accountant and a practicing lawyer since 1989, as well as experience in business brokerage. Arthur Lander has the experience and training to serve your business in its insurance needs.",
  },
};

/** "Who we help" cards — wording drawn only from the home + about copy above. */
export const whoWeHelp = {
  quote: "Whether you have the ideal history, preferred companies desire, or a not so perfect history…",
  cards: [
    {
      label: "New businesses",
      text: "Whether your business is new or established, we can help your business navigate through the maze of options and ensure you get the insurance that is right for you at the right price.",
    },
    {
      label: "Established businesses",
      text: "Every business has different needs when purchasing insurance. Our professional staff will analyze your needs and will suggest policies that meet your requirements and budget.",
    },
    {
      label: "Existing policyholders",
      text: "We can also review your existing policies to ensure you are getting the right insurance for the best value.",
    },
  ],
};

/** "How it works" — generic, accurate restatement of the about copy. No timelines or promises. */
export const howItWorks = [
  { title: "Tell us about your business", text: "Request a quote online any time, or call 202-999-2131." },
  { title: "We analyze your needs", text: "Our staff will analyze your needs, or review the policies you already have." },
  { title: "We compare carriers", text: "As an independent agency, we research multiple insurance companies for the best combination of price and coverage." },
  { title: "You choose the right coverage", text: "Policies that meet your requirements and budget — the right coverage at the right price." },
];

/* ------------------------------------------------------------------ */
/* Arthur Lander (legacy /content/artres.aspx)                         */
/* ------------------------------------------------------------------ */

export const arthur = {
  name: "Arthur Lander",
  nickname: "Art",
  role: "Founder & President",
  credentials: "C.P.A., Attorney",
  /** CPA certification (résumé: "certified to practice … in October of 1981") */
  cpaSince: { year: 1981, month: 10 },
  /** Bar admission (résumé: "admitted to the Virginia Bar in April 1989") */
  lawSince: { year: 1989, month: 4 },
  experience: [
    {
      organization: "Value Insurance Agency Inc.",
      text: "Sole shareholder and President. Licensed in Virginia and Washington DC.",
    },
    {
      organization: "Value Business Brokerage, Inc.",
      text: "Sole shareholder and President. Representing clients in listing businesses for sale, valuation, and finding business to acquire for clients.",
    },
    {
      // Legacy text reads "Business Legal Services Services Inc." — duplicated word removed (confirm with client).
      organization: "Business Legal Services Inc. Law Firm",
      text: "My work is specific to the areas of formation of businesses, contracts, bankruptcy, tax law, mechanics liens, leases, collections, and sales and purchases of businesses.",
    },
    {
      period: "1984 – present",
      organization: "Arthur Lander, C.P.A., P.C.",
      text: "My practice consists mainly of preparing tax returns and financial statements for business clients and individual tax returns.",
    },
    {
      period: "1980 – 1984",
      organization: "Reznick Fedder and Silverman",
      text: "My accounting work concentrated on real estate development and construction. I did a lot of work in government subsidized housing projects, real estate limited partnerships, and accounting for real estate developers and contractors.",
    },
    {
      period: "1979 – 1980",
      organization: "Harab Kamerow and Associates",
      text: "I worked at an introductory level. I prepared bank reconciliations, payroll reports, and financial statements. The clients were doctors, lawyers, and general business clients.",
    },
  ] satisfies ResumeEntry[],
  licensing:
    "I am licensed as a CPA in Virginia, the District of Columbia, and Maryland. I passed the CPA exam in May, 1979 and was certified to practice after meeting Virginia's two year experience requirement in October of 1981.",
  expertWitness:
    "I have served as an expert witness regarding a corporate fraud case and a pension case in Arlington County Circuit Court, an estate asset valuation case in Madison County Circuit Court, and a U.S. Bankruptcy case regarding taxation.",
  education:
    "I graduated from George Mason School of Law in December 1988. I was admitted to the Virginia Bar in April 1989 and waived into the District of Columbia.",
  memberships: "I am a member of the Alexandria and Arlington Bar Associations.",
  community: "I help as a volunteer counselor at Arlington Economic Development.",
  photo: "[PHOTO: Art Lander portrait]",
};

/* ------------------------------------------------------------------ */
/* Coverage lines (16) — legacy footer order                           */
/* ------------------------------------------------------------------ */

const call = (what: string) => `Call us today at (202) 999-2131 for your ${what} needs.`;

/** Shared legacy copy: the Business page reprints the Auto, GL and WC sections. */
const COMMERCIAL_AUTO: Block[] = [
  {
    type: "paragraph",
    text: 'As a business owner, you need the same kinds of insurance coverages for the car you use in your business as you do for a car used for personal travel -- liability, collision and comprehensive, medical payments (known as personal injury protection in some states) and coverage for uninsured motorists. In fact, many business people use the same vehicle for both business and pleasure. If the vehicle is owned by the business, make sure the name of the business appears on the policy as the "principal insured" rather than your name. This will avoid possible confusion in the event that you need to file a claim or a claim is filed against you.',
  },
  {
    type: "paragraph",
    text: "Whether you need to buy a business auto insurance policy will depend on the kind of driving you do. A good insurance agent will ask you many details about how you use vehicles in your business, who will be driving them and whether employees, if you have them, are likely to be driving their own cars for your business.",
  },
  {
    type: "paragraph",
    text: "While the major coverages are the same, a business auto policy differs from a personal auto policy in many technical respects. Ask your insurance agent to explain all the differences and options.",
  },
];

const GL_INTRO: Block[] = [
  {
    type: "paragraph",
    text: "If you have a personal umbrella liability policy, there's generally an exclusion for business-related liability. Make sure you have sufficient auto liability coverage.",
  },
  {
    type: "paragraph",
    text: "Unfortunately for every business owner, the chances of getting sued have dramatically increased in the last decade. General Liability insurance can prevent a legal suit from turning into a financial disaster by providing financial protection in case your business is ever sued or held legally responsible for some injury or damage.",
  },
];

const GL_PROTECTION_LIST: Block = {
  type: "list",
  items: [
    { text: "Bodily Injury, including the cost of care, the loss of services, and the restitution for any death that results from injury" },
    { text: "Property Damage coverage for the physical damage to property of others or the loss of use of that property" },
    { text: "Products-Completed Operations provides liability protection (damages and legal expenses up to your policy's limit) if an injury ever resulted from something your company made or service your company provided" },
    { text: "Products Liability is a more specialized product liability insurance that protects your company against lawsuits from product-related injury or accidents" },
    { text: "Contractual Liability extends to any liability you may assume by entering into a variety of contracts" },
    { text: "Other coverage includes: Reasonable Use of Force; Borrowed Equipment; Liquor Liability; Non-Owned Vehicles (such as aircraft and watercraft); Fire, Lightning or Explosion Damage; Water Damage Liability Protection; Legal Defense Costs; Medical Payments; Personal Injury; Advertising Injury; and specialized liability protection for specific business types" },
  ],
};

const WC_INTRO: Block[] = [
  {
    type: "paragraph",
    text: "Workers compensation laws were created to ensure that employees who are injured on the job are provided with fixed monetary awards. This eliminates the need for litigation and creates an easier process for the employee. It also helps control the financial risks for employers since many states limit the amount an injured employee can recover from an employer.",
  },
  {
    type: "paragraph",
    text: "Workers Compensation Insurance is designed to help companies pay these benefits. As a protection for employees, most states require that employers carry some form of Workers Compensation Insurance. Workers Compensation Insurance is not health insurance. Workers Compensation is designed specifically for injuries sustained on the job.",
  },
  {
    type: "paragraph",
    text: "In most states, if you have employees, you are required to carry Workers Compensation coverage. Even in non-mandatory states, it can be a very good idea, particularly if you have many employees, or if they are engaged in hazardous activities.",
  },
];

const WC_NEED: Block[] = [
  { type: "heading", text: "Do I need workers compensation insurance?" },
  {
    type: "paragraph",
    text: "Employers have a legal responsibility to their employees to make the workplace safe. However, accidents happen even when every reasonable safety measure has been taken.",
  },
  {
    type: "paragraph",
    text: "To protect employers from lawsuits resulting from workplace accidents and to provide medical care and compensation for lost income to employees hurt in workplace accidents, in almost every state, businesses are required to buy workers compensation insurance. Workers compensation insurance covers workers injured on the job, whether they're hurt on the workplace premises or elsewhere, or in auto accidents while on business. It also covers work-related illnesses.",
  },
  {
    type: "paragraph",
    text: "Workers compensation provides payments to injured workers, without regard to who was at fault in the accident, for time lost from work and for medical and rehabilitation services. It also provides death benefits to surviving spouses and dependents.",
  },
  {
    type: "paragraph",
    text: "Each state has different laws governing the amount and duration of lost income benefits, the provision of medical and rehabilitation services and how the system is administered. For example, in most states there are regulations that cover whether the worker or employer can choose the doctor who treats the injuries and how disputes about benefits are resolved.",
  },
  {
    type: "paragraph",
    text: "Workers compensation insurance must be bought as a separate policy. Although in-home business and business owners policies (BOPs) are sold as package policies, they don't include coverage for workers' injuries.",
  },
];

export const coverages: Coverage[] = [
  {
    slug: "business-insurance",
    number: "01",
    name: "Business Insurance",
    title: "Business & Commercial Insurance",
    // Strap line from the legacy homepage coverage strip
    summary: "Discover affordable insurance options to meet your specific and unique needs.",
    body: [
      { type: "heading", text: "Commercial Auto" },
      ...COMMERCIAL_AUTO,
      { type: "heading", text: "General Liability" },
      ...GL_INTRO,
      {
        type: "paragraph",
        text: "General Liability pays losses arising from real or alleged bodily injury, property damage, or personal injury on your business premises or arising from your operations.",
      },
      { type: "heading", text: "Broad Range of General Liability Protection" },
      GL_PROTECTION_LIST,
      { type: "heading", text: "Workers Compensation" },
      ...WC_INTRO,
      ...WC_NEED,
    ],
    highlights: [
      "the chances of getting sued have dramatically increased in the last decade",
      "make sure the name of the business appears on the policy",
      "Workers compensation insurance must be bought as a separate policy",
    ],
    related: ["general-liability", "workers-compensation", "commercial-auto", "property-and-building"],
    legacyPaths: ["/business/default.aspx", "/business/", "/category.aspx?id=COMMERCIAL"],
    seo: {
      title: "Business Insurance in Washington, DC",
      description:
        "Business and commercial insurance in Washington, DC, Maryland and Virginia from an independent agency: commercial auto, general liability and workers compensation compared across carriers.",
    },
  },
  {
    slug: "workers-compensation",
    number: "02",
    name: "Workers Compensation",
    title: "Workers Compensation",
    summary: "Get the required coverage for your employees.",
    body: [...WC_INTRO, ...WC_NEED],
    highlights: [
      "Workers Compensation Insurance is not health insurance",
      "without regard to who was at fault",
      "must be bought as a separate policy",
    ],
    related: ["employment-practices-liability", "general-liability", "business-insurance", "health-insurance"],
    legacyPaths: ["/workers_compensation/default.aspx", "/workers_compensation/", "/category.aspx?id=WORKCOMP"],
    seo: {
      title: "Workers Compensation Insurance in DC, MD & VA",
      description:
        "Workers compensation insurance for Washington, DC, Maryland and Virginia employers. An independent agency that compares carriers to find the required coverage for your employees.",
    },
  },
  {
    slug: "general-liability",
    number: "03",
    name: "General Liability",
    title: "General Liability Insurance",
    summary: "Find options to protect your business from risks.",
    body: [
      { type: "heading", text: "What is general liability insurance?" },
      ...GL_INTRO,
      {
        type: "paragraph",
        // NOTE for client: the legacy page names a specific carrier here. Kept verbatim; confirm or remove.
        text: "General Liability pays losses arising from real or alleged bodily injury, property damage, or personal injury on your business premises or arising from your operations. The Hartford's liability programs extend far beyond the provisions of typical policies, with broadened coverage and increased limits in over 30 areas.",
      },
      { type: "heading", text: "Broad Range of General Liability Protection" },
      { type: "paragraph", text: "General Liability Protection can protect you from a variety of risks. Here is an overview:" },
      GL_PROTECTION_LIST,
    ],
    highlights: [
      "prevent a legal suit from turning into a financial disaster",
      "real or alleged bodily injury, property damage, or personal injury",
    ],
    related: ["umbrella-liability", "professional-liability", "business-insurance", "property-and-building"],
    legacyPaths: ["/general_liability/default.aspx", "/general_liability/"],
    seo: {
      title: "General Liability Insurance in DC, Maryland & Virginia",
      description:
        "General liability insurance for businesses in Washington, DC, Maryland and Virginia: bodily injury, property damage, products-completed operations and contractual liability.",
    },
  },
  {
    slug: "commercial-auto",
    number: "04",
    name: "Commercial Auto",
    title: "Auto Insurance",
    summary: "Get started on quoting your business autos and trucks.",
    body: [
      { type: "heading", text: "What is auto insurance?" },
      {
        type: "paragraph",
        text: "Auto insurance protects you against financial loss if you have an accident. It is a contract between your business and the insurance company. You agree to pay the premium and the insurance company agrees to pay your losses as defined in your policy.",
      },
      { type: "paragraph", text: "Auto insurance provides property, liability and medical coverage:" },
      {
        type: "list",
        items: [
          { text: "Property coverage pays for damage to or theft of your business automobile." },
          { text: "Liability coverage pays for your legal responsibility to others for bodily injury or property damage." },
          { text: "Medical coverage pays for the cost of treating injuries, rehabilitation and sometimes lost wages and funeral expenses." },
        ],
      },
      {
        type: "paragraph",
        text: "Most auto policies are for six months or a year. Your insurance company should notify you by mail when it's time to renew the policy and to pay your premium.",
      },
      { type: "heading", text: "Why do you need auto insurance?" },
      { type: "paragraph", text: "It's really all about protecting you and your business financially." },
      {
        type: "list",
        items: [
          { text: "If you're in an accident or your car is stolen, it costs money, often a lot of money, to fix or replace it." },
          { text: "If you or any passengers are injured in an accident, medical costs can be extremely expensive." },
          { text: "If you or your car is responsible for damage or injury to others, you may be sued for much more than you're worth." },
          { text: "Not only is having insurance a prudent financial decision, many states require you to have at least some coverage." },
        ],
      },
      { type: "heading", text: "Commercial Auto" },
      ...COMMERCIAL_AUTO,
      { type: "heading", text: "Download Your Motor Vehicle Report" },
      {
        type: "paragraph",
        text: "This report is useful for employers to help them evaluate rates for auto insurance. For businesses that have commercial auto insurance packages, consider requesting a Motor Vehicle Report from prospective employees to help determine if and how your rates may be affected.",
        // Legacy link (DC DMV). URL may have moved; verify before launch.
        link: { label: "Download your Motor Vehicle Report (DC DMV)", href: "http://dmv.dc.gov/node/232022" },
      },
      { type: "heading", text: "Questions to think about before calling:" },
      {
        type: "paragraph",
        text: "Value Insurance Agency Inc. is an advocate for finding auto insurance that meets your specific needs. Here are a few things to consider as you prepare for the discussion:",
      },
      {
        type: "list",
        items: [
          { text: "How much can your business afford to pay if you get in an accident? (To keep premiums low you may want to have a higher deductible and be willing to pay more for repairs.)" },
          { text: "What discounts are available? (Ask about good driver, multiple policy and student discounts.)" },
          { text: "What's the procedure for filing and settling a claim? (Ask who to call and what happens after you file a claim.)" },
        ],
      },
    ],
    highlights: [
      "protecting you and your business financially",
      'the name of the business appears on the policy as the "principal insured"',
    ],
    related: ["taxicabs-limousines", "garage-keepers-liability", "umbrella-liability", "business-insurance"],
    legacyPaths: ["/automobile/default.aspx", "/automobile/", "/category.aspx?id=AUTO", "/automobile/auto_quote_form.aspx"],
    seo: {
      title: "Commercial Auto Insurance in Washington, DC",
      description:
        "Commercial auto insurance for business cars and trucks in Washington, DC, Maryland and Virginia. Liability, collision, comprehensive and medical coverage compared across carriers.",
    },
  },
  {
    slug: "umbrella-liability",
    number: "05",
    name: "Umbrella Liability",
    title: "Umbrella Coverage",
    summary: "Coverage above and beyond your current policy limits.",
    body: [
      { type: "heading", text: "What is umbrella liability coverage?" },
      {
        type: "paragraph",
        text: "Coverage for losses above the limit of an underlying policy or policies such as homeowners and auto insurance. While it applies to losses over the dollar amount in the underlying policies, terms of coverage are sometimes broader than those of underlying policies. It is designed to protect you and your business by offering coverage above and beyond your current policy limits.",
      },
    ],
    highlights: ["coverage above and beyond your current policy limits"],
    callLine: call("Umbrella Liability Coverage"),
    related: ["general-liability", "commercial-auto", "professional-liability"],
    legacyPaths: ["/umbrella/default.aspx", "/umbrella/", "/category.aspx?id=UMBR"],
    seo: {
      title: "Umbrella Liability Insurance in DC, MD & VA",
      description:
        "Commercial umbrella liability coverage for Washington, DC area businesses: protection above and beyond the limits of your underlying policies.",
    },
  },
  {
    slug: "meetings-and-events",
    number: "06",
    name: "Meetings and Events Coverage",
    title: "Meetings and Events Insurance",
    summary: "Coverage for the one detail most event plans overlook.",
    body: [
      { type: "heading", text: "What is meeting and events insurance?" },
      {
        type: "paragraph",
        text: "When planning a big meeting or event, there are many things to get right: location, equipment, catering, invitations, etc. But when everything has been planned to perfection, have you overlooked insurance coverage? If you are planning a meeting or event, we can find you coverage to protect you against lawsuits, claims made to the bodily injury of guests, and damage to the property. Call us today to discuss options for your meetings and events.",
      },
    ],
    highlights: ["have you overlooked insurance coverage?"],
    callLine: call("Meetings and Events Insurance"),
    related: ["general-liability", "umbrella-liability", "property-and-building"],
    legacyPaths: ["/content/meetings.aspx"],
    seo: {
      title: "Meetings & Events Insurance in Washington, DC",
      description:
        "Event and meeting insurance in Washington, DC, Maryland and Virginia: protection against lawsuits, guest bodily injury claims and property damage.",
    },
  },
  {
    slug: "health-insurance",
    number: "07",
    name: "Health Insurance",
    title: "Health Insurance",
    summary: "Fee-for-service, managed care, long-term care and disability coverage explained.",
    body: [
      { type: "heading", text: "What kinds of health insurance are there?" },
      {
        type: "paragraph",
        text: "There are essentially two kinds of health insurance: Fee-for-Service and Managed Care. Although these plans differ, they both cover an array of medical, surgical and hospital expenses. Most cover prescription drugs and some also offer dental coverage.",
      },
      {
        type: "list",
        items: [
          {
            term: "Fee-for-Service",
            text: "These plans generally assume that the medical professional will be paid a fee for each service provided to the patient. Patients are seen by a doctor of their choice and the claim is filed by either the medical provider or the patient.",
          },
          {
            term: "Managed Care",
            text: "More than half of all Americans have some kind of managed-care plan¹. Various plans work differently and can include: health maintenance organizations (HMOs), preferred provider organizations (PPOs) and point-of-service (POS) plans. These plans provide comprehensive health services to their members and offer financial incentives to patients who use the providers in the plan.",
          },
        ],
      },
      { type: "heading", text: "What is 'long-term care'?" },
      {
        type: "paragraph",
        text: "Because of old age, mental or physical illness, or injury, some people find themselves in need of help with eating, bathing, dressing, toileting or continence, and/or transferring (e.g., getting out of a chair or out of bed). These six actions are called Activities of Daily Living–sometimes referred to as ADLs. In general, if you can’t do two or more of these activities, or if you have a cognitive impairment, you are said to need “long-term care.”",
      },
      {
        type: "paragraph",
        text: "Long-term care isn’t a very helpful name for this type of situation because, for one thing, it might not last for a long time. Some people who need ADL services might need them only for a few months or less.",
      },
      {
        type: "paragraph",
        text: "Many people think that long-term care is provided exclusively in a nursing home. It can be, but it can also be provided in an adult day care center, an assisted living facility, or at home.",
      },
      {
        type: "paragraph",
        text: "Assistance with ADLs, called “custodial care,” may be provided in the same place as (and therefore is sometimes confused with) “skilled care.” Skilled care means medical, nursing, or rehabilitative services, including help taking medicine, undergoing testing (e.g. blood pressure), or other similar services. This distinction is important because generally Medicare and most private health insurance pays only for skilled care–not custodial care.",
      },
      { type: "heading", text: "What are the types of disability insurance?" },
      {
        type: "paragraph",
        text: "There are two types of disability policies: Short-Term Disability (STD) and Long-Term Disability (LTD):",
      },
      {
        type: "list",
        items: [
          { text: "Short-Term Disability policies (STD) have a waiting period of 0 to 14 days with a maximum benefit period of no longer than two years." },
          { text: "Long-Term Disability policies (LTD) have a waiting period of several weeks to several months with a maximum benefit period ranging from a few years to the rest of your life." },
        ],
      },
      { type: "paragraph", text: "Disability policies have two different protection features that are important to understand." },
      {
        type: "list",
        items: [
          { term: "Non-cancelable", text: "means the policy cannot be canceled by the insurance company, except for nonpayment of premiums. This gives you the right to renew the policy every year without an increase in the premium or a reduction in benefits." },
          { term: "Guaranteed renewable", text: "gives you the right to renew the policy with the same benefits and not have the policy canceled by the company. However, your insurer has the right to increase your premiums as long as it does so for all other policyholders in the same rating class as you." },
        ],
      },
      {
        type: "paragraph",
        text: "In addition to the traditional disability policies, there are several options you should consider when purchasing a policy:",
      },
      {
        type: "list",
        items: [
          { term: "Additional purchase options", text: "Your insurance company gives you the right to buy additional insurance at a later time for an additional cost." },
          { term: "Coordination of benefits", text: "The amount of benefits you receive from your insurance company is dependent on other benefits you receive because of your disability. Your policy specifies a target amount you will receive from all the policies combined, so this policy will make up the difference not paid by other policies." },
          { term: "Cost of living adjustment (COLA)", text: "The COLA increases your disability benefits over time based on the increased cost of living measured by the Consumer Price Index. You will pay a higher premium if you select the COLA." },
          { term: "Residual or partial disability rider", text: "This provision allows you to return to work part-time, collect part of your salary and receive a partial disability payment if you are still partially disabled." },
          { term: "Return of premium", text: "This provision requires the insurance company to refund part of your premium if no claims are made for a specific period of time declared in the policy." },
          { term: "Waiver of premium provision", text: "This clause means that you do not have to pay premiums on the policy after you’re disabled for 90 days." },
        ],
      },
      {
        type: "footnote",
        text: "1 – Source:",
        // Legacy link; NCSL has since reorganised its site — verify before launch.
        link: { label: "Managed Care and the States", href: "http://www.ncsl.org/issues-research/health/managed-care-and-the-states.aspx" },
      },
    ],
    highlights: ["Fee-for-Service and Managed Care", "it might not last for a long time"],
    related: ["workers-compensation", "employment-practices-liability", "business-insurance"],
    legacyPaths: ["/health/"],
    seo: {
      title: "Health Insurance for Businesses in DC, MD & VA",
      description:
        "Health, long-term care and disability insurance explained by an independent Washington, DC agency: fee-for-service, managed care, STD and LTD.",
    },
  },
  {
    slug: "employment-practices-liability",
    number: "08",
    name: "Employment Practices Liability",
    title: "Employment Practices Liability Insurance",
    summary: "Covers claims of wrongful termination, discrimination, defamation and more.",
    body: [
      { type: "heading", text: "What is employment practices liability insurance?" },
      {
        type: "paragraph",
        text: "This type of insurance will cover claims against a business owner due to wrongful termination, discrimination, defamation, invasion of privacy, and other employment practice damages.",
      },
    ],
    highlights: ["wrongful termination, discrimination, defamation, invasion of privacy"],
    callLine: call("Employment Practices Liability Insurance"),
    related: ["directors-and-officers", "workers-compensation", "professional-liability"],
    legacyPaths: ["/e_and_o/employmentpractices.aspx"],
    seo: {
      title: "Employment Practices Liability Insurance (EPLI) in DC",
      description:
        "Employment practices liability insurance for Washington, DC, Maryland and Virginia employers: claims of wrongful termination, discrimination, defamation and invasion of privacy.",
    },
  },
  {
    slug: "professional-liability",
    number: "09",
    name: "Professional Liability",
    title: "Professional Liability Insurance",
    summary: "Protection from losses resulting from errors and omissions in your services.",
    body: [
      { type: "heading", text: "What is professional liability insurance?" },
      {
        type: "paragraph",
        text: "If you provide professional services, professional liability insurance can help protect from financial and economic losses resulting from errors and omissions in performing your services.",
      },
    ],
    highlights: ["errors and omissions in performing your services"],
    callLine: call("Professional Liability Insurance"),
    related: ["errors-and-omissions", "directors-and-officers", "general-liability"],
    legacyPaths: ["/e_and_o/professionalliability.aspx"],
    seo: {
      title: "Professional Liability Insurance in Washington, DC",
      description:
        "Professional liability insurance for Washington, DC, Maryland and Virginia service providers: protection from financial losses resulting from errors and omissions.",
    },
  },
  {
    slug: "directors-and-officers",
    number: "10",
    name: "Directors and Officers",
    title: "Directors and Officers Insurance",
    summary: "Liability protection for directors and officers in their official positions.",
    body: [
      { type: "heading", text: "What is directors and officers (D&O) insurance?" },
      {
        type: "paragraph",
        text: "This insurance is liability insurance payable individually to directors and officers as reimbursement for claims made against them when serving their official positions. It can cover claims resulting from making decisions that have caused injury to an organization.",
      },
    ],
    highlights: ["payable individually to directors and officers"],
    callLine: call("Directors and Officers Insurance"),
    related: ["employment-practices-liability", "professional-liability", "errors-and-omissions"],
    legacyPaths: ["/e_and_o/directorsandofficers.aspx"],
    seo: {
      title: "Directors & Officers (D&O) Insurance in DC, MD & VA",
      description:
        "D&O insurance for Washington, DC area companies and organizations: liability coverage for directors and officers serving in their official positions.",
    },
  },
  {
    slug: "errors-and-omissions",
    number: "11",
    name: "Errors and Omissions",
    title: "Errors & Omissions Insurance",
    summary: "If your business provides a service for a fee, you have an E&O exposure.",
    body: [
      { type: "heading", text: "What is errors and omissions insurance?" },
      {
        type: "paragraph",
        text: "Errors and omissions (E&O) insurance provides coverage for businesses or individuals for when they are held responsible for a service provided, or failure to provide a service, that did not have the expected results. For doctors, dentists, etc., it is called malpractice insurance. For professionals like lawyers, accountants or engineers, it may be called professional liability. Regardless of its name, E&O insurance covers any errors or omissions that either you have made or that the client perceives you have made.",
      },
      {
        type: "paragraph",
        text: "The number of liability lawsuits against professionals has increased in recent years. Many professionals are at risk of being sued. Small companies can go bankrupt from the cost of lawsuits. Even large companies can experience an impact to their bottom line. An E&O policy covers legal fees and settlements in such scenarios, regardless of fault.",
      },
      { type: "heading", text: "Who benefits from errors and omissions insurance?" },
      {
        type: "paragraph",
        text: "If your business provides a service for a fee, you have an E&O exposure. Have you thought about what could happen if the service is done incorrectly or not performed in time? Even with quality employees and risk management practices in place, people still make mistakes. A general liability policy may not cover mistakes that could be made. Errors and omissions insurance will protect your business and its finances if such an event arises.",
      },
      { type: "heading", text: "Get started today" },
      {
        type: "paragraph",
        text: "There is not a standard E&O policy. We will evaluate your business to determine your specific exposures and help you get the coverage you need. If you think you might need an E&O insurance policy, give us a call. We are happy to assist you today.",
      },
    ],
    highlights: [
      "that either you have made or that the client perceives you have made",
      "If your business provides a service for a fee, you have an E&O exposure.",
      "There is not a standard E&O policy.",
    ],
    related: ["professional-liability", "directors-and-officers", "general-liability"],
    legacyPaths: ["/e_and_o/default.aspx", "/e_and_o/", "/category.aspx?id=EANDO"],
    seo: {
      title: "Errors & Omissions (E&O) Insurance in Washington, DC",
      description:
        "Errors and omissions insurance for Washington, DC, Maryland and Virginia businesses that provide a service for a fee. Legal fees and settlements covered, regardless of fault.",
    },
  },
  {
    slug: "property-and-building",
    number: "12",
    name: "Property and Building",
    title: "Property and Building Insurance",
    summary: "Protection from damage to property — whether you own it or it belongs to someone else.",
    body: [
      { type: "heading", text: "What is property and building insurance?" },
      {
        type: "paragraph",
        text: "Property and building insurance coverage protects you from damages to property, whether you own the property or it belongs to someone else. This coverage traditionally covers machinery, crime losses, fires, and other perils, and also can include the contents of a building.",
      },
    ],
    highlights: ["whether you own the property or it belongs to someone else"],
    callLine: call("Property and Building Insurance"),
    related: ["builders-risk", "contractors-insurance", "business-insurance"],
    legacyPaths: ["/business/propertyandbuilding.aspx"],
    seo: {
      title: "Commercial Property & Building Insurance in DC",
      description:
        "Commercial property and building insurance in Washington, DC, Maryland and Virginia: machinery, crime losses, fire and other perils, including building contents.",
    },
  },
  {
    slug: "contractors-insurance",
    number: "13",
    name: "Contractor's Insurance",
    title: "Contractor's Insurance",
    summary: "A group of policies protecting against accidents, injuries, property damage and more.",
    body: [
      { type: "heading", text: "What is contractor's insurance?" },
      {
        type: "paragraph",
        text: "This broad type of coverage is a group of policies that can protect against many risks, such as accidents, injuries, damage to property, protection for autos, and others.",
      },
    ],
    highlights: ["a group of policies that can protect against many risks"],
    callLine: call("Contractor's Insurance"),
    related: ["builders-risk", "general-liability", "workers-compensation", "commercial-auto"],
    legacyPaths: ["/business/contractorsinsurance.aspx"],
    seo: {
      title: "Contractor's Insurance in Washington, DC, MD & VA",
      description:
        "Contractor's insurance for Washington, DC, Maryland and Virginia contractors: a group of policies covering accidents, injuries, property damage and autos.",
    },
  },
  {
    slug: "builders-risk",
    number: "14",
    name: "Builder's Risk Insurance",
    title: "Builder's Risk Insurance",
    summary: "Protects buildings, materials, fixtures and equipment while under construction.",
    body: [
      { type: "heading", text: "What is builder's risk insurance?" },
      {
        type: "paragraph",
        text: "Builder's risk insurance is a type of property insurance for property owners and general contractors to protect against damages to buildings while they are being built. Losses covered include damages to materials, fixtures, and equipment.",
      },
    ],
    highlights: ["damages to buildings while they are being built"],
    callLine: call("Builder's Risk Insurance"),
    related: ["contractors-insurance", "property-and-building", "general-liability"],
    legacyPaths: ["/business/buildersrisk.aspx"],
    seo: {
      title: "Builder's Risk Insurance in Washington, DC",
      description:
        "Builder's risk insurance for property owners and general contractors in DC, Maryland and Virginia: materials, fixtures and equipment covered during construction.",
    },
  },
  {
    slug: "taxicabs-limousines",
    number: "15",
    name: "Taxicabs/Limousines",
    title: "Taxicab/Limousine Insurance",
    summary: "Coverage built for drivers responsible for the well-being of passengers.",
    body: [
      { type: "heading", text: "What is taxicab and limousine insurance?" },
      {
        type: "paragraph",
        text: "Commercial taxicab and limousine insurance is different from regular automobile coverage because you are explicitly responsible for the well-being of your passengers. This special insurance can cover damages to your vehicle, theft, injury to you, and injury to your customers.",
      },
    ],
    highlights: ["you are explicitly responsible for the well-being of your passengers"],
    callLine: call("Taxicab/Limousine Insurance"),
    related: ["commercial-auto", "garage-keepers-liability", "umbrella-liability"],
    legacyPaths: ["/business/taxicabslimousines.aspx"],
    seo: {
      title: "Taxi & Limousine Insurance in Washington, DC",
      description:
        "Commercial taxicab and limousine insurance in Washington, DC, Maryland and Virginia: vehicle damage, theft, driver injury and passenger injury coverage.",
    },
  },
  {
    slug: "garage-keepers-liability",
    number: "16",
    name: "Garage Keepers Liability",
    title: "Garage Keepers Liability Insurance",
    summary: "For parking businesses, towing companies and auto repair/body shops.",
    body: [
      { type: "heading", text: "What is garage keepers liability insurance?" },
      {
        type: "paragraph",
        text: "Garage keepers liability insurance is coverage designed to protect you from claims from customers whose vehicles you are keeping in a garage for parking, storing, or service, and, hence, is suitable for parking businesses, towing companies, and auto repair/body shops.",
      },
    ],
    highlights: ["parking businesses, towing companies, and auto repair/body shops"],
    callLine: call("Garage Keepers Liability Insurance"),
    related: ["commercial-auto", "taxicabs-limousines", "property-and-building"],
    legacyPaths: ["/business/garagekeepersliability.aspx"],
    seo: {
      title: "Garage Keepers Liability Insurance in DC, MD & VA",
      description:
        "Garage keepers liability insurance for parking businesses, towing companies and auto repair/body shops in Washington, DC, Maryland and Virginia.",
    },
  },
];

export const coverageBySlug = (slug: string) => coverages.find((c) => c.slug === slug);

/* ------------------------------------------------------------------ */
/* Carrier partners                                                    */
/* ------------------------------------------------------------------ */

/**
 * Only carriers verified on the client's partners page belong here.
 * The legacy /partners/ page returns 404, so this stays empty until the
 * client confirms their carriers. Logos go in /public/images/carriers/.
 */
export const carriers: Carrier[] = [];

/* ------------------------------------------------------------------ */
/* Forms (legacy /contact/, /refer/, /newsletter/)                      */
/* ------------------------------------------------------------------ */

export const contactPage = {
  heading: "Contact Value Insurance Agency Inc. via the web!",
  text: "To contact Value Insurance Agency Inc. directly, please fill out the following form as completely as possible. When finished, click the Submit button to send your contact request. You will receive a response from us shortly.",
  /** Legacy dropdown only had "General Inquiry"; coverage names are added so the agency can triage. */
  inquiryTypes: ["General Inquiry", "Request a Policy Review", ...coverages.map((c) => c.name)],
};

export const referPage = {
  title: "Referral Form",
  heading: "Refer a friend to Value Insurance Agency Inc.",
  text: "We love referrals! The greatest testament that our customers can provide is by referring other businesses to Value Insurance Agency Inc. Thank you for your referral, and we thank you even more for your continued business.",
};

export const newsletterPage = {
  title: "Join our Mailing List",
  heading: "Stay in touch with the latest events, news and offers at Value Insurance Agency Inc.",
  text: "To join our mailing list, please insert your e-mail address below. Submit your request by clicking the finish button. Your information will not be sold or distributed to any unrelated third party companies.",
  privacyNote:
    "To view more information about Value Insurance Agency Inc.'s data collection and usage policies, please view our Privacy Policy. By using the Value Insurance Agency Inc. website, you consent to the data practices described in our Privacy Policy. If you have any questions, please feel free to contact us.",
};

/* ------------------------------------------------------------------ */
/* Privacy policy (legacy /privacy/) — legal text, verbatim            */
/* ------------------------------------------------------------------ */

export type PrivacySection = { heading?: string; paragraphs: string[] };

/**
 * NOTE for client review: this is the website builder's boilerplate (it refers to
 * credit cards, subscriptions, an FAQ section and Texas law). Migrated verbatim;
 * have counsel review before launch. "click here" opt-out link preserved below.
 */
export const privacy = {
  title: "Web site Privacy Policy for Value Insurance Agency Inc.",
  intro: "This notice describes our privacy policy (“Notice”). By visiting our Web Site (“Web Site”), you are accepting the practices described in this Notice.",
  gaOptOutUrl: "https://tools.google.com/dlpage/gaoptout/",
  sections: [
    {
      heading: "Article I – Principles",
      paragraphs: [
        "Section 1.01 -- Principles: We may gather and use information as follows:",
        "(1) Notice: We may gather and use information as follows:",
        "(a) Volunteered Information: We will receive and store any information you enter on the Web Site or give us in any other way that personally identifies you to improve your experience at the Web Site, to get a better general understanding of the type of individuals visiting the Web Site, and to enable us to contact you when needed. Typically you will provide information on the Web Site for the purchase of products or services or when you submit comments or questions for review by us.",
        "(b) Automatic Information: To enable us to provide content that users need and desire, we collect aggregated site-visitation statistics using cookies. A Cookie is simply a small data file we place on your computer’s hard drive when you first visit the Web Site (“Cookie”). This file contains a unique number that helps us identify you when you return to the Web Site. Cookies are employed by thousands of web sites to enhance users’ web viewing experience. Cookies can neither damage user files nor can they read information from users’ hard drives. We combine all usage information provided by such Cookies and we do not monitor your use of the Web Site. Allowing us to create a Cookie on your hard drive will not give us or any other site access to the rest of your computer’s hard drive, and only we will be able to read the Cookie that the Web Site creates.",
        "(c) Information Use: We use information for personal identification; to get a better general understanding of the type of individuals visiting the Web Site; to respond to your requests for purchases, comments, or questions; to improve your experience at the Web Site; to collect aggregated site-visitation statistics; and to alert you to product enhancements, special offers, updated information, and other new services from us. We also use information to alert you of subscription renewal discounts, to automatically renew your subscription and advise you of upcoming service offerings and events.",
        "We may disclose information to third parties, or disclosing customer lists to commercial or charitable users thereof. Disclosure for such purposes is limited to your name, company, position, address, phone and fax numbers, and web site and email addresses. If you do not wish to have such information disclosed, please let us know by contacting us. To enable us to process your request, please include your name and address. Once properly notified, we will remove your name from the lists and disclosures as soon as we practicably can in the course of normal business practices.",
        "When you order products or services from us, we ask for your credit card number and billing address. We use this information only to bill you for the products or services you order at that time and for no other purpose. Annual subscriptions are payable on the purchase date of the Subscription and renew automatically each anniversary unless canceled in writing thirty days in advance of each anniversary date.",
        "Any user questions or comments submitted to us may become available in the public sections of the Web Site, including a section entitled “Frequently Asked Questions,” immediately after such questions or comments are submitted to us. If we publicize any user questions, such questions will not contain facts that identify the user or the specific parties involved. We also reserve the right to use any user comments submitted to us for promotional purposes and by submitting such comments to us you agree that we may do so.",
        "We may release any user information if required to comply with law; to enforce or to apply the Web Site Terms and Conditions; or under the good faith belief that disclosure is otherwise necessary or advisable including, without limitation, to protect the rights, properties, or safety of us or our users.",
        "(2) Choice: We give you a choice as to the type and amount of private information we have, as follows:",
        "(a) Volunteered Information: You can always choose not to provide certain information to us. If you choose not to provide personal information, you can still use many parts of the Web Site. However, you will not be able to purchase products and services and you will not be able to take advantage of many of our features. If you have previously provided certain information to us and you desire to remove such information from our databases, or if you do not wish for your information to be disclosed to third parties, you may contact us to remove such information.",
        "(b) Automatic Information: Most web browsers automatically accept Cookies, but if you prefer, you can edit your browser options to block Cookies in the future. The “Help” portion of the toolbar on most browsers will explain how you can prevent your browser from accepting new Cookies, how to set the browser to inform you when you receive a new Cookie, or how to reject Cookies altogether.",
        "(3) Access: We provide you with the ability to ensure that your personal information is correct and current. You may review and update your personal information by contacting us. For security purposes, we require user verification via user’s user name and password to receive personal information.",
        "(4) Security: We protect the security of your personal information. We take steps to protect your data from loss, misuse, alteration, destruction, or unauthorized access. We use sophisticated security technologies to secure users’ ordering information, user name, and password. We encrypt users’ ordering information, user name, and password (including users’ credit card account number) using Secure Socket Layer (“SSL”) technology. SSL is a proven coding system that lets your browser automatically encrypt, or scramble, data before you send it to us. To support this technology, users must have an SSL-capable browser. SSL is one of the safest encryption technologies available. While we use such sophisticated security technology to secure users’ ordering information, user name, and password, we cannot guarantee that any electronic commerce is totally secure.",
      ],
    },
    {
      paragraphs: [
        "Section 2.01 -- User Safeguards: You are responsible for maintaining the secrecy of your user name, password, and any account information. It is important for you to be responsible and protect your user name, password, and computer against unauthorized users. It is important to sign off when you have completed using a computer accessible by others.",
        "Section 3.01 -- Children: We do not sell products for children. Users of the Web Site must be at least eighteen years old. If a child has provided us with personal information, that child’s parent or guardian should contact us to delete such information from our records.",
        "Section 4.01 -- Third Party Web Sites: Please be aware that the Web Site may have links to third party web sites that may collect personally identifiable information about you. When you click on one of these third party links, you are entering another web site for which we have no responsibility. This Notice does not cover the information practices or policies of such third party web sites. We encourage you to read the privacy statements of all such web sites since their privacy policies may be materially different from our Notice.",
        "Section 5.01 -- Agreement and Modification: By using and accessing the Web Site you indicate that you have read and understand this Notice and you consent to the collection and use of information by us in the manner explained in this Notice. This Notice and the Web Site Terms and Conditions, including without limitation, provisions covering limitations on damages, arbitration of disputes, and the application of Texas law govern any dispute over privacy. By using and accessing the Web Site you agree to indemnify us for any and all third party claims resulting from your breach of this Notice or the Web Site Terms and Conditions. If you have any questions or concerns about your privacy at the Web Site, please contact us. If you do not accept this Notice, do not access and use the Web Site. We may revise this Notice at any time without notice by updating this Notice. Any modifications in the way we use personal information will be provided in future updates of this Notice so you are always aware of what information we collect, how we use it, and under what circumstances we disclose such information. Modifications will be effective immediately and will be available on the Web Site. You should visit this web page periodically to review the Notice. User accepts any such modifications to this Notice by continued use of the Web Site after such modifications are made.",
        "Section 6.01 -- Please be aware that Google Analytics Advertising Features may be tracking visitor data on this website. Google Analytics may use cookies to collect Demographics and Interest Reporting data, which is used to get a better general understanding of the type of individuals visiting the Web Site; to collect aggregated site-visitation statistics; and to improve marketing initiatives, such as display and remarketing advertising. This information will not be sold to third parties, and the data collected through Google Analytics Advertising Features - including Demographics and Interest Reporting - is not personally identifiable. If you'd like to opt-out of Google Analytics Advertising Features tracking, click here.",
      ],
    },
  ] satisfies PrivacySection[],
};

/* ------------------------------------------------------------------ */
/* Migration log                                                       */
/* ------------------------------------------------------------------ */

/** Every wording change made during migration (meaning unchanged). */
export const TYPO_FIXES = [
  'Health: "heath insurance" → "health insurance"; "HM0s" → "HMOs"; source footnote marker "plan 1" → "plan¹"',
  'Workers Comp: "rehabilitiation" → "rehabilitation"',
  'General Liability: "your polics limit" → "your policy\'s limit"',
  'Umbrella: "Call us today today" → "Call us today"',
  'D&O: "decisions that have cause injury" → "decisions that have caused injury"',
  'E&O: "lawyers, accountings or engineers" → "lawyers, accountants or engineers"',
  'EPL: heading "employer practices liability" → "employment practices liability"',
  'Property & Building: "Property and Building Insurance Information needs" → "Property and Building Insurance needs"',
  'Résumé: "Business Legal Services Services Inc." → "Business Legal Services Inc." (confirm); "doctors, lawyer," → "doctors, lawyers,"',
  'About: "Washington, DC Maryland" → "Washington, DC, Maryland"; comma after "Value Insurance Agency Inc." (president clause)',
  'Refer: "Value Insurance Agency Inc.." → "Value Insurance Agency Inc."',
  'Privacy: "We takes steps" → "We take steps"; "ARTICLE I– PRINCIPLES" → "Article I – Principles"',
] as const;
