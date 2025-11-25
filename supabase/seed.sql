-- Seed file for PromptValley
-- Clean up existing data
TRUNCATE TABLE prompt_usage CASCADE;
TRUNCATE TABLE favorites CASCADE;
TRUNCATE TABLE prompts CASCADE;
TRUNCATE TABLE collections CASCADE;

-- Insert curated prompts based on website design

-- IMAGE GENERATION PROMPTS (Midjourney/Stable Diffusion)
INSERT INTO prompts (title, description, content, category, platform, is_public, is_curated, is_featured, image_url, example_output) VALUES
(
  'Portrait Photography',
  'Create stunning portrait photographs with professional lighting and composition',
  'Professional portrait photography, studio lighting, shallow depth of field, 85mm lens, f/1.8, soft natural light, high detail, photorealistic, 8k resolution',
  'photography',
  'midjourney',
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'A professional studio portrait with dramatic lighting, showing fine detail and bokeh background'
),
(
  'Concept Spaceships',
  'Design futuristic spacecraft and vehicles for sci-fi projects',
  'Futuristic spaceship design, sleek aerodynamic hull, glowing engines, metallic surfaces, sci-fi concept art, detailed mechanical parts, space background, cinematic lighting, 4k, highly detailed',
  'image_generation',
  'midjourney',
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80',
  'A sleek sci-fi spacecraft with glowing propulsion systems against a starry background'
),
(
  'Lonely Character Scenes',
  'Create emotional character scenes with atmospheric storytelling',
  'Solitary figure standing alone, vast empty landscape, melancholic atmosphere, cinematic composition, golden hour lighting, sense of isolation, emotional storytelling, wide angle, highly detailed, 8k',
  'character_design',
  'midjourney',
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&q=80',
  'A lone figure silhouetted against a vast desert landscape during sunset'
),
(
  'Creating Lifestyle Brands',
  'Generate brand imagery for lifestyle and wellness businesses',
  'Minimalist lifestyle brand photography, clean aesthetic, natural materials, soft pastel colors, modern interior, product placement, professional styling, bright natural light, instagram-worthy, high resolution',
  'photography',
  'stable_diffusion',
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
  'Clean, minimalist lifestyle product photography with natural lighting and neutral tones'
),
(
  'Fantasy Character Design',
  'Design unique fantasy characters with detailed features and armor',
  'Fantasy character design, detailed armor, magical elements, epic composition, dramatic lighting, high fantasy style, intricate details, concept art, digital painting, artstation trending, 4k',
  'character_design',
  'midjourney',
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
  'An elaborately armored fantasy warrior with glowing magical elements'
),
(
  'Architectural Visualization',
  'Create photorealistic architectural renderings',
  'Modern architecture, glass and concrete, minimalist design, natural lighting, photorealistic rendering, professional photography, blue sky, landscaping, ultra high detail, 8k resolution',
  'image_generation',
  'stable_diffusion',
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80',
  'A stunning modern building with glass facades reflecting the sky'
),

-- CONTENT CREATION PROMPTS
(
  'Blog Post Writer',
  'Generate engaging blog posts on any topic with SEO optimization',
  'Write a comprehensive blog post about [TOPIC]. Include an attention-grabbing introduction, 3-5 main sections with subheadings, practical examples, and a compelling conclusion. Optimize for SEO with relevant keywords. Target audience: [AUDIENCE]. Tone: [TONE - professional/casual/friendly].',
  'writing',
  'chatgpt',
  true,
  true,
  true,
  NULL,
  NULL
),
(
  'Social Media Caption Generator',
  'Create engaging social media captions with hashtags',
  'Create 3 engaging social media captions for [PLATFORM - Instagram/LinkedIn/Twitter] about [TOPIC]. Each caption should:
- Hook the reader in the first line
- Include relevant emojis
- Have 3-5 relevant hashtags
- Include a call-to-action
- Match a [TONE - professional/casual/inspiring] tone',
  'marketing',
  'chatgpt',
  true,
  true,
  true,
  NULL,
  NULL
),
(
  'LinkedIn Post Creator',
  'Write engaging LinkedIn posts that drive engagement',
  'Create a LinkedIn post about [TOPIC] that:
- Starts with a hook (question, bold statement, or story)
- Shares 2-3 key insights or lessons
- Uses short paragraphs for readability
- Includes a call-to-action
- Stays under 1300 characters

Tone: [PROFESSIONAL/THOUGHT LEADER/INSPIRATIONAL]
Target audience: [AUDIENCE]',
  'marketing',
  'chatgpt',
  true,
  true,
  false,
  NULL,
  NULL
),
(
  'Product Description Writer',
  'Create compelling product descriptions that convert',
  'Write a persuasive product description for [PRODUCT NAME]. Include:
- Attention-grabbing headline
- 2-3 key benefits (not features)
- Emotional appeal
- Social proof element
- Strong call-to-action

Product details: [DETAILS]
Target customer: [CUSTOMER PERSONA]
Unique selling point: [USP]

Keep it under 150 words, conversational, and benefit-focused.',
  'marketing',
  'chatgpt',
  true,
  true,
  true,
  NULL,
  NULL
),

-- CODING PROMPTS
(
  'Code Review Assistant',
  'Get detailed code reviews with improvement suggestions',
  'Review the following code and provide:
1. Overall quality assessment
2. Potential bugs or issues
3. Performance improvements
4. Best practices violations
5. Security concerns
6. Suggested refactoring

Code:
```
[PASTE CODE HERE]
```

Language: [PROGRAMMING LANGUAGE]',
  'coding',
  'claude',
  true,
  true,
  true,
  NULL,
  NULL
),
(
  'SQL Query Generator',
  'Convert natural language to SQL queries',
  'Convert this request into an optimized SQL query:

Request: [DESCRIBE WHAT DATA YOU NEED]

Database schema:
[TABLE STRUCTURE]

Requirements:
- Use proper joins where needed
- Include relevant WHERE clauses
- Optimize for performance
- Add comments explaining complex parts
- Follow [DATABASE - PostgreSQL/MySQL/SQLite] syntax',
  'coding',
  'claude',
  true,
  true,
  false,
  NULL,
  NULL
),
(
  'API Documentation Generator',
  'Generate comprehensive API documentation from code',
  'Generate complete API documentation for the following endpoint:

Endpoint: [ENDPOINT URL]
Method: [GET/POST/PUT/DELETE]
Code:
```
[PASTE CODE HERE]
```

Include:
- Description
- Request parameters
- Request body schema
- Response schema
- Example request
- Example response
- Error codes
- Authentication requirements',
  'coding',
  'claude',
  true,
  true,
  false,
  NULL,
  NULL
),

-- PRODUCTIVITY PROMPTS
(
  'Meeting Notes Summarizer',
  'Transform meeting notes into actionable summaries',
  'Summarize the following meeting notes into:
1. Key discussion points
2. Decisions made
3. Action items (with owners if mentioned)
4. Follow-up questions
5. Next steps

Meeting notes:
[PASTE NOTES HERE]

Format the output in a clear, scannable structure.',
  'productivity',
  'claude',
  true,
  true,
  false,
  NULL,
  NULL
),
(
  'Email Subject Line Generator',
  'Create compelling email subject lines that increase open rates',
  'Generate 10 compelling email subject lines for [EMAIL PURPOSE - newsletter/product launch/announcement]. Target audience: [AUDIENCE]. Goal: [GOAL - increase opens/drive clicks/build anticipation]. Include a mix of:
- Curiosity-driven
- Value-focused
- Urgency-based
- Personalization

Keep under 50 characters.',
  'marketing',
  'chatgpt',
  true,
  true,
  false,
  NULL,
  NULL
),
(
  'User Story Writer',
  'Generate clear user stories for agile development',
  'Create a detailed user story for: [FEATURE DESCRIPTION]

Format:
**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [Criteria 1]
- [Criteria 2]
- [Criteria 3]

**Technical Notes:**
[Any technical considerations]

**Definition of Done:**
[Completion criteria]',
  'productivity',
  'claude',
  true,
  true,
  false,
  NULL,
  NULL
);
