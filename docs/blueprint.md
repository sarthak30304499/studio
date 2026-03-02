# **App Name**: SUPERNOVA

## Core Features:

- Resume Analyzer: Analyze user resumes with an AI tool to provide ATS compatibility scores and personalized improvement suggestions for target roles.
- Job & Internship Matcher: An AI tool to match user profiles with relevant job and internship opportunities, allowing for detailed filtering.
- Interview Intelligence: Utilize an AI tool to generate interview questions, provide model answers, and offer AI feedback on user practice responses.
- Higher Education Roadmap Assistant: An AI tool to generate personalized roadmaps for academic pursuits, including milestones, resources, and university shortlists.
- Career Intelligence & Skill Gap Analyzer: An AI tool to visualize skill proficiencies, identify gaps against career benchmarks, and recommend learning resources.
- User Authentication & Personalized Dashboard: Enable secure user sign-up, login, and a centralized dashboard displaying progress and quick access to tools.
- Comprehensive User Profile Management: Allow users to manage their profiles, upload documents, set preferences, and track their career acceleration journey.

## Style Guidelines:

- Color scheme is dark with `#07070D` (a deep, desaturated indigo) as the primary page background. Surface elements like cards use `#0F0F1A` and elevated elements use `#161624`.
- Primary accent color is a vibrant indigo (`#6C63FF`), used for call-to-action buttons, active links, and highlights. A secondary accent `#9B94FF` is used for hover states and supporting highlights.
- Primary text is `#EEEEF5` (off-white), secondary text for labels and metadata is `#8A8AA0`, and placeholders use `#44445A`.
- All headlines, body text, and UI labels use 'Inter' (sans-serif), imported globally from Google Fonts with weights 400, 500, 600, 700, and 800. Code snippets will use 'JetBrains Mono' (monospace) with weight 400.
- Utilize 'Lucide outline icons' for navigation and functional elements. Specific contextual icons include arrows, play buttons, checkmarks, Xs, bookmarks, share icons, flame icons, and external link indicators.
- A base spacing unit of 4px is used. Component paddings vary: 16px (small), 24px (medium), and 32-40px (large). Section vertical padding is 112px. The maximum page width is 1280px with auto horizontal margins and 24px side gutters on mobile.
- Layout uses a 12-column grid with 24px gutters on desktop, 16px on tablet, and a single column on mobile. Public navigation bar is 64px tall and sticky, while authenticated app pages feature a 220px fixed sidebar collapsible to 64px.
- All CSS transitions are `ease-out` with a duration of 150-200ms. Scroll-triggered section entrances animate opacity from 0 to 1 and translateY from 20px to 0, with children staggered at 80ms.
- ATS score rings animate their SVG stroke-dashoffset over 1.4s with `ease-out`. Skeleton loaders for asynchronous content are `#161624` with a `#1E1E30` shimmer animation lasting 1.5s indefinitely.