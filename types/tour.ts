export interface TourDeparture {
  date: string
  nights: number
  hotel: string
  mealPlan: string
  seatsLeft: number
  priceFromUsd: number
}

export interface TourPackage {
  id: string
  title: string
  badge: string
  country: string
  city: string
  description: string
  shortDescription: string
  features: string[]
  included: string[]
  notIncluded: string[]
  itinerary: string[]
  heroImage: string
  gallery: string[]
  durationNights: number
  hotelClass: string
  availableFrom: string
  availableTo: string
  departures: TourDeparture[]
  priceFromUsd: number
  bestFor?: string
  visaInfo?: string
  flightInfo?: string
  transferInfo?: string
  cancellationPolicy?: string
  importantNotes?: string[]
  faq?: string[]
}

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  image: string
  publishedAt: string
}

export interface DestinationItem {
  id: string
  title: string
  tagline: string
  image: string
  linkedTourId: string
  description: string
}

export interface ReviewItem {
  id: string
  author: string
  text: string
}

export interface WhyUsItem {
  id: string
  title: string
  description: string
  icon?: string
}

export interface SiteSettings {
  brandMain: string
  brandSub: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  contactPhone: string
  contactEmail: string
  contactAddress: string
  aboutTitle: string
  aboutText: string
}

export interface FooterSocialLink {
  id: string
  label: string
  href: string
}

export interface FooterSettings {
  supportTitle: string
  supportShortNumber: string
  supportPhone: string
  supportEmail: string
  infoTitle: string
  infoLinks: string[]
  mediaTitle: string
  mediaLinks: string[]
  partnersTitle: string
  partnersLinks: string[]
  socialsTitle: string
  socials: FooterSocialLink[]
  copyright: string
}

export interface SiteContent {
  settings: SiteSettings
  footer: FooterSettings
  tours: TourPackage[]
  news: NewsItem[]
  destinations: DestinationItem[]
  reviews: ReviewItem[]
  whyUs: WhyUsItem[]
  updatedAt: string
}
