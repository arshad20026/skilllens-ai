import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Comprehensive skill database for fallback - DO NOT REUSE SKILLS ACROSS ROLES
const skillsByRole: Record<string, { missing: string[]; roadmap: string }> = {
  "full stack developer": {
    missing: [
      "TypeScript Advanced Types",
      "Testing & TDD",
      "CI/CD Pipelines",
      "Containerization (Docker)",
      "Kubernetes Orchestration",
      "GraphQL",
      "Performance Optimization",
      "Security Best Practices",
    ],
    roadmap: `Phase 1 (Weeks 1-4): Advanced TypeScript - Master generics, decorators, and type utilities
Phase 2 (Weeks 5-8): Testing - Learn Jest, React Testing Library, Backend testing frameworks
Phase 3 (Weeks 9-12): DevOps Basics - Docker, docker-compose, basic deployment
Phase 4 (Weeks 13-16): CI/CD - GitHub Actions, GitLab CI, or Jenkins
Phase 5 (Weeks 17-20): Advanced Backend - Caching, message queues, microservices
Phase 6 (Weeks 21-24): Performance & Security - Monitoring, security hardening, optimization`,
  },
  "web developer": {
    missing: [
      "Responsive Design Frameworks",
      "SEO Optimization",
      "Browser Performance",
      "Web Animations",
      "Progressive Web Apps (PWA)",
      "Cross-browser Compatibility",
      "Web Accessibility Standards",
      "Front-end Build Tools",
    ],
    roadmap: `Phase 1 (Weeks 1-3): HTML5 & CSS3 Mastery - Semantic HTML, modern CSS techniques, flexbox, grid
Phase 2 (Weeks 4-6): JavaScript Fundamentals - DOM manipulation, events, AJAX, ES6+ features
Phase 3 (Weeks 7-10): Framework Expertise - React/Vue/Angular deep dive, component patterns
Phase 4 (Weeks 11-14): Performance & Optimization - Lazy loading, code splitting, caching strategies
Phase 5 (Weeks 15-18): Testing & Debugging - Browser dev tools, unit testing, debugging techniques
Phase 6 (Weeks 19-24): Advanced Topics - PWA, WebAssembly basics, deployment optimization`,
  },
  "data scientist": {
    missing: [
      "Advanced Statistics",
      "Deep Learning & Neural Networks",
      "Model Deployment",
      "Big Data Technologies (Spark, Hadoop)",
      "MLOps & Model Management",
      "Advanced SQL",
      "Data Visualization",
      "Causal Inference",
    ],
    roadmap: `Phase 1 (Weeks 1-3): Statistics Foundation - Hypothesis testing, regression analysis, probability
Phase 2 (Weeks 4-7): Machine Learning - Classification, clustering, ensemble methods
Phase 3 (Weeks 8-11): Deep Learning - Neural networks, CNNs, RNNs, Transformers
Phase 4 (Weeks 12-15): Big Data - Spark, distributed computing, large-scale processing
Phase 5 (Weeks 16-19): MLOps - Model deployment, versioning, monitoring, CI/CD for ML
Phase 6 (Weeks 20-24): Advanced Topics - Causal inference, reinforcement learning, generative models`,
  },
  "ai engineer": {
    missing: [
      "Large Language Models (LLM)",
      "Prompt Engineering",
      "Vector Databases",
      "Retrieval-Augmented Generation (RAG)",
      "Model Fine-tuning",
      "Transformer Architecture",
      "Generative AI APIs",
      "Production AI Systems",
    ],
    roadmap: `Phase 1 (Weeks 1-4): LLM Fundamentals - Transformer basics, attention mechanisms, token handling
Phase 2 (Weeks 5-8): Prompt Engineering - Few-shot learning, chain-of-thought, advanced prompting
Phase 3 (Weeks 9-12): Generative Models - Text generation, image generation, multimodal models
Phase 4 (Weeks 13-16): Advanced Techniques - Fine-tuning, LoRA, quantization, model optimization
Phase 5 (Weeks 17-20): Production Deployment - API integration, monitoring, scaling AI systems
Phase 6 (Weeks 21-24): Advanced Applications - RAG systems, agent frameworks, real-time inference`,
  },
  "frontend developer": {
    missing: [
      "Advanced CSS (Grid, Animations, 3D)",
      "Performance Optimization",
      "Web Accessibility (a11y)",
      "Advanced React Patterns",
      "State Management",
      "Testing",
      "Build Tools Optimization",
      "Web Components",
    ],
    roadmap: `Phase 1 (Weeks 1-3): CSS Mastery - Grid layouts, animations, transitions, responsive design
Phase 2 (Weeks 4-6): JavaScript Depth - Closures, prototypes, async patterns, events
Phase 3 (Weeks 7-10): React Advanced - Hooks, Context API, performance optimization, custom hooks
Phase 4 (Weeks 11-13): State Management - Redux, Zustand, or Recoil patterns
Phase 5 (Weeks 14-17): Testing - Unit, integration, and E2E testing strategies
Phase 6 (Weeks 18-24): Performance - Lazy loading, code splitting, monitoring, accessibility (a11y)`,
  },
  "backend developer": {
    missing: [
      "System Design",
      "Database Optimization",
      "API Design Patterns",
      "Microservices Architecture",
      "Message Queues",
      "Caching Strategies",
      "Security & Authentication",
      "Scalability Patterns",
    ],
    roadmap: `Phase 1 (Weeks 1-4): Database Mastery - Indexing, query optimization, transactions, normalization
Phase 2 (Weeks 5-8): API Design - RESTful principles, GraphQL, versioning, documentation
Phase 3 (Weeks 9-12): System Architecture - Microservices, distributed systems, architectural patterns
Phase 4 (Weeks 13-16): Advanced Patterns - Caching (Redis), message queues (RabbitMQ, Kafka), event-driven
Phase 5 (Weeks 17-20): Security - OAuth, JWT, encryption, SQL injection prevention, rate limiting
Phase 6 (Weeks 21-24): Scalability - Load balancing, database sharding, monitoring, performance tuning`,
  },
  "devops engineer": {
    missing: [
      "Kubernetes Advanced",
      "Infrastructure as Code (Terraform, Ansible)",
      "Cloud Platforms (AWS, GCP, Azure)",
      "Monitoring & Logging (Prometheus, ELK)",
      "Disaster Recovery",
      "Security Hardening",
      "GitOps Workflows",
      "Cost Optimization",
    ],
    roadmap: `Phase 1 (Weeks 1-4): Docker Deep Dive - Advanced Docker, multi-stage builds, Docker Compose, registries
Phase 2 (Weeks 5-9): Kubernetes - Core concepts, deployments, services, ConfigMaps, StatefulSets
Phase 3 (Weeks 10-14): Infrastructure as Code - Terraform, Ansible, CloudFormation
Phase 4 (Weeks 15-18): Cloud Platforms - Choose AWS/GCP/Azure and master core services
Phase 5 (Weeks 19-22): Observability - Prometheus, Grafana, ELK stack, log aggregation
Phase 6 (Weeks 23-26): Security & Optimization - GitOps, cost optimization, disaster recovery planning`,
  },
  "java engineer": {
    missing: [
      "Spring Boot & Spring Framework",
      "JPA/Hibernate ORM",
      "Concurrent Programming & Threading",
      "Design Patterns & SOLID Principles",
      "REST API Development",
      "Microservices Architecture",
      "Maven/Gradle Build Tools",
      "Unit Testing (JUnit, Mockito)",
    ],
    roadmap: `Phase 1 (Weeks 1-3): Java Core Mastery - Advanced generics, collections, streams, lambda expressions, functional programming
Phase 2 (Weeks 4-7): Spring Framework - Spring Boot, dependency injection, configuration, annotations, AOP
Phase 3 (Weeks 8-11): Data Access Layer - JPA, Hibernate, Spring Data, query optimization, transaction management
Phase 4 (Weeks 12-15): API Development - REST principles, Spring MVC, request handling, validation, exception handling
Phase 5 (Weeks 16-19): Testing & Quality - JUnit 5, Mockito, integration testing, test-driven development, code coverage
Phase 6 (Weeks 20-24): Microservices & Deployment - Microservices patterns, Docker, Kubernetes, monitoring, production readiness`,
  },
  "mobile developer": {
    missing: [
      "Native App Development",
      "Mobile UI/UX Patterns",
      "App Performance Optimization",
      "Offline Data Synchronization",
      "Push Notifications",
      "App Security & Authentication",
      "Testing on Multiple Devices",
      "App Store Deployment",
    ],
    roadmap: `Phase 1 (Weeks 1-4): Platform Fundamentals - iOS/Android architecture, lifecycle management, navigation
Phase 2 (Weeks 5-8): UI Development - Layout systems, responsive design, native components, animations
Phase 3 (Weeks 9-12): Backend Integration - API calls, data persistence, local databases, sync strategies
Phase 4 (Weeks 13-16): Performance - Optimization, memory management, battery efficiency, startup time
Phase 5 (Weeks 17-20): Testing - Unit testing, integration testing, device testing, beta distribution
Phase 6 (Weeks 21-24): Advanced Topics - Push notifications, deep linking, monetization, app store optimization`,
  },
  "python developer": {
    missing: [
      "Async Programming",
      "Web Frameworks (Django/FastAPI)",
      "Database Design & ORM",
      "Testing Frameworks",
      "Packaging & Distribution",
      "Code Performance Profiling",
      "Security Best Practices",
      "Dependency Management",
    ],
    roadmap: `Phase 1 (Weeks 1-3): Python Advanced - Decorators, generators, context managers, metaprogramming
Phase 2 (Weeks 4-7): Web Framework - Django or FastAPI mastery, routing, middleware, templates
Phase 3 (Weeks 8-11): Database & ORM - SQLAlchemy/Django ORM, migrations, query optimization
Phase 4 (Weeks 12-15): Testing & Quality - pytest, unit testing, integration testing, TDD practices
Phase 5 (Weeks 16-19): API Development - REST API design, authentication, documentation, versioning
Phase 6 (Weeks 20-24): Deployment & DevOps - Docker, CI/CD, monitoring, production hardening`,
  },
};

// Role keyword mapping for accurate matching
const roleKeywords: Record<string, string[]> = {
  "web developer": ["web", "frontend", "front-end", "html", "css", "javascript"],
  "frontend developer": ["frontend", "front-end", "react", "vue", "angular", "ui"],
  "backend developer": ["backend", "back-end", "server", "api", "database"],
  "full stack developer": ["full stack", "fullstack", "both", "mern", "mean"],
  "data scientist": ["data", "science", "ml", "machine", "learning", "statistics", "analytics"],
  "ai engineer": ["ai", "artificial", "intelligence", "llm", "generative", "neural"],
  "devops engineer": ["devops", "ops", "infrastructure", "deployment", "docker", "kubernetes"],
  "java engineer": ["java", "spring", "enterprise"],
  "mobile developer": ["mobile", "ios", "android", "app", "flutter", "react native"],
  "python developer": ["python", "django", "fastapi", "flask"],
};

function matchRoleByKeywords(inputRole: string): string {
  const normalizedInput = inputRole.toLowerCase().trim();

  // First, check for exact matches in our database
  if (skillsByRole[normalizedInput]) {
    return normalizedInput;
  }

  // Score each known role based on keyword matches
  let bestMatch = "";
  let bestScore = 0;

  Object.entries(roleKeywords).forEach(([knownRole, keywords]) => {
    const matchingKeywords = keywords.filter(kw => normalizedInput.includes(kw));
    if (matchingKeywords.length > bestScore) {
      bestScore = matchingKeywords.length;
      bestMatch = knownRole;
    }
  });

  // If we found a good match, return it
  if (bestScore > 0) {
    console.log(
      `[ROLE MATCHING] Input: "${inputRole}" → Matched: "${bestMatch}" (Score: ${bestScore})`
    );
    return bestMatch;
  }

  // If no match found, try substring matching on role names (last resort)
  for (const knownRole of Object.keys(skillsByRole)) {
    if (normalizedInput.includes(knownRole) || knownRole.includes(normalizedInput)) {
      console.log(`[ROLE MATCHING] Input: "${inputRole}" → Substring match: "${knownRole}"`);
      return knownRole;
    }
  }

  // Default fallback
  console.warn(
    `[ROLE MATCHING] Input: "${inputRole}" → No match found, using default: "full stack developer"`
  );
  return "full stack developer";
}

function getSmartFallback(role: string, currentSkills: string, matchedRole: string) {
  const skillInfo = skillsByRole[matchedRole];
  
  if (!skillInfo) {
    throw new Error(`No skill profile found for role: ${matchedRole}`);
  }

  const currentSkillList = currentSkills
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

  const skillDescriptions = skillInfo.missing.map((s, i) => `${i + 1}. ${s}`).join("\n");

  return {
    gapAnalysis: `
🎯 Analysis for ${role} (Mapped to: ${matchedRole})

Based on your current skills (${currentSkillList.length > 0 ? currentSkillList.join(", ") : "not provided"}), you have a foundation to build upon. The following critical areas require focused development for a successful ${matchedRole} career:

Key Findings:
• Current proficiency: ${currentSkillList.length > 0 ? `${currentSkillList.slice(0, 2).join(", ")}` : "foundational level"}
• Primary focus areas: Advanced technical skills specific to ${matchedRole}
• Recommended timeframe: 6-8 months with consistent effort
• Learning approach: Structured progression from fundamentals to advanced topics

Critical Skill Gaps:
${skillDescriptions}

Success Metrics:
✓ Master at least 5 of the 8 skills to qualify for junior positions
✓ Master all 8 skills to qualify for mid-level positions
✓ Combine skills with projects for senior opportunities`,
    missingSkills: skillInfo.missing,
    roadmap: skillInfo.roadmap,
    timeline: "6-8 months with consistent learning (10-15 hours/week)",
  };
}

export async function analyzeSkillGap(role: string, currentSkills: string) {
  try {
    // Step 1: Match the role to a known role profile
    const matchedRole = matchRoleByKeywords(role);
    console.log(`[ANALYSIS] Starting skill gap analysis for: "${role}" (matched to: "${matchedRole}")`);
    console.log(`[ANALYSIS] Current skills provided: ${currentSkills}`);

    // Step 2: Try to use Gemini AI with a specific, role-aware prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `You are an expert career coach specializing in ${matchedRole} positions. 
A user wants to pursue a career as a ${role} and has these current skills: ${currentSkills}

CRITICAL REQUIREMENTS:
- Provide skills SPECIFIC and UNIQUE to ${matchedRole}
- DO NOT include generic DevOps, cloud infrastructure, or deployment tools unless they are CORE to ${matchedRole}
- DO NOT repeat skills from other roles
- Focus on the distinctive technical skills for THIS role only
- Generate 8 skills that are truly different from other roles

Generate a JSON response with this exact structure:
{
  "gapAnalysis": "A 2-3 sentence analysis of their current level and gaps specific to ${matchedRole}",
  "missingSkills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "roadmap": "Phase 1: ... \nPhase 2: ... \nPhase 3: ... \nPhase 4: ... \nPhase 5: ... \nPhase 6: ...",
  "timeline": "6-8 months"
}`;

    console.log(`[ANALYSIS] Sending request to Gemini API...`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log(`[ANALYSIS] Received response from Gemini API`);

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Validate response structure
        if (
          parsed.gapAnalysis &&
          Array.isArray(parsed.missingSkills) &&
          parsed.missingSkills.length > 0 &&
          parsed.roadmap &&
          parsed.timeline
        ) {
          console.log(
            `[ANALYSIS] Successfully parsed Gemini response with ${parsed.missingSkills.length} skills`
          );
          return {
            gapAnalysis: parsed.gapAnalysis,
            missingSkills: parsed.missingSkills,
            roadmap: parsed.roadmap,
            timeline: parsed.timeline,
          };
        }
      }
    } catch (parseError) {
      console.warn(`[ANALYSIS] Failed to parse Gemini response, using fallback:`, parseError);
    }

    // Step 3: Fallback to predefined skill database
    console.log(`[ANALYSIS] Using fallback skill database for role: "${matchedRole}"`);
    return getSmartFallback(role, currentSkills, matchedRole);
  } catch (error) {
    console.error(`[ANALYSIS] Gemini API error:`, error);
    console.warn(`[ANALYSIS] Falling back to skill database`);

    // Final fallback: use default role matching
    const matchedRole = matchRoleByKeywords(role);
    return getSmartFallback(role, currentSkills, matchedRole);
  }
}

export async function chat(message: string, context: string = "") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = context
      ? `Context: ${context}\n\nUser: ${message}`
      : message;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Chat API error:", error);
    return "I'm having trouble connecting to the AI service. Please try again later.";
  }
}
