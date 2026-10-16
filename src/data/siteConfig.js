/**
 * Keep optional URLs empty ("") until you have verified the destination is correct and public.
 */
export const siteConfig = {
  name: 'Sebastian',
  brand: 'SebastianTech',
  location: 'Kenya · Open to remote work',
  email: 'oumasebastian80@gmail.com',
  phone: '+254797859542',
  linkedin: '',
  storeUrl: 'https://sebastiantech-store.onrender.com',
  schoolUrl: 'https://sebastiantech-school.onrender.com',
};

/**
 * Screenshots and videos: put the files in public/media/ and list them in `media`.
 *   { type: 'image', src: '/media/store-home.jpg', alt: 'Store home page' }
 *   { type: 'video', src: '/media/store-demo.mp4', poster: '/media/store-demo.jpg' }
 * While `media` is empty, a built-in mock preview is shown instead.
 */
export const projects = [
  {
    number: '01',
    name: 'SebastianTech Store',
    type: 'E-commerce',
    kind: 'store',
    status: 'Live demo',
    description: 'An e-commerce demo built for a fashion retailer: browse the catalogue, discover products and move toward an order.',
    stack: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'Render'],
    demo: siteConfig.storeUrl,
    media: [],
  },
  {
    number: '02',
    name: 'CompTech Learning Platform',
    type: 'Learning platform',
    kind: 'learning',
    status: 'Live demo',
    description: 'A learning platform bringing notes, lessons, practical activities and assessments together, with learner and admin sides.',
    stack: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Cloudinary'],
    demo: siteConfig.schoolUrl,
    media: [],
  },
  {
    number: '03',
    name: 'StudentBot',
    type: 'AI automation',
    kind: 'bot',
    status: 'Working prototype',
    description: 'A WhatsApp group assistant that gives students explanations and quizzes when it is tagged in a chat.',
    stack: ['Node.js', 'Baileys', 'AI APIs'],
    demo: '',
    media: [],
  },
];

export const skillGroups = [
  {
    title: 'Frontend Development',
    tagline: 'Interfaces built for real people.',
    intro: 'Creating responsive, intuitive experiences that look good and work smoothly across devices.',
    skills: ['HTML5 & CSS3', 'JavaScript', 'React', 'Responsive UI development'],
  },
  {
    title: 'Backend & Data',
    tagline: 'The technology that makes it work.',
    intro: 'Building the logic, APIs, and data systems that power secure and functional web applications.',
    skills: ['Node.js & Express', 'REST API development', 'MongoDB & Mongoose', 'JWT authentication'],
  },
  {
    title: 'Tools & Integrations',
    tagline: 'Connecting ideas to the real world.',
    intro: 'Integrating essential services, deploying applications, and adding capabilities that make products more useful.',
    skills: ['Git & GitHub', 'Cloudinary integration', 'Render deployment', 'AI API integration'],
  },
];
