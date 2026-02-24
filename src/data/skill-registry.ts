import type { SkillRegistryEntry } from '@/lib/types';

export const SKILL_REGISTRY: SkillRegistryEntry[] = [
  // ─── Code Review ──────────────────────────────────────
  { id: 'code-review:code-review', name: 'Code Review', category: 'code-review', description: 'Elite code review for security, performance, and reliability', keywords: ['review', 'code quality', 'pull request', 'pr', 'lint', 'static analysis'] },
  { id: 'pr-review-toolkit:review-pr', name: 'PR Review', category: 'code-review', description: 'Comprehensive pull request review toolkit', keywords: ['pull request', 'pr review', 'github', 'merge', 'diff'] },
  { id: 'superpowers:requesting-code-review', name: 'Request Code Review', category: 'code-review', description: 'Structured code review request workflow', keywords: ['review request', 'code review', 'feedback'] },

  // ─── Debugging ────────────────────────────────────────
  { id: 'superpowers:systematic-debugging', name: 'Systematic Debugging', category: 'debugging', description: 'Hypothesis-driven debugging with evidence gathering', keywords: ['debug', 'error', 'bug', 'fix', 'troubleshoot', 'crash', 'exception'] },
  { id: 'error-debugging:debugger', name: 'Error Debugger', category: 'debugging', description: 'Specialist for errors, test failures, and unexpected behavior', keywords: ['error', 'stack trace', 'failure', 'unexpected'] },
  { id: 'error-debugging:error-detective', name: 'Error Detective', category: 'debugging', description: 'Search logs and codebases for error patterns', keywords: ['logs', 'error pattern', 'stack trace', 'anomaly'] },

  // ─── Testing ──────────────────────────────────────────
  { id: 'superpowers:test-driven-development', name: 'TDD Workflow', category: 'testing', description: 'Red-green-refactor test-driven development', keywords: ['tdd', 'test', 'unit test', 'testing', 'red green refactor'] },
  { id: 'tdd-workflows:tdd-cycle', name: 'TDD Cycle', category: 'testing', description: 'Complete TDD red-green-refactor cycle', keywords: ['tdd', 'test cycle', 'red green'] },
  { id: 'unit-testing:test-automator', name: 'Test Automator', category: 'testing', description: 'AI-powered test automation with modern frameworks', keywords: ['test automation', 'e2e', 'integration test', 'jest', 'pytest'] },

  // ─── Backend ──────────────────────────────────────────
  { id: 'backend-development:feature-development', name: 'Backend Feature', category: 'backend', description: 'Build backend features with scalable API design', keywords: ['api', 'backend', 'server', 'endpoint', 'rest', 'graphql'] },
  { id: 'api-scaffolding:fastapi-pro', name: 'FastAPI Pro', category: 'backend', description: 'High-performance async APIs with FastAPI', keywords: ['fastapi', 'python', 'async', 'api'] },
  { id: 'api-scaffolding:django-pro', name: 'Django Pro', category: 'backend', description: 'Django 5.x with DRF, Celery, and Channels', keywords: ['django', 'python', 'orm', 'drf'] },

  // ─── Frontend ─────────────────────────────────────────
  { id: 'frontend-mobile-development:frontend-developer', name: 'Frontend Developer', category: 'frontend', description: 'React 19, Next.js 15, modern frontend architecture', keywords: ['react', 'nextjs', 'frontend', 'ui', 'component', 'css', 'layout'] },
  { id: 'multi-platform-apps:mobile-developer', name: 'Mobile Developer', category: 'mobile', description: 'React Native, Flutter, or native mobile apps', keywords: ['mobile', 'ios', 'android', 'react native', 'flutter', 'app'] },

  // ─── DevOps & Infrastructure ──────────────────────────
  { id: 'cloud-infrastructure:kubernetes-architect', name: 'Kubernetes Architect', category: 'devops', description: 'Cloud-native infrastructure and GitOps workflows', keywords: ['kubernetes', 'k8s', 'docker', 'container', 'devops', 'deploy'] },
  { id: 'cicd-automation:deployment-engineer', name: 'Deployment Engineer', category: 'devops', description: 'CI/CD pipelines, GitOps, and deployment automation', keywords: ['ci', 'cd', 'pipeline', 'deploy', 'github actions', 'gitlab'] },
  { id: 'cloud-infrastructure:terraform-specialist', name: 'Terraform Specialist', category: 'devops', description: 'Advanced IaC automation and state management', keywords: ['terraform', 'iac', 'infrastructure', 'aws', 'azure', 'gcp'] },

  // ─── Security ─────────────────────────────────────────
  { id: 'security-scanning:security-auditor', name: 'Security Auditor', category: 'security', description: 'DevSecOps, vulnerability assessment, OWASP', keywords: ['security', 'audit', 'vulnerability', 'owasp', 'penetration', 'cve'] },
  { id: 'backend-api-security:backend-security-coder', name: 'Backend Security', category: 'security', description: 'Input validation, authentication, API security', keywords: ['auth', 'validation', 'injection', 'xss', 'csrf'] },

  // ─── Database ─────────────────────────────────────────
  { id: 'database-design:database-architect', name: 'Database Architect', category: 'database', description: 'Data layer design, technology selection, schema modeling', keywords: ['database', 'schema', 'sql', 'nosql', 'migration', 'postgres', 'mysql'] },
  { id: 'database-cloud-optimization:database-optimizer', name: 'Database Optimizer', category: 'database', description: 'Query optimization, indexing, caching strategies', keywords: ['query', 'performance', 'index', 'cache', 'n+1', 'slow query'] },

  // ─── Documentation ────────────────────────────────────
  { id: 'documentation-generation:docs-architect', name: 'Docs Architect', category: 'documentation', description: 'Comprehensive technical documentation from codebases', keywords: ['documentation', 'docs', 'readme', 'guide', 'manual', 'wiki'] },
  { id: 'documentation-generation:tutorial-engineer', name: 'Tutorial Engineer', category: 'documentation', description: 'Step-by-step tutorials and educational content', keywords: ['tutorial', 'guide', 'how-to', 'learn', 'onboarding', 'walkthrough'] },

  // ─── AI & LLM ─────────────────────────────────────────
  { id: 'llm-application-dev:ai-engineer', name: 'AI Engineer', category: 'ai-ml', description: 'Production LLM apps, RAG systems, and agents', keywords: ['ai', 'llm', 'rag', 'agent', 'chatbot', 'embedding', 'vector'] },
  { id: 'llm-application-dev:prompt-engineer', name: 'Prompt Engineer', category: 'ai-ml', description: 'Advanced prompting techniques and LLM optimization', keywords: ['prompt', 'prompt engineering', 'chain of thought', 'few-shot'] },

  // ─── Performance ──────────────────────────────────────
  { id: 'application-performance:performance-engineer', name: 'Performance Engineer', category: 'performance', description: 'Observability, optimization, and scalability', keywords: ['performance', 'optimize', 'slow', 'latency', 'throughput', 'profiling'] },

  // ─── Git & Workflow ───────────────────────────────────
  { id: 'git-pr-workflows:git-workflow', name: 'Git Workflow', category: 'git', description: 'Git branching, merging, and PR workflows', keywords: ['git', 'branch', 'merge', 'rebase', 'conflict', 'workflow'] },
  { id: 'superpowers:brainstorming', name: 'Brainstorming', category: 'workflow', description: 'Turn ideas into fully formed designs and specs', keywords: ['brainstorm', 'idea', 'design', 'plan', 'architecture', 'spec'] },

  // ─── Languages ────────────────────────────────────────
  { id: 'python-development:python-pro', name: 'Python Pro', category: 'language', description: 'Python 3.12+ with modern features and async', keywords: ['python', 'pip', 'venv', 'async', 'typing'] },
  { id: 'javascript-typescript:typescript-pro', name: 'TypeScript Pro', category: 'language', description: 'Advanced TypeScript with strict type safety', keywords: ['typescript', 'types', 'generics', 'interface'] },
  { id: 'systems-programming:rust-pro', name: 'Rust Pro', category: 'language', description: 'Rust with modern async and systems programming', keywords: ['rust', 'cargo', 'borrow checker', 'async', 'tokio'] },
  { id: 'systems-programming:golang-pro', name: 'Go Pro', category: 'language', description: 'Go 1.21+ with concurrency and microservices', keywords: ['go', 'golang', 'goroutine', 'channel', 'concurrency'] },
];
