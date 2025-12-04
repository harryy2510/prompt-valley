-- ============================================================================
-- PROMPTVALLEY SEED DATA
-- Categories and models from design + comprehensive prompt library
-- ============================================================================

-- ============================================================================
-- AI PROVIDERS
-- ============================================================================

INSERT INTO ai_providers (id, name, logo_url, website_url) VALUES
('openai', 'OpenAI', 'https://cdn.openai.com/assets/favicon-32x32.png', 'https://openai.com'),
('google', 'Google', 'https://www.google.com/favicon.ico', 'https://ai.google');

-- ============================================================================
-- AI MODELS (Only ChatGPT and Gemini from images)
-- ============================================================================

INSERT INTO ai_models (id, provider_id, name, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
VALUES
  ('gpt-4o', 'openai', 'ChatGPT', ARRAY['text', 'code', 'image']::model_capability[], 128000, 16384, 2.5000, 10.0000),
  ('gemini-2.0-flash-exp', 'google', 'Gemini', ARRAY['text', 'code', 'image']::model_capability[], 1000000, 8192, 0.0000, 0.0000);

-- ============================================================================
-- CATEGORIES (Only Writing and Image Generation)
-- ============================================================================

-- Root categories
INSERT INTO categories (id, name) VALUES
('writing', 'Writing'),
('image-generation', 'Image Generation');

-- ============================================================================
-- WRITING SUBCATEGORIES
-- ============================================================================

INSERT INTO categories (id, parent_id, name) VALUES
('email-sequences', 'writing', 'Email sequences'),
('linkedin-post', 'writing', 'Linkedin Post'),
('social-media-captions', 'writing', 'Social media captions'),
('cold-outreach-messages', 'writing', 'Cold outreach messages'),
('sales-scripts', 'writing', 'Sales scripts'),
('ad-copy', 'writing', 'Ad copy'),
('landing-page-copy', 'writing', 'Landing page copy'),
('blog-posts', 'writing', 'Blog posts'),
('case-studies', 'writing', 'Case studies');

-- ============================================================================
-- IMAGE GENERATION SUBCATEGORIES
-- ============================================================================

INSERT INTO categories (id, parent_id, name) VALUES
('illustrations', 'image-generation', 'Illustrations'),
('website-hero-images', 'image-generation', 'Website hero images'),
('product-photos', 'image-generation', 'Product photos'),
('branding-assets', 'image-generation', 'Branding assets'),
('posters', 'image-generation', 'Posters'),
('fashion-shoots', 'image-generation', 'Fashion shoots'),
('movie-style-images', 'image-generation', 'Movie-style images');

-- ============================================================================
-- TAGS (Essential tags for prompt categorization)
-- ============================================================================

INSERT INTO tags (id, name) VALUES
('beginner-friendly', 'Beginner Friendly'),
('advanced', 'Advanced'),
('professional', 'Professional'),
('business', 'Business'),
('marketing', 'Marketing'),
('career', 'Career'),
('linkedin', 'LinkedIn'),
('networking', 'Networking'),
('creative', 'Creative'),
('technical', 'Technical'),
('seo', 'SEO'),
('copywriting', 'Copywriting'),
('personal-branding', 'Personal Branding'),
('job-search', 'Job Search'),
('image-generation-tag', 'Image Generation'),
('photorealistic', 'Photorealistic');

-- ============================================================================
-- SAMPLE PROMPTS
-- High-quality prompts covering all categories and optimized for ChatGPT & Gemini
-- ============================================================================

-- ===========================================
-- LINKEDIN POST PROMPTS
-- ===========================================

-- LinkedIn About Section Generator
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'linkedin-about-section-generator',
  'LinkedIn About Section Generator',
  'Create a compelling, professional LinkedIn "About" section that attracts opportunities and showcases your value',
  'Create a compelling, concise, and professional LinkedIn profile summary based on the following details. The tone should balance credibility and personality, clearly communicate value, and be tailored to attract opportunities in the user''s field. Avoid clichés and buzzwords unless they are industry-standard. Provide 2–3 version options with slightly different styles (e.g., aspirational, results-driven, narrative).

Include the following sections in your output:
• Headline-style opening (1–2 lines that communicate identity + value)
• Core strengths (role expertise, specializations, and unique value)
• Key achievements / outcomes (quantified when possible)
• Professional philosophy or working style (short, relevant, non-generic)
• Future goals / what the person is looking for (opportunities, collaborations, problems they solve)
• Optional call-to-action (inviting connection or conversation)

Here is the user information:
• Name: [Insert]
• Current role or field: [Insert]
• Industry or domain: [Insert]
• Experience level (years): [Insert]
• Key skills: [Insert]
• Major achievements: [Insert]
• Strengths or traits: [Insert]
• Target audience (recruiters, clients, collaborators, etc.): [Insert]
• Future goals or career direction: [Insert]
• Any other context: [Insert]

Instructions:
• Use a polished LinkedIn tone suited for global professional audiences
• Avoid exaggeration; keep all claims realistic
• Keep the summary within 4–7 short paragraphs (or 8–12 sentences)
• Provide one long-form version and one succinct version
• Optimize for clarity, impact, and readability',
  'linkedin-post', 'free', true, true, 1, NOW()
);

-- LinkedIn Headline Generator
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'linkedin-headline-generator',
  'LinkedIn Headline Generator',
  'Generate 10 high-impact LinkedIn headlines optimized for search visibility and professional appeal',
  'Create 10 high-impact LinkedIn headline options tailored to the user''s background. Each headline must:
• Be concise (max 220 characters)
• Clearly communicate what the user does, their value, and key strengths
• Avoid buzzword overload and vague labels (e.g., "enthusiastic professional," "hardworking individual")
• Use a mix of formats: value-driven, role-focused, niche-specialist, achievement-oriented, and aspirational
• Be optimized for search visibility (industry keywords)
• Work for global professional audiences

Here is the user information:
• Current role or title: [Insert]
• Industry: [Insert]
• Key skills or specialties: [Insert]
• Unique value proposition: [Insert]
• Major achievements (optional): [Insert]
• Target audience (recruiters, clients, hiring managers): [Insert]
• Future direction or goals: [Insert]

Instructions:
• Generate headlines that balance clarity and differentiation
• Prioritize straightforward wording that quickly tells someone what the user is great at
• Create variety: some should be keyword-dense, some crisp and bold, some more narrative
• Avoid any clichés unless they are industry-standard terms
• Do not exceed character limits',
  'linkedin-post', 'free', true, true, 2, NOW()
);

-- LinkedIn Work Experience Writer
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'linkedin-work-experience-writer',
  'LinkedIn Work Experience Writer',
  'Create polished, results-focused LinkedIn work experience descriptions that attract recruiters',
  'Create a polished, concise, and results-focused LinkedIn Work Experience description for the following role. Structure the content using short paragraphs and bullet points. Highlight responsibilities, achievements, impact, and key skills in a way that appeals to recruiters and hiring managers.

Include in the output:
• 1–2 sentence role overview summarizing scope and purpose
• Key responsibilities (bullet points, action-verb-led, clear, no fluff)
• Top achievements & impact (bullet points with quantified metrics whenever possible)
• Tools, technologies, or methods used (compact line)
• Optional: a summary line reinforcing value or outcomes delivered

Here is the user information:
• Job title: [Insert]
• Company name: [Insert]
• Duration: [Insert]
• Industry: [Insert]
• Key responsibilities: [Insert]
• Major achievements or projects: [Insert]
• Tools, technologies, or skills used: [Insert]
• Team size or scope of influence: [Insert]
• Metrics / measurable outcomes: [Insert]
• Any unique aspects of the role: [Insert]

Instructions:
• Use strong action verbs (led, designed, optimized, increased, etc.)
• Prioritize measurable impact over generic responsibilities
• Keep language professional, crisp, and specific
• Tailor tone to the seniority level of the role (junior vs. leadership)
• Avoid jargon unless it''s industry-standard',
  'linkedin-post', 'free', true, true, 3, NOW()
);

-- LinkedIn Job Hunter Message Template
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'linkedin-job-hunter-message',
  'LinkedIn Job Hunter Message Template',
  'Craft personalized LinkedIn messages to recruiters and hiring managers that get responses',
  'Create a personalized, professional LinkedIn message to reach out to a recruiter or hiring manager about a job opportunity. The tone should be confident but not pushy, concise yet informative, and demonstrate genuine interest and preparation.

The message should:
• Open with a relevant connection point or context (mutual connection, company news, shared interest, etc.)
• Clearly state the purpose (interest in a role, informational interview, exploring opportunities)
• Highlight 1-2 key qualifications or relevant experiences that align with the company/role
• Include a specific, low-friction call-to-action (e.g., "Would you be open to a brief call?")
• Close professionally with appreciation
• Be 100-150 words max (short enough to read quickly)

Here is the user information:
• Your name: [Insert]
• Your current role/title: [Insert]
• Target company: [Insert]
• Target role (if known): [Insert]
• Recipient name: [Insert]
• Recipient role: [Insert]
• Why you''re reaching out: [Insert]
• Relevant skills or experiences: [Insert]
• Connection point or context (optional): [Insert]
• What you''re asking for (job discussion, informational chat, referral, etc.): [Insert]

Instructions:
• Avoid generic openers like "I hope this message finds you well"
• Do not over-explain or write a cover letter
• Keep it conversational, warm, and professional
• Personalize based on the recipient or company (show you did research)
• Make it easy for them to say yes',
  'linkedin-post', 'pro', false, true, 4, NOW()
);

-- LinkedIn Endorsement Request
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'linkedin-endorsement-request',
  'LinkedIn Endorsement Request',
  'Request LinkedIn skill endorsements or recommendations in a professional, non-awkward way',
  'Create a polite, professional LinkedIn message asking a former colleague, manager, or client to endorse your skills or write a recommendation. The message should be warm, specific, and make the request easy to fulfill.

The message should:
• Open with a friendly, personalized greeting
• Acknowledge your past working relationship or collaboration
• Clearly state the request (endorsement or recommendation)
• Provide context: which skills or what aspect of your work you''d like them to highlight
• Make it easy (offer to draft something, suggest specific skills, keep it low-effort)
• Express appreciation and offer to reciprocate
• Be brief and respectful of their time

Here is the user information:
• Your name: [Insert]
• Recipient name: [Insert]
• How you worked together: [Insert]
• What you''re asking for: [Endorsement or Recommendation]
• Skills or accomplishments to highlight: [Insert]
• Context or reason for request (job search, profile refresh, career move, etc.): [Insert]
• Your relationship with them (peer, manager, client, etc.): [Insert]

Instructions:
• Keep the tone warm and genuine, not transactional
• Make it feel personal, not like a mass request
• Acknowledge they may be busy and offer to help
• Be clear about what you''re asking without being demanding
• Keep it to 80-120 words',
  'linkedin-post', 'free', false, true, 5, NOW()
);

-- LinkedIn Networking Icebreaker
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'linkedin-networking-icebreaker',
  'LinkedIn Networking Icebreaker',
  'Start meaningful LinkedIn conversations with personalized connection requests that get accepted',
  'Create a warm, personalized LinkedIn connection request message that initiates a professional relationship without being salesy or generic. The goal is to start a genuine conversation and build a connection.

The message should:
• Reference something specific about their profile, content, or work (show you did research)
• Clearly state why you''re reaching out (shared interest, mutual goals, admiration for their work, etc.)
• Be conversational and approachable
• Avoid any immediate asks or pitches
• End with a welcoming tone that invites further conversation
• Be 50-80 words (LinkedIn connection requests have a 300-character limit)

Here is the user information:
• Your name: [Insert]
• Your role/industry: [Insert]
• Recipient name: [Insert]
• Recipient role/industry: [Insert]
• Why you want to connect: [Insert]
• What you admire or relate to about them: [Insert]
• Any mutual interests or goals: [Insert]
• Connection context (event, shared group, content they posted, etc.): [Insert]

Instructions:
• Make it specific to them—avoid messages that could be sent to anyone
• Keep the tone friendly and professional, not overly formal
• Do not ask for anything in the first message
• Avoid buzzwords and clichés
• Make them feel valued, not targeted',
  'linkedin-post', 'free', false, true, 6, NOW()
);

-- ===========================================
-- EMAIL SEQUENCE PROMPTS
-- ===========================================

-- Cold Email Sequence Generator
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'cold-email-sequence-generator',
  'Cold Email Sequence Generator',
  'Create a 3-5 email cold outreach sequence that builds trust and drives responses',
  'Create a strategic 3-5 email cold outreach sequence designed to build rapport, demonstrate value, and drive a specific action (meeting, demo, call, etc.). Each email should have a distinct purpose and escalate appropriately.

Email 1: Introduction & Value Proposition
• Personalized opening referencing recipient or company
• Brief introduction of who you are and why you''re reaching out
• Clear value proposition (what''s in it for them)
• Soft call-to-action (gauge interest, offer value)
• Keep it short (80-120 words)

Email 2: Add Value / Provide Insight (3-4 days later)
• Reference the first email briefly
• Share something useful: insight, resource, case study, or relevant trend
• Reinforce credibility and relevance
• Gentle nudge toward a conversation
• Keep it helpful, not pushy

Email 3: Social Proof / Success Story (3-4 days later)
• Share a brief success story or testimonial from a similar client/company
• Highlight measurable results or outcomes
• Make it relatable to their situation
• Clear, direct CTA (ask for 15 minutes)

Email 4 (Optional): Last Touch / Break-Up (5-7 days later)
• Acknowledge you haven''t heard back
• Offer one last piece of value or a different angle
• Politely bow out while leaving the door open
• Use a "permission to close" approach

Here is the user information:
• Your name and role: [Insert]
• Your company: [Insert]
• What you offer: [Insert]
• Target recipient role: [Insert]
• Target company or industry: [Insert]
• Key pain point you solve: [Insert]
• Unique value or differentiator: [Insert]
• Desired outcome (meeting, demo, call, etc.): [Insert]
• Any relevant proof points (case studies, stats, testimonials): [Insert]

Instructions:
• Keep each email focused on one goal
• Personalize based on recipient or company
• Use a conversational, helpful tone
• Avoid salesy language or hype
• Make CTAs clear and low-friction',
  'email-sequences', 'pro', true, true, 7, NOW()
);

-- ===========================================
-- SOCIAL MEDIA PROMPTS
-- ===========================================

-- Instagram Caption Generator
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'instagram-caption-generator',
  'Instagram Caption Generator',
  'Generate engaging Instagram captions with hooks, storytelling, and strategic hashtags',
  'Create an engaging Instagram caption based on the following details. The caption should grab attention, tell a story or convey a message, and include a clear call-to-action. Provide 3 variations with different tones (inspirational, educational, conversational).

Each caption should include:
• A strong hook (first line that stops the scroll)
• Main message or story (2-4 sentences)
• Call-to-action (comment, share, tag, link in bio, etc.)
• 10-15 strategic hashtags (mix of popular and niche)
• Optional: Emoji placement for visual appeal

Here is the user information:
• Post topic or theme: [Insert]
• Target audience: [Insert]
• Brand voice (casual, professional, playful, etc.): [Insert]
• Key message or takeaway: [Insert]
• Desired action from audience: [Insert]
• Any specific hashtags to include: [Insert]

Instructions:
• Make the first line compelling (people decide to read more in 1 second)
• Keep paragraphs short for easy mobile reading
• Use line breaks for visual clarity
• Make hashtags relevant and strategic
• Emojis should enhance, not overwhelm',
  'social-media-captions', 'free', true, true, 8, NOW()
);

-- ===========================================
-- BLOG POST PROMPTS
-- ===========================================

-- Blog Post Outline Generator
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'blog-post-outline-generator',
  'Blog Post Outline Generator',
  'Create comprehensive blog post outlines with SEO optimization and reader engagement in mind',
  'Create a detailed blog post outline for the following topic. The outline should be structured for SEO, reader engagement, and clear information flow.

Include:
• SEO-optimized title (include main keyword)
• Meta description (150-160 characters)
• Introduction (hook, problem, what readers will learn)
• 5-7 main sections with:
  - H2 headings (keyword-optimized)
  - 2-3 H3 subheadings per section
  - Key points to cover
  - Suggested examples or data
• Conclusion (summary, key takeaways, CTA)
• Suggested internal/external links
• FAQ section (3-5 questions)

Here is the user information:
• Blog post topic: [Insert]
• Main keyword: [Insert]
• Target audience: [Insert]
• Post goal (educate, convert, entertain, etc.): [Insert]
• Desired post length: [Insert]
• Key points to cover: [Insert]
• Your unique angle or perspective: [Insert]

Instructions:
• Structure for skimmability (short paragraphs, clear headings)
• Optimize headings for search intent and keywords
• Include actionable takeaways in each section
• Make the outline detailed enough to write from directly
• Consider user questions and search intent',
  'blog-posts', 'pro', false, true, 9, NOW()
);

-- ===========================================
-- IMAGE GENERATION PROMPTS
-- ===========================================

-- Product Photography Prompt Generator
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'product-photography-prompt',
  'Product Photography Prompt Generator',
  'Generate detailed prompts for AI image generators to create professional product photos',
  'Create a detailed AI image generation prompt for professional product photography. The prompt should be specific, technical, and optimized for tools like Midjourney, DALL-E, or Stable Diffusion.

Include in the prompt:
• Product description (type, colors, materials, size, features)
• Photography style (lifestyle, studio, flat lay, macro, etc.)
• Lighting setup (natural, studio, golden hour, dramatic, soft, etc.)
• Background and setting (minimalist, contextual, environmental)
• Camera angle and composition (overhead, 45°, close-up, etc.)
• Mood and atmosphere (clean, luxurious, playful, professional)
• Technical parameters (resolution, aspect ratio, photorealistic quality)

Here is the user information:
• Product name and type: [Insert]
• Product colors and materials: [Insert]
• Desired photography style: [Insert]
• Background preference: [Insert]
• Lighting mood: [Insert]
• Target use (e-commerce, social media, ads, etc.): [Insert]
• Brand aesthetic: [Insert]
• Any specific details or props: [Insert]

Instructions:
• Be highly specific with visual details
• Use technical photography terminology
• Include aspect ratio and quality parameters
• Structure the prompt for AI model understanding
• Provide 2-3 variations with different angles/styles',
  'product-photos', 'pro', true, true, 10, NOW()
);

-- Website Hero Image Prompt
INSERT INTO prompts (id, title, description, content, category_id, tier, is_featured, is_published, sort_order, published_at)
VALUES (
  'website-hero-image-prompt',
  'Website Hero Image Prompt Generator',
  'Create stunning hero images for websites with detailed AI generation prompts',
  'Generate a detailed AI image generation prompt for a website hero image. The image should be visually striking, on-brand, and work well with text overlay.

Include in the prompt:
• Scene description (subject, environment, action)
• Visual style (modern, minimalist, vibrant, corporate, etc.)
• Color palette (primary colors, mood, brand colors)
• Composition (rule of thirds, negative space for text, focal point)
• Lighting and atmosphere (bright, moody, warm, professional)
• Technical specs (wide format, high resolution, suitable for web)
• Text-overlay considerations (space for headlines, contrast areas)

Here is the user information:
• Website type or industry: [Insert]
• Brand personality: [Insert]
• Target audience: [Insert]
• Key message or theme: [Insert]
• Preferred colors: [Insert]
• Desired mood/feeling: [Insert]
• Any specific elements to include: [Insert]
• Where text will be placed: [Insert]

Instructions:
• Optimize for wide aspect ratio (16:9 or 21:9)
• Ensure space for text overlay
• Create visual hierarchy and focal points
• Match brand aesthetic and audience expectations
• Provide 2 variations: one bold, one subtle',
  'website-hero-images', 'free', false, true, 11, NOW()
);

-- ============================================================================
-- PROMPT_TAGS RELATIONSHIPS
-- ============================================================================

-- LinkedIn About Section tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('linkedin-about-section-generator', 'beginner-friendly'),
('linkedin-about-section-generator', 'professional'),
('linkedin-about-section-generator', 'career'),
('linkedin-about-section-generator', 'linkedin'),
('linkedin-about-section-generator', 'personal-branding');

-- LinkedIn Headline tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('linkedin-headline-generator', 'beginner-friendly'),
('linkedin-headline-generator', 'professional'),
('linkedin-headline-generator', 'career'),
('linkedin-headline-generator', 'linkedin'),
('linkedin-headline-generator', 'personal-branding');

-- LinkedIn Work Experience tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('linkedin-work-experience-writer', 'professional'),
('linkedin-work-experience-writer', 'career'),
('linkedin-work-experience-writer', 'linkedin'),
('linkedin-work-experience-writer', 'copywriting');

-- LinkedIn Job Hunter tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('linkedin-job-hunter-message', 'professional'),
('linkedin-job-hunter-message', 'career'),
('linkedin-job-hunter-message', 'linkedin'),
('linkedin-job-hunter-message', 'job-search'),
('linkedin-job-hunter-message', 'networking');

-- LinkedIn Endorsement tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('linkedin-endorsement-request', 'professional'),
('linkedin-endorsement-request', 'career'),
('linkedin-endorsement-request', 'linkedin'),
('linkedin-endorsement-request', 'networking');

-- LinkedIn Networking tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('linkedin-networking-icebreaker', 'beginner-friendly'),
('linkedin-networking-icebreaker', 'professional'),
('linkedin-networking-icebreaker', 'career'),
('linkedin-networking-icebreaker', 'linkedin'),
('linkedin-networking-icebreaker', 'networking');

-- Cold Email Sequence tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('cold-email-sequence-generator', 'advanced'),
('cold-email-sequence-generator', 'business'),
('cold-email-sequence-generator', 'marketing'),
('cold-email-sequence-generator', 'copywriting');

-- Instagram Caption tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('instagram-caption-generator', 'beginner-friendly'),
('instagram-caption-generator', 'marketing'),
('instagram-caption-generator', 'creative'),
('instagram-caption-generator', 'copywriting');

-- Blog Post Outline tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('blog-post-outline-generator', 'professional'),
('blog-post-outline-generator', 'marketing'),
('blog-post-outline-generator', 'seo'),
('blog-post-outline-generator', 'copywriting');

-- Product Photography tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('product-photography-prompt', 'advanced'),
('product-photography-prompt', 'creative'),
('product-photography-prompt', 'technical'),
('product-photography-prompt', 'image-generation-tag');

-- Website Hero Image tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
('website-hero-image-prompt', 'creative'),
('website-hero-image-prompt', 'technical'),
('website-hero-image-prompt', 'image-generation-tag');

-- ============================================================================
-- PROMPT_MODELS RELATIONSHIPS
-- ============================================================================

-- All prompts are compatible with both ChatGPT and Gemini
INSERT INTO prompt_models (prompt_id, model_id)
SELECT p.id, m.id
FROM prompts p
CROSS JOIN ai_models m
WHERE m.id IN ('gpt-4o', 'gemini-2.0-flash-exp');
