export const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imageUrl: "/blank-document.svg",
    initialContent: "<p></p>",
  },
  {
    id: "software-proposal",
    label: "Software development proposal",
    imageUrl: "/software-proposal.svg",
    initialContent: `
      <h1>Software Development Proposal</h1>
      <h2>Project Overview</h2>
      <p>Brief description of the software project goes here.</p>
      <h2>Objectives</h2>
      <ul>
        <li>Objective 1</li>
        <li>Objective 2</li>
        <li>Objective 3</li>
      </ul>
      <h2>Proposed Solution</h2>
      <p>Detailed explanation of the proposed software solution.</p>
      <h2>Timeline</h2>
      <table>
        <tr>
          <th>Phase</th>
          <th>Duration</th>
        </tr>
        <tr>
          <td>Planning</td>
          <td>2 weeks</td>
        </tr>
        <tr>
          <td>Development</td>
          <td>8 weeks</td>
        </tr>
        <tr>
          <td>Testing</td>
          <td>2 weeks</td>
        </tr>
      </table>
      <h2>Budget</h2>
      <p>Proposed budget details go here.</p>
    `,
  },
  {
    id: "project-proposal",
    label: "Project proposal",
    imageUrl: "/project-proposal.svg",
    initialContent: `
      <h1>Project Proposal</h1>
      <h2>Executive Summary</h2>
      <p>A brief overview of the project proposal goes here.</p>
      <h2>Project Description</h2>
      <p>Detailed description of the project, its goals, and expected outcomes.</p>
      <h2>Methodology</h2>
      <ol>
        <li>Step 1</li>
        <li>Step 2</li>
        <li>Step 3</li>
      </ol>
      <h2>Resources Required</h2>
      <ul>
        <li>Human Resources</li>
        <li>Material Resources</li>
        <li>Financial Resources</li>
      </ul>
      <h2>Timeline</h2>
      <p>Project timeline and milestones go here.</p>
      <h2>Budget</h2>
      <p>Detailed budget breakdown goes here.</p>
    `,
  },
  {
    id: "business-letter",
    label: "Business Letter",
    imageUrl: "/business-letter.svg",
    initialContent: `
      <div class="letter-head">
        <p>Your Name</p>
        <p>Your Address</p>
        <p>City, State ZIP Code</p>
      </div>
      <p class="date">[Current Date]</p>
      <div class="recipient">
        <p>Recipient Name</p>
        <p>Company Name</p>
        <p>Address</p>
        <p>City, State ZIP Code</p>
      </div>
      <p>Dear [Recipient's Name],</p>
      <p>Introduction paragraph goes here.</p>
      <p>Body paragraph 1 goes here.</p>
      <p>Body paragraph 2 goes here.</p>
      <p>Closing paragraph goes here.</p>
      <p>Sincerely,</p>
      <p>[Your Name]</p>
    `,
  },
  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
    initialContent: `
      <h1>Your Name</h1>
      <p>Email: your.email@example.com | Phone: (123) 456-7890</p>
      <h2>Professional Summary</h2>
      <p>A brief summary of your professional experience and skills goes here.</p>
      <h2>Work Experience</h2>
      <h3>Job Title, Company Name</h3>
      <p>Employment Period</p>
      <ul>
        <li>Key responsibility or achievement 1</li>
        <li>Key responsibility or achievement 2</li>
        <li>Key responsibility or achievement 3</li>
      </ul>
      <h2>Education</h2>
      <h3>Degree, Major</h3>
      <p>University Name, Graduation Year</p>
      <h2>Skills</h2>
      <ul>
        <li>Skill 1</li>
        <li>Skill 2</li>
        <li>Skill 3</li>
      </ul>
    `,
  },
  {
    id: "cover-letter",
    label: "Cover letter",
    imageUrl: "/cover-letter.svg",
    initialContent: `
      <div class="letter-head">
        <p>Your Name</p>
        <p>Your Address</p>
        <p>City, State ZIP Code</p>
        <p>Your Email</p>
        <p>Your Phone Number</p>
      </div>
      <p class="date">[Current Date]</p>
      <div class="recipient">
        <p>Hiring Manager's Name</p>
        <p>Company Name</p>
        <p>Company Address</p>
        <p>City, State ZIP Code</p>
      </div>
      <p>Dear Hiring Manager,</p>
      <p>Opening paragraph: Mention the position you're applying for and how you found out about it.</p>
      <p>Second paragraph: Highlight your relevant skills and experiences that make you a strong candidate for the position.</p>
      <p>Third paragraph: Explain why you're interested in the position and the company.</p>
      <p>Closing paragraph: Thank the reader for their time and consideration. Mention that you look forward to discussing the opportunity further.</p>
      <p>Sincerely,</p>
      <p>[Your Name]</p>
    `,
  },
  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
    initialContent: `
      <div class="sender-info">
        <p>Your Name</p>
        <p>Your Address</p>
        <p>City, State ZIP Code</p>
      </div>
      <p class="date">[Current Date]</p>
      <div class="recipient-info">
        <p>Recipient's Name</p>
        <p>Recipient's Address</p>
        <p>City, State ZIP Code</p>
      </div>
      <p>Dear [Recipient's Name],</p>
      <p>First paragraph: Introduce yourself and state the purpose of your letter.</p>
      <p>Second paragraph: Provide more details or context related to the purpose of your letter.</p>
      <p>Third paragraph: Conclude your letter, summarizing your main points or stating any actions you expect from the recipient.</p>
      <p>Sincerely,</p>
      <p>[Your Name]</p>
      <p class="signature">[Your Signature]</p>
    `,
  },
];
