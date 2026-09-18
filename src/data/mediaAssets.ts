export interface MediaAsset {
  id: string;
  category: 'brand' | 'hero' | 'equipment' | 'rehabilitation' | 'field' | 'academy';
  title: string;
  description: string;
  url: string;
  aspectRatio: string;
  tags: string[];
}

export const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'asset-logo-primary',
    category: 'brand',
    title: 'Bharat PetroWork Primary Corporate Emblem',
    description: 'Vector SVG shield with hydrocarbon drop, precision gear teeth, and safety star.',
    url: 'https://bharatpetrowork.com/assets/bpw-emblem.svg',
    aspectRatio: '1:1',
    tags: ['logo', 'emblem', 'brand', 'official']
  },
  {
    id: 'asset-hero-forecourt',
    category: 'hero',
    title: 'Modern Turnkey Retail Outlet Forecourt',
    description: 'High-speed multi-product dispenser canopy with LED lighting and RCC driveway.',
    url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16:9',
    tags: ['retail-pump', 'forecourt', 'canopy', 'hero']
  },
  {
    id: 'asset-tank-rehab',
    category: 'rehabilitation',
    title: 'Underground Tank Internal Lining & Integrity Scanning',
    description: 'Robotic de-sludging and ultrasonic wall thickness non-destructive testing.',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16:9',
    tags: ['tank', 'rehabilitation', 'epoxy', 'ultrasonic']
  },
  {
    id: 'asset-dispenser-tech',
    category: 'equipment',
    title: 'Precision Multi-Product Fuel Dispenser (MPD)',
    description: 'OIML certified electronic meter, FLP flameproof junction box, and pulser.',
    url: 'https://images.unsplash.com/photo-1527018607637-02363bc8063a?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '4:3',
    tags: ['dispenser', 'mpd', 'meter', 'equipment']
  },
  {
    id: 'asset-field-van',
    category: 'field',
    title: 'Bharat PetroWork Mobile Emergency Response Service Van',
    description: 'Rapid 45-min SLA dispatch van equipped with LOTO safety tools and spare pulsers.',
    url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16:9',
    tags: ['service-van', 'emergency', 'dispatch', 'engineer']
  },
  {
    id: 'asset-academy-lab',
    category: 'academy',
    title: 'Petroleum Safety & Hazardous Zone Training Lab',
    description: 'Simulated explosive zone FLP wiring, cable glanding, and ATG console calibration.',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16:9',
    tags: ['academy', 'training', 'oisd', 'certification']
  }
];
