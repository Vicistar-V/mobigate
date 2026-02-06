export interface ConstitutionSection {
  id: string;
  type: "article" | "section" | "subsection" | "clause";
  number: string;
  title: string;
  content: string;
  parent?: string;
}

export const constitutionSections: ConstitutionSection[] = [
  {
    id: "preamble",
    type: "article",
    number: "",
    title: "Preamble",
    content: "We, the members of this distinguished community, in recognition of our shared heritage, common aspirations, and collective responsibility to one another, do hereby establish this Constitution to promote unity, progress, and the welfare of all members. This document shall serve as the supreme guiding principle for the governance and administration of our community."
  },
  {
    id: "art-1",
    type: "article",
    number: "ARTICLE I",
    title: "Name and Identity",
    content: "The name of this organization shall be the [Community Name]. The community shall be identified by its official logo, colors, and motto as approved by the General Assembly."
  },
  {
    id: "art-2",
    type: "article",
    number: "ARTICLE II",
    title: "Objectives and Purpose",
    content: "The primary objectives of this community shall be:"
  },
  {
    id: "art-2-sec-1",
    type: "section",
    number: "Section 1",
    title: "Unity and Brotherhood",
    content: "To foster unity, brotherhood, and sisterhood among all members, promoting mutual understanding and cooperation.",
    parent: "art-2"
  },
  {
    id: "art-2-sec-2",
    type: "section",
    number: "Section 2",
    title: "Development and Progress",
    content: "To promote the social, economic, educational, and infrastructural development of our community and its members.",
    parent: "art-2"
  },
  {
    id: "art-2-sec-3",
    type: "section",
    number: "Section 3",
    title: "Cultural Heritage",
    content: "To preserve, protect, and promote our cultural heritage, traditions, and values for present and future generations.",
    parent: "art-2"
  },
  {
    id: "art-2-sec-4",
    type: "section",
    number: "Section 4",
    title: "Welfare and Support",
    content: "To provide mutual support, assistance, and welfare services to members in times of need, celebration, or crisis.",
    parent: "art-2"
  },
  {
    id: "art-3",
    type: "article",
    number: "ARTICLE III",
    title: "Membership",
    content: "Membership in this community shall be governed by the following provisions:"
  },
  {
    id: "art-3-sec-1",
    type: "section",
    number: "Section 1",
    title: "Eligibility",
    content: "Membership shall be open to all persons who meet the criteria established in the membership policy. This includes individuals by birth, marriage, adoption, or special recognition by the General Assembly.",
    parent: "art-3"
  },
  {
    id: "art-3-sec-2",
    type: "section",
    number: "Section 2",
    title: "Categories of Membership",
    content: "There shall be the following categories of membership: (a) Full Members - persons who have attained the age of 18 years and have fulfilled all membership requirements; (b) Youth Members - persons between the ages of 13 and 17 years; (c) Junior Members - children below the age of 13 years; (d) Honorary Members - distinguished individuals recognized for exceptional contributions.",
    parent: "art-3"
  },
  {
    id: "art-3-sec-3",
    type: "section",
    number: "Section 3",
    title: "Rights and Privileges",
    content: "All full members in good standing shall have the right to: (a) Participate in community meetings and activities; (b) Vote in elections and on community matters; (c) Hold office if eligible; (d) Access community resources and facilities; (e) Receive welfare support as provided by community programs.",
    parent: "art-3"
  },
  {
    id: "art-3-sec-4",
    type: "section",
    number: "Section 4",
    title: "Obligations and Duties",
    content: "Every member shall: (a) Pay all dues, levies, and assessments as determined by the community; (b) Conduct themselves in a manner that upholds the dignity and reputation of the community; (c) Participate actively in community development initiatives; (d) Respect and abide by this Constitution and all community regulations.",
    parent: "art-3"
  },
  {
    id: "art-4",
    type: "article",
    number: "ARTICLE IV",
    title: "Governance and Administration",
    content: "The community shall be governed through a system of elected and appointed officers organized into various organs."
  },
  {
    id: "art-4-sec-1",
    type: "section",
    number: "Section 1",
    title: "The General Assembly",
    content: "The General Assembly shall be the supreme decision-making body of the community, consisting of all full members in good standing. It shall meet at least once annually to deliberate on community affairs, elect officers, and approve major decisions.",
    parent: "art-4"
  },
  {
    id: "art-4-sec-2",
    type: "section",
    number: "Section 2",
    title: "The Executive Committee",
    content: "There shall be an Executive Committee responsible for the day-to-day administration of community affairs. The Executive Committee shall consist of: (a) President/Chairman; (b) Vice President/Vice Chairman; (c) Secretary General; (d) Financial Secretary; (e) Treasurer; (f) Public Relations Officer; (g) Other officers as determined by the General Assembly.",
    parent: "art-4"
  },
  {
    id: "art-4-sec-3",
    type: "section",
    number: "Section 3",
    title: "Tenure of Office",
    content: "The tenure of elected officers shall be determined by the General Assembly but shall not exceed four (4) years per term, with eligibility for re-election for one additional term only.",
    parent: "art-4"
  },
  {
    id: "art-5",
    type: "article",
    number: "ARTICLE V",
    title: "Elections and Voting",
    content: "Elections shall be conducted in a free, fair, and transparent manner in accordance with the electoral guidelines."
  },
  {
    id: "art-5-sec-1",
    type: "section",
    number: "Section 1",
    title: "Electoral Commission",
    content: "An independent Electoral Commission shall be constituted to organize and supervise all elections. The Commission shall ensure credibility, transparency, and adherence to electoral procedures.",
    parent: "art-5"
  },
  {
    id: "art-5-sec-2",
    type: "section",
    number: "Section 2",
    title: "Voting Rights",
    content: "Every full member in good standing who has fulfilled their financial obligations shall be entitled to vote. Voting may be conducted in person, by proxy (where permitted), or through electronic means as approved by the Electoral Commission.",
    parent: "art-5"
  },
  {
    id: "art-6",
    type: "article",
    number: "ARTICLE VI",
    title: "Finances and Property",
    content: "The financial affairs of the community shall be managed with transparency, accountability, and prudence."
  },
  {
    id: "art-6-sec-1",
    type: "section",
    number: "Section 1",
    title: "Revenue Sources",
    content: "The community's revenue shall be derived from: (a) Membership dues and levies; (b) Fundraising activities and donations; (c) Investment income; (d) Grants and sponsorships; (e) Any other lawful means approved by the General Assembly.",
    parent: "art-6"
  },
  {
    id: "art-6-sec-2",
    type: "section",
    number: "Section 2",
    title: "Financial Management",
    content: "All community funds shall be kept in approved financial institutions. Expenditures above a threshold amount shall require approval by the Executive Committee. Annual financial reports shall be presented to the General Assembly for approval.",
    parent: "art-6"
  },
  {
    id: "art-6-sec-3",
    type: "section",
    number: "Section 3",
    title: "Property Ownership",
    content: "All property, assets, and resources acquired by or in the name of the community shall be held in trust for the benefit of all members and shall not be appropriated by any individual.",
    parent: "art-6"
  },
  {
    id: "art-7",
    type: "article",
    number: "ARTICLE VII",
    title: "Meetings",
    content: "Community meetings shall be conducted in accordance with proper procedures to ensure orderly deliberations."
  },
  {
    id: "art-7-sec-1",
    type: "section",
    number: "Section 1",
    title: "Annual General Meeting",
    content: "An Annual General Meeting (AGM) shall be held once every year at a date, time, and venue determined by the Executive Committee. Notice of the AGM shall be given to all members at least thirty (30) days in advance.",
    parent: "art-7"
  },
  {
    id: "art-7-sec-2",
    type: "section",
    number: "Section 2",
    title: "Special Meetings",
    content: "Special meetings may be convened by the Executive Committee or upon written request of at least one-third (1/3) of full members in good standing. Notice shall be given at least fourteen (14) days in advance.",
    parent: "art-7"
  },
  {
    id: "art-7-sec-3",
    type: "section",
    number: "Section 3",
    title: "Quorum",
    content: "A quorum for the General Assembly shall be one-third (1/3) of full members in good standing. For Executive Committee meetings, a simple majority of committee members shall constitute a quorum.",
    parent: "art-7"
  },
  {
    id: "art-8",
    type: "article",
    number: "ARTICLE VIII",
    title: "Amendment of Constitution",
    content: "This Constitution may be amended by a two-thirds (2/3) majority vote of full members present and voting at a General Assembly meeting, provided that notice of the proposed amendment has been given at least sixty (60) days in advance."
  },
  {
    id: "art-9",
    type: "article",
    number: "ARTICLE IX",
    title: "Dispute Resolution",
    content: "All disputes arising from the interpretation or application of this Constitution shall be resolved through internal mediation and arbitration mechanisms before resorting to external adjudication."
  },
  {
    id: "art-10",
    type: "article",
    number: "ARTICLE X",
    title: "Dissolution",
    content: "The community may only be dissolved by a three-quarters (3/4) majority vote of all full members at a General Assembly specifically convened for that purpose. Upon dissolution, all assets shall be distributed for charitable purposes or to a similar organization as determined by the General Assembly."
  }
];

export const constitutionMetadata = {
  title: "Constitution of Ndigbo Progressive Union",
  adoptedDate: new Date("2024-01-15"),
  lastAmendedDate: new Date("2024-06-20"),
  version: "2.1",
  effectiveDate: new Date("2024-07-01")
};
