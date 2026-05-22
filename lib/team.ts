/** About page — team members */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
  bio: string;
  links?: readonly { label: string; href: string }[];
};

export const teamMembers: TeamMember[] = [
  {
    id: "moe-bayat",
    name: "Moe Bayat",
    role: "Founder · Systems Architect & Backend/Data Engineer",
    imageSrc: "/team/moe-bayat.png",
    imageAlt:
      "Moe Bayat, founder of SimBay AI — professional headshot in white shirt and navy tie",
    bio: "Systems Architect and Backend/Data Engineer with 4+ years of experience building high-scale, fault-tolerant infrastructure. My background ranges from designing privacy-preserving FHE pipelines in research environments to deploying containerized microservices and AI-orchestrated controllers in production. M.S. in Computer Science from NJIT.",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/in/bayattheanalyst" },
      { label: "GitHub", href: "https://github.com/mpaydar" },
    ],
  },
];
