/** About page — team members */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageSrc?: string;
  imageAlt?: string;
  bio: string;
  links?: readonly { label: string; href: string }[];
};

function memberInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getTeamMemberInitials(name: string): string {
  return memberInitials(name);
}

export const teamMembers: TeamMember[] = [
  {
    id: "moe-bayat",
    name: "Moe Bayat",
    role: "Founder · Systems Architect & Backend/Data Engineer",
    imageSrc: "/team/moe-bayat.png",
    imageAlt:
      "Moe Bayat, founder of SimBay AI — professional headshot in white shirt and navy tie",
    bio: "Founder of SimBay AI. Systems Architect and Backend/Data Engineer with 4+ years of experience building high-scale, fault-tolerant infrastructure and designing AI software solutions. Background spans privacy-preserving FHE pipelines in research to containerized microservices and SpaCy-powered NLP in production. M.S. in Computer Science from NJIT.",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/in/bayattheanalyst" },
      { label: "GitHub", href: "https://github.com/mpaydar" },
    ],
  },
  {
    id: "sima-alibeygi",
    name: "Sima Alibeygi",
    role: "Executive Manager",
    imageSrc: "/team/sima-alibeygi.png",
    imageAlt:
      "Sima Alibeygi, Executive Manager at SimBay AI — professional headshot in navy blazer",
    bio: "Executive Manager at SimBay AI—leading operations, coordination, and execution across client engagements and AI software initiatives.",
  },
];
