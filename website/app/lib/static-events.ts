import { EventItem } from '@/lib/types'

// Normalize the site events into EventItem[] shape
export const siteUpcomingEvents: EventItem[] = [
  {
    id: 'static-1',
    title: '2025 AAASJ Community Service Scholarship',
    date: '2025-09-30',
    time: 'Apply Now',
    location: 'Online Application',
    description:
      'Apply for our community service scholarship! Awards up to $1,000 for Gold level, $500 for Silver, and $300 for Bronze. Open to high school juniors and seniors demonstrating academic excellence and community service.',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczOFR4CNs8OEtn-OufG9heV5tMCrVmOlIA1iRqmiCjiEYOGVAfZe8pK0NiOu7M5jzhJEVzDF2LZZQlqJpAbz4KVGy5IuuuPs9ktM3xwMPu6WV_qO0iw=w1200-h800-c',
    category: 'Scholarship',
    status: 'upcoming',
    link: '/scholarship',
  },
  {
    id: 'static-2',
    title: 'Mid-autumn & Wellness Festival',
    date: '2025-10-04',
    time: '11:30 AM - 3:30 PM',
    location: 'Hung Fa Supermarket Parking Lot',
    description:
      'Celebrate Mid-autumn Festival with our community! Traditional foods, wellness activities, cultural performances, and family-friendly entertainment. Rain date: October 5, 2025.',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczMG18JZUaRiCRdd_RbTaQ__HgavYKKsoO-R_LR7ApJ6YqrNu1nAlvADNGU7OTCPKqLuqbrU6i2xf3QEMVCGIZP5a7hoo52C0QCTdoNVAwiBJXkkeh4=w1200-h800-c',
    category: 'Festival',
    status: 'upcoming',
  },
]

export const sitePastEvents: EventItem[] = [
  {
    id: 'static-3',
    title: '5th Annual AAPI Heritage Month Festival',
    date: '2025-05-18',
    location: 'Cherry Hill West High School, 2101 Chapel Ave',
    description:
      'Our annual celebration of Asian American and Pacific Islander heritage with cultural performances, food, music, crafts, and community activities. Free admission for the public!',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczPdtMEAYmDkBCokjd9anjC6dbIIUKzLvg2_8vJlKLr9ynpImQ27FGFrjTVSMf2odXN4DHUA6Zpgg9ksUE1giUT9hevGxvrl77uJi1oD-9TPVG-7Dps=w1200-h800-c',
    category: 'Festival',
    status: 'past',
  },
  {
    id: 'static-4',
    title: 'Leon Chen Community Service Scholarship Dinner',
    date: '2025-03-22',
    location: 'TBD - South Jersey',
    description:
      'Annual scholarship dinner honoring community service and supporting Asian American students in South Jersey. An evening of recognition and celebration.',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczOFR4CNs8OEtn-OufG9heV5tMCrVmOlIA1iRqmiCjiEYOGVAfZe8pK0NiOu7M5jzhJEVzDF2LZZQlqJpAbz4KVGy5IuuuPs9ktM3xwMPu6WV_qO0iw=w1200-h800-c',
    category: 'Scholarship',
    status: 'past',
  },
  {
    id: 'static-5',
    title: '4th Annual AAPI Heritage Month Festival',
    date: '2024-05-21',
    location: 'Cherry Hill West High School',
    description:
      'Successful cultural celebration with over 600 community members attending, featuring traditional performances, food vendors, and cultural displays.',
    image: '/pictures/aaasj_header_bg.png',
    category: 'Festival',
    status: 'past',
  },
  {
    id: 'static-6',
    title: 'Community Service Day',
    date: '2024-11-12',
    location: 'Various locations in South Jersey',
    description:
      'Volunteers came together to serve local food banks, community centers, and support families in need throughout South Jersey.',
    image: '/pictures/aaasj_header_bg.png',
    category: 'Service',
    status: 'past',
  },
  {
    id: 'static-7',
    title: 'Leon Chen Scholarship Award Ceremony',
    date: '2024-03-25',
    location: 'Cherry Hill, NJ',
    description:
      'Annual scholarship award ceremony recognizing outstanding Asian American students for their academic achievements and community service contributions.',
    image: '/pictures/aaasj_logo.png',
    category: 'Scholarship',
    status: 'past',
  },
  {
    id: 'static-8',
    title: 'Community Service Day',
    date: '2023-11-12',
    location: 'Various locations in Cherry Hill',
    description:
      'Volunteers came together to serve local food banks and community centers.',
    image:
      'https://imgs.search.brave.com/nS0QOlg7w0I1TkFcx0c8C85jZbSLzTx4RLcRN-088VM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI3/MjcxNTA1OS9waG90/by9kZWxpdmVyeS1w/ZXJzb24tdXNpbmctZmFjZW1hc2stZGVsaXZlcnMtcGFja2FnZS10by1hLXJlc2lkZW5jZS13b21hbi5qcGc_cz02MTJ4NjEyJnc9MCZrPTIwJmM9LUJuQjd3NGNwbnljWjJoRGxhNnpNOVB3eGNOWmV4cUVUbGZ4eDl2dHg5az0',
    category: 'Service',
    status: 'past',
  },
]

export const siteAllEvents: EventItem[] = [...siteUpcomingEvents, ...sitePastEvents]


