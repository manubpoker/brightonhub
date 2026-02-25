import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Heart, CreditCard, Bus, TrainFront, Stethoscope, HandHeart, Tag, ShoppingBag, Music, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Student Hub — Brighton Hub',
  description: 'Essential resources, discounts, and guides for University of Sussex and University of Brighton students.',
};

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

const studentLifeResources = [
  {
    title: 'GP Registration',
    icon: Stethoscope,
    description: 'Register with a local GP as soon as you arrive. You can find practices near campus or your accommodation.',
    link: { label: 'NHS Find a GP', url: 'https://www.nhs.uk/service-search/find-a-gp' },
  },
  {
    title: 'Council Tax Exemption',
    icon: CreditCard,
    description: 'Full-time students are exempt from council tax. Get a certificate from your uni and notify the council.',
    link: { label: 'Brighton & Hove Council', url: 'https://www.brighton-hove.gov.uk/council-tax/discounts-and-exemptions/student-exemption' },
  },
  {
    title: 'Bus Passes',
    icon: Bus,
    description: 'Brighton & Hove Buses offer term-time and annual student Saver passes at discounted rates.',
    link: { label: 'Student Saver', url: 'https://www.buses.co.uk/student-saver' },
  },
  {
    title: 'Train Discounts',
    icon: TrainFront,
    description: 'Save 1/3 on rail fares across Great Britain with a 16-25 Railcard (or 26-30 Railcard for postgrads).',
    link: { label: '16-25 Railcard', url: 'https://www.16-25railcard.co.uk/' },
  },
  {
    title: 'Mental Health Support',
    icon: Heart,
    description: 'Both universities offer free counselling services. Samaritans (116 123) are available 24/7.',
    link: { label: 'Samaritans', url: 'https://www.samaritans.org/' },
  },
  {
    title: 'Hardship & Emergency Funds',
    icon: HandHeart,
    description: 'Struggling financially? Your Students\' Union can help with emergency funds, food banks, and advice.',
    link: { label: 'Sussex SU Advice', url: 'https://www.sussexstudent.com/advice/' },
  },
];

const venues = [
  { name: 'Pryzm', note: 'Multi-floor club, regular student nights' },
  { name: 'Coalition', note: 'Live music & club nights on the seafront' },
  { name: 'Patterns', note: 'Underground club, electronic & indie' },
  { name: 'Concorde 2', note: 'Iconic live venue on Madeira Drive' },
  { name: 'The Arch', note: 'Student favourite, cheap drinks' },
  { name: 'Komedia', note: 'Comedy, cabaret & live music' },
];

export default function StudentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-orange-600" />
          Student Hub
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Essential resources, discounts, and local knowledge for University of Sussex
          and University of Brighton students living in Brighton &amp; Hove.
        </p>
      </div>

      {/* University Services */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-orange-600" />
          University Services
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Sussex */}
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">University of Sussex</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p><ExtLink href="https://sussex.ac.uk/students/">Student Portal</ExtLink> — Timetables, email, Sussex Direct</p>
              <p><ExtLink href="https://www.sussexstudent.com/">Sussex Students&apos; Union</ExtLink> — Events, societies, support</p>
              <p><ExtLink href="https://www.sussex.ac.uk/library/">Library</ExtLink> — 24/7 access during term, online resources</p>
              <p><ExtLink href="https://www.sussex.ac.uk/about/term-dates">Term Dates</ExtLink> — Academic calendar &amp; key dates</p>
            </CardContent>
          </Card>
          {/* Brighton */}
          <Card className="border-l-4 border-l-emerald-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">University of Brighton</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p><ExtLink href="https://studentcentral.brighton.ac.uk/">Student Portal</ExtLink> — StudentCentral, Blackboard, email</p>
              <p><ExtLink href="https://www.brightonsu.com/">Brighton SU</ExtLink> — Events, societies, advice</p>
              <p><ExtLink href="https://www.brighton.ac.uk/studying-here/library/index.aspx">Library</ExtLink> — Multiple campus libraries &amp; e-resources</p>
              <p><ExtLink href="https://www.brighton.ac.uk/studying-here/term-dates/index.aspx">Term Dates</ExtLink> — Academic calendar &amp; key dates</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Student Life Essentials */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Student Life Essentials</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studentLifeResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card key={resource.title}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-orange-50 p-2">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{resource.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                      <div className="mt-2">
                        <ExtLink href={resource.link.url}>
                          <span className="text-xs">{resource.link.label}</span>
                        </ExtLink>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Discounts & Deals */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5 text-orange-600" />
          Discounts &amp; Deals
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">TOTUM / NUS Card</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>
                The <ExtLink href="https://www.totum.com/">TOTUM card</ExtLink> (formerly NUS Extra)
                gives you access to hundreds of student discounts — restaurants, shops, tech, travel, and more.
              </p>
              <p>Available from your Students&apos; Union or online for around £15/year.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-orange-600" />
                Budget-Friendly Brighton
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p><strong>North Laine</strong> — Independent shops, vintage stores, and affordable eateries</p>
              <p><strong>London Road</strong> — Budget supermarkets, street food, and discount stores</p>
              <p><strong>Open Market</strong> — Fresh produce, street food, and local traders</p>
              <p><strong>Charity shops</strong> — Kensington Gardens &amp; North Laine are hotspots for second-hand finds</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Nightlife & Social */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Music className="h-5 w-5 text-orange-600" />
          Nightlife &amp; Social
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Brighton&apos;s nightlife is one of the best on the south coast. Most venues offer
          weekly student nights with discounted entry and drinks.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Card key={venue.name}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{venue.name}</h3>
                  <p className="text-xs text-gray-500">{venue.note}</p>
                </div>
                <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700 shrink-0">
                  Student nights
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
