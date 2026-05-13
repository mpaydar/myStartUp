/**
 * Unsplash hero images for feature pillars (`images.unsplash.com` only — allowed in `next.config`).
 *
 * Photo page references (Unsplash reuses numeric `photo-*` ids; slugs can change):
 * - Reviews: https://unsplash.com/photos/person-holding-black-android-smartphone-wK-elt11pF0
 *   (Brief used `…-hsPFuudRg5I`; that id currently resolves to a different image.)
 * - CRM: intended https://unsplash.com/photos/woman-using-laptop-computer-beside-white-mug-s9CC2SKySJM
 *   (That id currently resolves to a desk-sketch scene; `crm.src` uses a woman + laptop + mug photo instead.)
 * - Insights: https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00
 * - Social: https://unsplash.com/photos/woman-taking-selfie-photo-IF9TK5Uy-KI
 *   (Unsplash titles this as a portrait / smile; alt text is from the product brief.)
 */
export const featureSectionImages = {
  reviews: {
    src: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=960&h=720&fit=crop&q=80",
    alt: "Customer leaving a Google review on their phone",
  },
  crm: {
    src: "https://images.unsplash.com/photo-1545239352-fe85b425f611?w=960&h=720&fit=crop&q=80",
    alt: "Business owner viewing customer profiles on laptop",
  },
  insights: {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=960&h=720&fit=crop&q=80",
    alt: "Monthly review insights dashboard with charts",
  },
  social: {
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=960&h=720&fit=crop&q=80",
    alt: "Happy customer taking a photo to share after salon visit",
  },
} as const;
