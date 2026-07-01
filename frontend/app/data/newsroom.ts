export interface Article {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: 'Company' | 'Press' | 'Blog' | 'India GCC';
  excerpt: string;
  body: string;
  image: string;
  emoji: string;
  color: string;
  featured?: boolean;
  externalUrl?: string;
  pdfs?: { name: string; url: string; size?: string }[];
  tags?: string[];
  pullQuote?: string;
}

export const articles: Article[] = [
  {
    slug: 'premium-parking-cnbc-feature',
    title: 'Premium Parking® Featured on CNBC',
    date: '2026-06-23',
    author: 'Premium Parking Communications',
    category: 'Press',
    excerpt: 'Premium Parking® lands on CNBC — the documentary Access Made Simple explores how free flow parking technology born in New Orleans is now reshaping the industry at 1,500+ locations nationwide.',
    body: `## Premium Parking® Featured on CNBC

Premium Parking® is on CNBC. The documentary *Access Made Simple* tells the story of how a company born in New Orleans built a free flow parking technology platform that is now operating at more than 1,500 locations across the country — and changing the way people experience the places they visit.

### From New Orleans to Nationwide

The story starts in the French Quarter, where Premium Parking removed gates instead of replacing aging equipment. Traffic moved. Costs dropped. The experience got better for parkers, residents, and property owners. That single decision became the blueprint for everything that followed.

"Parking should remove friction, not create it," said CEO James Huger. "When parking works, people can focus on enjoying great places."

### The Platform Behind It All

At the center of the feature is GLIDEPARCS® — Premium Parking's proprietary full-stack technology platform connecting license plate recognition, payments, compliance, and real-time data into a single system. It's the engine behind the company's People, Places, Platform philosophy: the conviction that great parking design shapes how people experience a destination.

"A full stack approach gives cities better data and a better experience for parkers," said President Ben Montgomery.

### Watch on CNBC

See the full feature at [Acumen GSTI – Premium Parking](https://www.cnbc.com/advertorial/acumen-gsti-premium-parking/).`,
    image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=1200&auto=format&fit=crop',
    emoji: '📺',
    color: 'from-red-400 to-blue-500',
    featured: true,
    externalUrl: 'https://www.cnbc.com/advertorial/acumen-gsti-premium-parking/',
    pullQuote: '"Parking should remove friction, not create it," said CEO James Huger.',
    tags: ['cnbc', 'media', 'documentary', 'featured'],
  },
  {
    slug: 'great-lpr-technology-platform',
    title: 'Great LPR Technology Starts With a Great Platform',
    date: '2026-06-30',
    author: 'Premium Parking Communications',
    category: 'Blog',
    excerpt: 'Free flow parking is only as good as the technology underneath it. GLIDE Eye LPR® is purpose-built for parking — not repurposed, not bolted on. Just built right.',
    body: `Free flow parking is one of the most compelling promises in the industry right now. No gates. No pay stations. Parkers pull in, park, and leave — and the technology handles everything else quietly in the background.

## How Off-the-Shelf LPR Falls Short

Third-party LPR cameras were never designed for the specific demands of parking. Capture rates between 70% and 80% are common. Every missed session is revenue that simply disappears.

## What Actually Makes Free Flow Work

The answer isn't just better cameras. It's ownership of the full technology stack — from the hardware capturing the image, to the software interpreting it, to the platform acting on it in real time.

**GLIDE Eye LPR®** was built on the foundation of the **GLIDEPARCS®** platform. It isn't a third-party solution bolted onto a management system. It's purpose-built for parking, designed from the ground up to capture every entry and every exit with the accuracy that free flow operations actually require.

## A Platform That Evolves With You

When Premium develops a new capability — whether it's enhanced vehicle identification, smarter Compliance workflows, or more granular session analytics — it's layered onto the same foundation already running at your property.

**That's GLIDE Eye LPR®. That's GLIDEPARCS®. That's Premium Parking.**`,
    image: 'https://images.unsplash.com/photo-1621977717126-e2996510a502?q=80&w=1200&auto=format&fit=crop',
    emoji: '📝',
    color: 'from-cyan-400 to-blue-500',
    pullQuote: 'Free flow parking isn\'t just a feature. It\'s the right solution for today\'s Parker.',
    tags: ['technology', 'lpr', 'glide-eye', 'engineering'],
  },
  {
    slug: 'pioneer-square-garage-reopening',
    title: 'Premium Parking Reopens Pioneer Square Garage Ahead of FIFA World Cup 2026',
    date: '2026-06-11',
    author: 'Premium Parking Communications',
    category: 'Company',
    excerpt: 'Premium Parking will reopen Seattle\'s Pioneer Square Garage with enhanced safety measures, on-site staffing, and GLIDEPARCS® technology ahead of FIFA World Cup 2026 events.',
    body: `## Pioneer Square Garage Reopens in Seattle

Premium Parking will reopen Seattle's Pioneer Square Garage in phases starting June 17, offering expanded access, on-site staffing, enhanced safety measures, and GLIDEPARCS® technology ahead of FIFA World Cup 2026 events near Lumen Field.

### What's New

- **Enhanced Safety**: 24/7 on-site staffing and improved lighting
- **GLIDEPARCS® Technology**: Seamless gateless entry and exit
- **Real-time Availability**: Parkers can check space availability before arriving
- **Event-Ready**: Optimized for major events at Lumen Field

### A Model for Event Parking

The Pioneer Square Garage demonstrates how Premium Parking's technology platform transforms the event parking experience — eliminating gate lines, reducing congestion, and getting parkers to their seats faster.`,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop',
    emoji: '🏟️',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    slug: 'premium-parking-gulf-breeze-florida',
    title: 'Premium Parking® Selected to Manage Parking in Gulf Breeze, FL',
    date: '2026-06-05',
    author: 'Premium Parking Communications',
    category: 'Company',
    excerpt: 'Premium Parking replaces the previous provider as the parking management provider for the City of Gulf Breeze, FL, bringing GLIDEPARCS® technology to Shoreline Park South.',
    body: `## Premium Parking Expands to Gulf Breeze, Florida

Premium Parking has been selected to replace the previous parking management provider for the City of Gulf Breeze, FL — bringing advanced technology and local expertise to Shoreline Park South and Mariners Landing.

### What This Means

Residents and visitors in Gulf Breeze now benefit from:
- **Gateless Entry/Exit**: No more gate arm delays
- **Mobile-First Payments**: Pay via QR code or the Premium Parking app
- **Real-Time Enforcement**: GLIDEPARCS® Compliance ensures fair parking access
- **Data-Driven Management**: City officials receive real-time occupancy and revenue data

### A Growing Partnership

This expansion reflects the growing demand for Premium Parking's technology-first approach to parking management across the Gulf Coast region.`,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    emoji: '🏖️',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    slug: 'free-flow-parking-smarter-property',
    title: 'The Renovation That Makes Your Property Smarter, Not Just Newer',
    date: '2026-06-19',
    author: 'Premium Parking Communications',
    category: 'Blog',
    excerpt: 'Every CRE asset has a renovation story. The parking lot rarely makes that conversation — but it should. Here\'s why it\'s often the highest-ROI move on the capital plan.',
    body: `## The Smarter Renovation

Every commercial real estate asset has a renovation story. The lobby, the amenities, the anchor space. The parking lot rarely makes that conversation — but it should.

### Why Parking is the Highest-ROI Renovation

1. **No Construction Required**: Gateless technology upgrades don't require tearing up concrete
2. **Immediate Revenue Impact**: Better compliance means captured revenue from day one
3. **Enhanced Property Value**: Smart parking technology increases NOI and property appeal
4. **Tenant Satisfaction**: Tenants and visitors notice when parking "just works"

### The GLIDEPARCS® Difference

Premium Parking's approach transforms parking from an operational headache into a competitive advantage. Property owners get real-time data, automated enforcement, and a frictionless experience — all without the capital expenditure of traditional garage renovations.

### Bottom Line

The renovation that makes your property smarter doesn't start with a sledgehammer. It starts with the right technology partner.`,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop',
    emoji: '🏗️',
    color: 'from-purple-400 to-blue-500',
  },
  {
    slug: 'india-gcc-office-launch',
    title: 'GLIDEPARCS® India GCC Office Now Operational in Hyderabad',
    date: '2026-07-01',
    author: 'India GCC Communications',
    category: 'India GCC',
    excerpt: 'The India Global Capability Center in Hyderabad is now fully operational, marking a major milestone in Premium Parking\'s global technology strategy.',
    body: `## India GCC Goes Live

The India Global Capability Center (GCC) in Hyderabad is now fully operational. This marks a significant milestone in Premium Parking's global technology strategy and our commitment to building world-class parking technology from India.

### Our Mission

The India GCC team will focus on advancing Premium Parking's technology — the GLIDEPARCS® platform — from platform enhancements to performance and scalability. We'll continue delivering seamless, gateless parking experiences at scale.

### What We're Building

- **Platform Engineering**: Core GLIDEPARCS® platform development and architecture
- **AI & Machine Learning**: Computer vision for license plate recognition, predictive analytics for parking demand
- **Mobile & Web**: Consumer-facing apps and property management dashboards
- **Quality Engineering**: Automated testing, performance optimization, and reliability engineering

### Working in Partnership

The India team works in close partnership with our U.S. teams, accelerating how quickly we bring new capabilities to market and raising the bar on what our platform can do.

*Welcome to the team!*`,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    emoji: '🚀',
    color: 'from-orange-400 to-green-500',
    featured: true,
    pullQuote: 'We\'re committed to building a world-class technology center in Hyderabad.',
    tags: ['india-gcc', 'office', 'announcement', 'hyderabad'],
    pdfs: [
      { name: 'India GCC Launch Press Release', url: '#', size: '1.8 MB' },
    ],
  },
  {
    slug: 'welcome-adam-message',
    title: 'A Message from Adam: Welcome to Premium Parking India',
    date: '2026-06-28',
    author: 'Adam (Leadership)',
    category: 'India GCC',
    excerpt: 'The team in India will focus on advancing Premium Parking\'s technology, GLIDEPARCS®, from platform enhancements to performance and scalability.',
    body: `## Welcome to Premium Parking India

The team in India will focus on advancing Premium Parking's technology, GLIDEPARCS®, from platform enhancements to performance and scalability, continuing to deliver seamless, gateless parking experiences at scale.

### Our Commitment

We're committed to building a world-class technology center in Hyderabad. The India GCC represents our long-term investment in talent, technology, and innovation.

### What This Means

- **For Premium Parking**: Accelerated product development and platform innovation
- **For Our Teams**: Close partnership between U.S. and India engineering teams
- **For Our Parkers**: Faster delivery of new features and capabilities

### Looking Ahead

This is just the beginning. We have ambitious plans for the India GCC and I'm excited to see what we'll build together.

*— Adam*`,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    emoji: '💬',
    color: 'from-blue-400 to-indigo-500',
    pullQuote: 'This is just the beginning. We have ambitious plans for the India GCC.',
    tags: ['leadership', 'welcome', 'india-gcc', 'culture'],
  },
  {
    slug: 'india-gcc-first-hackathon',
    title: 'India GCC Hosts First GLIDEPARCS® Hackathon',
    date: '2026-07-15',
    author: 'India GCC Communications',
    category: 'India GCC',
    excerpt: 'The Hyderabad team came together for a 48-hour hackathon, building innovative features for the GLIDEPARCS® platform.',
    body: `## First GLIDEPARCS® Hackathon in Hyderabad

The India GCC team hosted its first-ever hackathon this past week — a 48-hour sprint that brought together engineers, designers, and product thinkers to build innovative features for the GLIDEPARCS® platform.

### Highlights

- **8 Teams**: Cross-functional teams of 4-5 members each
- **48 Hours**: From Friday evening to Sunday evening
- **6 Demos**: Working prototypes presented to the leadership panel
- **3 Winners**: Selected for innovation, feasibility, and impact

### Winning Projects

1. **Smart Occupancy Predictor** — AI-powered parking demand forecasting
2. **Voice-Enabled Parker Assistant** — Hands-free parking payments via voice commands
3. **Real-Time Compliance Dashboard** — Live enforcement visualization for property managers

### What's Next

The winning projects are being evaluated for inclusion in the GLIDEPARCS® roadmap. This is exactly the kind of innovation we built the India GCC to foster.`,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    emoji: '💻',
    color: 'from-purple-400 to-pink-500',
    pullQuote: 'This is exactly the kind of innovation we built the India GCC to foster.',
    tags: ['hackathon', 'innovation', 'team', 'india-gcc'],
  },
  {
    slug: 'memphis-redbirds-partnership',
    title: 'Premium Parking and Memphis Redbirds Team Up',
    date: '2026-05-18',
    author: 'Premium Parking Communications',
    category: 'Press',
    excerpt: 'Premium Parking and the Memphis Redbirds have partnered to provide affordable, convenient parking near AutoZone Park, improving the fan experience.',
    body: `## Partnership with the Memphis Redbirds

Premium Parking and the Memphis Redbirds have partnered to provide affordable, convenient parking near AutoZone Park, improving the fan experience while encouraging visitors to explore downtown Memphis before and after games.

### The Partnership

- **Convenient Locations**: Multiple parking options within walking distance of AutoZone Park
- **GLIDEPARCS® Technology**: Gateless entry and exit for Redbirds fans
- **Mobile Payments**: Pay via phone — no tickets, no kiosks
- **Fan-First Pricing**: Affordable rates designed for the baseball season

### Impact

"Great partnerships make great places," said the Premium Parking team. "When parking works, fans can focus on enjoying the game and exploring everything downtown Memphis has to offer."`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    emoji: '⚾',
    color: 'from-red-400 to-amber-500',
  },
  {
    slug: 'glideparcs-platform-update-q2',
    title: 'GLIDEPARCS® Platform Update: Q2 2026 Highlights',
    date: '2026-07-02',
    author: 'Engineering Team',
    category: 'Blog',
    excerpt: 'A roundup of the most impactful platform improvements shipped by the GLIDEPARCS® engineering team in Q2 2026.',
    body: `## Q2 2026 Platform Highlights

The GLIDEPARCS® engineering team shipped several impactful improvements in Q2 2026. Here's a roundup of the highlights.

### Platform Improvements

- **License Plate Recognition Accuracy**: Improved from 92% to 97.3% with new ML models
- **Payment Processing Speed**: Reduced average transaction time by 40%
- **Dashboard Performance**: Redesigned admin dashboard loads 3x faster
- **Mobile App v2.5**: New parker experience with saved locations and favorites

### Compliance Enhancements

- **Automated Citation Workflow**: Reduced manual processing by 60%
- **Evidence Quality**: Higher-resolution image capture for enforcement
- **Real-Time Enforcement Alerts**: Property managers notified instantly of violations

### Infrastructure

- **Cloud Migration Phase 2**: Completed migration of core services to AWS
- **API Response Times**: Average latency reduced by 45%
- **Uptime**: 99.97% across all services in Q2

### Looking Ahead to Q3

The team is focused on AI-powered demand prediction, multi-language support, and the new GLIDE Eye LPR® camera deployment program.`,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    emoji: '📊',
    color: 'from-green-400 to-emerald-500',
    pullQuote: '99.97% uptime across all services — and we\'re just getting started.',
    tags: ['engineering', 'platform', 'glideparcs', 'performance'],
    pdfs: [
      { name: 'Q2 2026 Platform Update Summary', url: '#', size: '2.4 MB' },
      { name: 'API Performance Benchmark Report', url: '#', size: '1.1 MB' },
    ],
  },
  {
    slug: 'india-gcc-team-growth',
    title: 'India GCC Team Grows to 50+ Engineers',
    date: '2026-08-01',
    author: 'India GCC Communications',
    category: 'India GCC',
    excerpt: 'The Hyderabad office has crossed 50 team members across engineering, product, design, and QA — with more roles opening soon.',
    body: `## 50+ and Growing

The India GCC in Hyderabad has officially crossed the 50-person milestone. Our team now spans:

### Team Composition

- **Platform Engineering** (22): Core GLIDEPARCS® development
- **AI/ML** (8): Computer vision and predictive analytics
- **Mobile & Frontend** (10): Consumer apps and dashboards
- **QA & DevOps** (7): Quality engineering and infrastructure
- **Product & Design** (5): Product management and UX design

### We're Still Hiring

We have open roles across all teams. If you know talented engineers who want to build technology that shapes how people experience great places, encourage them to apply.

### Upcoming Milestones

- **September**: New office floor opens (doubles our capacity)
- **October**: First India-led product launch
- **December**: Target of 100 team members`,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    emoji: '📈',
    color: 'from-orange-400 to-red-500',
    pullQuote: 'We\'ve crossed the 50-person milestone — and we\'re targeting 100 by December.',
    tags: ['team', 'growth', 'hiring', 'india-gcc'],
    pdfs: [
      { name: 'India GCC Team Org Chart', url: '#', size: '860 KB' },
    ],
  },
  {
    slug: 'great-places-partner-with-premium',
    title: 'What Makes a Place Great?',
    date: '2026-06-16',
    author: 'Premium Parking Communications',
    category: 'Blog',
    excerpt: 'Great places don\'t happen by accident. Behind every property that feels effortless is a team that treated every square foot — including the parking lot — as a decision worth making well.',
    body: `## What Makes a Place Great?

Great places don't happen by accident. Behind every property that feels effortless is a team that treated every square foot — including the parking lot — as a decision worth making well.

### The Parking Factor

Parking is often the first and last thing a visitor experiences at a property. It sets the tone. A frustrating parking experience colors everything that follows. A seamless one? It disappears into the background — exactly where it belongs.

### Premium Parking's Philosophy

**People, Places, Platform.** These three pillars guide everything we build:

- **People**: Parking should serve people, not the other way around
- **Places**: Great technology enables great places
- **Platform**: GLIDEPARCS® provides the foundation for all of it

### The Result

When parking works, people focus on what matters — enjoying the restaurant, the ballgame, the concert, the shopping trip. That's the Premium Parking difference.`,
    image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=1200&auto=format&fit=crop',
    emoji: '✨',
    color: 'from-amber-400 to-orange-500',
  },
  {
    slug: 'india-gcc-learning-week',
    title: 'India GCC Hosts First GLIDEPARCS® Learning Week',
    date: '2026-08-10',
    author: 'India GCC Communications',
    category: 'India GCC',
    excerpt: 'A week of deep-dive technical sessions, hands-on workshops, and knowledge sharing across the Hyderabad office.',
    body: `## GLIDEPARCS® Learning Week

The India GCC hosted its first Learning Week — five days of technical deep-dives, hands-on workshops, and cross-team knowledge sharing.

### Schedule Highlights

**Monday — Platform Architecture**
- Deep dive into GLIDEPARCS® microservices architecture
- Session management, payments, and compliance pipelines

**Tuesday — AI & Computer Vision**
- How GLIDE Eye LPR® achieves 97%+ accuracy
- Hands-on workshop: training custom ML models

**Wednesday — Mobile & Frontend**
- Building performant React Native apps at scale
- Design systems and component libraries

**Thursday — DevOps & Infrastructure**
- AWS architecture and cloud best practices
- CI/CD pipelines and deployment strategies

**Friday — Innovation Day**
- Lightning talks from team members
- Cross-team project proposals and hackathon planning

### Takeaways

Learning Week was a huge success with 100% team participation. We're making it a quarterly tradition.`,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    emoji: '🎓',
    color: 'from-indigo-400 to-purple-500',
    pullQuote: 'Learning Week was a huge success with 100% team participation.',
    tags: ['learning', 'training', 'workshop', 'india-gcc'],
  },
  {
    slug: 'walkability-parking-tenants',
    title: 'Walkability Gets the Headlines. Parking Keeps the Tenants.',
    date: '2026-06-02',
    author: 'Premium Parking Communications',
    category: 'Blog',
    excerpt: 'The best mixed-use properties don\'t choose between walkability and great parking — they lead on both.',
    body: `## Walkability and Parking: Both Matter

Walkability gets the headlines. But parking keeps the tenants.

### The Reality

The best mixed-use properties don't choose between walkability and great parking — they lead on both. Because the tenant who walks to brunch is often the same one driving home.

### The Data

- 85% of mixed-use property tenants own a vehicle
- Parking satisfaction directly correlates with lease renewal rates
- Properties with smart parking technology see 12% higher tenant retention

### The Solution

GLIDEPARCS® bridges the gap. It provides the technology layer that makes parking invisible — so property managers can focus on creating great places, and tenants can focus on enjoying them.

### The Bottom Line

Great places deserve great parking. And great parking deserves great technology.`,
    image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=1200&auto=format&fit=crop',
    emoji: '🏙️',
    color: 'from-blue-400 to-purple-500',
  },
  {
    slug: 'india-gcc-q3-roadmap',
    title: 'India GCC Q3 2026 Roadmap & Priorities',
    date: '2026-07-01',
    author: 'India GCC Leadership',
    category: 'India GCC',
    excerpt: 'A look at what the Hyderabad team will focus on in Q3 2026 — from platform improvements to new AI capabilities.',
    body: `## Q3 2026 Roadmap

As we enter Q3, here's what the India GCC team will be focused on.

### Platform Priorities

- **GLIDEPARCS® Core v4.0**: Major platform upgrade with improved session management
- **API Gateway v2**: Enhanced rate limiting, caching, and developer experience
- **Multi-Region Support**: Expanding GLIDEPARCS® to new geographic markets

### AI & Innovation

- **Demand Prediction Engine**: ML-powered parking demand forecasting for property owners
- **Computer Vision Pipeline v3**: Next-gen LPR with improved accuracy in challenging conditions
- **Anomaly Detection**: Automated fraud and abuse detection for parking sessions

### India-Led Initiatives

- **Mobile App Redesign**: India team leading the consumer app UX overhaul
- **Internal Tools Platform**: Building tools that accelerate engineering velocity across all teams
- **Open Source Contributions**: Identifying and contributing to projects the GLIDEPARCS® platform depends on

### Team Growth

Targeting 70+ team members by end of Q3. Hiring across all engineering disciplines.`,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    emoji: '🗺️',
    color: 'from-teal-400 to-cyan-500',
    pullQuote: 'Major platform upgrade, new AI capabilities, and 70+ team members by end of Q3.',
    tags: ['roadmap', 'planning', 'india-gcc', 'strategy'],
    pdfs: [
      { name: 'Q3 2026 Roadmap Presentation', url: '#', size: '3.2 MB' },
    ],
  },
];

export const categories = [
  { key: 'All', label: '📰 All News' },
  { key: 'Company', label: '🏢 Company' },
  { key: 'Press', label: '📰 Press' },
  { key: 'Blog', label: '📝 Blog' },
  { key: 'India GCC', label: '🇮🇳 India GCC' },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}
