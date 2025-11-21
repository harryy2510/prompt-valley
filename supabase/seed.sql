-- Seed file for PromptValley
-- Insert curated prompts for the library

INSERT INTO prompts (title, description, content, category, platform, is_public, is_curated, is_featured) VALUES
(
  'Blog Post Writer',
  'Generate engaging blog posts on any topic with SEO optimization',
  'Write a comprehensive blog post about [TOPIC]. Include an attention-grabbing introduction, 3-5 main sections with subheadings, practical examples, and a compelling conclusion. Optimize for SEO with relevant keywords. Target audience: [AUDIENCE]. Tone: [TONE - professional/casual/friendly].',
  'content_creation',
  'chatgpt',
  true,
  true,
  true
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
  true
),
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
  true
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
  false
),
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
  false
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
  true
),
(
  'Interview Question Preparer',
  'Prepare for job interviews with tailored questions and answers',
  'Generate 10 common interview questions for a [JOB TITLE] position at a [COMPANY TYPE - startup/enterprise/agency]. For each question provide:
- The question
- Why they ask it
- A strong sample answer framework
- Key points to emphasize

Focus on: [SKILLS/EXPERIENCE TO HIGHLIGHT]',
  'productivity',
  'claude',
  true,
  true,
  false
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
  false
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
  false
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
  false
);
