window.i18n = {
  es: {
    nav: {
      home: 'Inicio', about: 'Acerca', achievements: 'Logros',
      projects: 'Proyectos', experience: 'Experiencia',
      skills: 'Habilidades', articles: 'Blog', contact: 'Contacto'
    },
    hero: {
      badge: 'AI Architect & Tech Lead · 9+ años',
      description: 'Diseño agentes de voz con LLMs que atienden llamadas reales y los conecto con los sistemas del negocio. Vengo de 9 años de backend y cloud en Go, Python y AWS, y eso es lo que más uso: contratos claros entre el modelo y el resto del sistema, latencia medida y datos sensibles fuera del modelo.',
      value1: 'Agentes de voz en producción',
      value2: 'Modelos elegidos con datos de llamadas reales',
      value3: 'Backend y cloud: Go, Python, AWS',
      cta1: 'Trabajemos Juntos',
      cta2: 'Ver Proyectos',
      cta3: 'Descargar CV',
      stat1: 'Años de experiencia',
      stat2: 'Personas lideradas',
      stat3: 'De idea a producción'
    },
    about: {
      title: 'Sobre mí',
      intro: 'Soy arquitecto de software y líder técnico. Desde septiembre de 2026 trabajo en IA conversacional en HeyGIA. Antes pasé más de cinco años en Omni.pro, una casa de software a la medida, donde lideré un equipo de 20 personas y definí la arquitectura del V3 de su OMS.',
      narrative: 'En HeyGIA construimos el sistema con el que una cadena de restaurantes en México toma pedidos por teléfono: un agente de voz conversa con el cliente y una pasarela en Go que diseñé valida el pedido y lo envía al POS. Salió a producción cinco semanas después de empezar. Lo que más me interesa de este trabajo es lo que rodea al modelo: qué puede hacer y qué no, cómo se mide si funciona y qué pasa cuando falla.',
      areasTitle: 'Áreas de experiencia',
      area1Title: 'Liderazgo técnico',
      area1Text: 'En Omni.pro lideré un equipo de 20 personas: code reviews, mentoría, estimación y refinamiento del backlog con producto. En HeyGIA coordino agentes de código con especificaciones y revisiones como parte del flujo de ingeniería.',
      area2Title: 'Arquitectura y backend',
      area2Text: 'Microservicios, arquitectura hexagonal y DDD. APIs REST, gRPC y GraphQL. Backend en Go (Gin) y Python (Django, FastAPI, Flask).',
      area4Title: 'Cloud, DevOps y seguridad',
      area4Text: 'AWS (ECS Fargate, Lambda, API Gateway, Cognito), Terraform y CDK, GitHub Actions. Observabilidad con New Relic y CloudWatch. OWASP Top 10 y análisis estático con SonarQube.',
      area6Title: 'Agentes de IA',
      area6Text: 'Agentes de voz sobre LiveKit Agents con Claude y OpenAI, Deepgram y ElevenLabs. Tools con contrato versionado, caché de prompt y fallback entre proveedores. Evaluación con juez LLM y benchmarks de STT sobre llamadas reales. Servidores MCP.'
    },
    achievements: {
      title: 'Logros',
      ai1Title: 'Pedidos por teléfono con un agente de voz',
      ai1Desc: 'Una cadena de restaurantes en México recibe pedidos telefónicos atendidos por un agente de IA. Diseñé la pasarela que conecta al agente con el POS. El sistema salió a producción cinco semanas después de empezar el proyecto.',
      ai2Title: 'Benchmark de STT con llamadas reales',
      ai2Desc: 'Antes de cambiar de proveedor de STT califiqué a ciegas 1.271 fragmentos de 87 llamadas. El candidato acertó 71% frente a 54% (WER de 18% a 13%). La prueba también mostró que la cancelación de ruido empeoraba el resultado: el WER subía de 15% a 24%.',
      ai3Title: 'Desarrollo con agentes de código',
      ai3Desc: 'Un agente líder revisa e integra; otros trabajan en worktrees aislados a partir de especificaciones, ADRs y reglas ejecutables. En 9 semanas: 2.830 commits, 559 tickets y 48 épicas.',
      a6Title: 'Arquitectura del OMS V3',
      a6Desc: 'Definí la arquitectura del V3 del OMS de Omni.pro: 7 microservicios comunicados por gRPC y un bus de transacciones que separa las consultas de la transaccionalidad de las órdenes.',
      a1Title: 'Middleware de eventos a 1.500 RPS',
      a1Desc: 'Para una farmacéutica en México, un middleware en Go que envía en tiempo real los eventos transaccionales de Magento a Adobe CDP, a 1.500 solicitudes por segundo.',
      a9Title: 'Equipo de 20 personas',
      a9Desc: 'Como Technical Lead en Omni.pro lideré a 20 personas en el OMS y en proyectos para clientes: arquitectura, revisiones de código, estimación y acompañamiento técnico.',
      lAi1: 'Idea → producción', lAi2: 'STT en llamadas reales', lAi3: 'Commits en 9 semanas',
      lSaas: 'Microservicios + bus', lPerf: 'Middleware', lLead: 'Personas'
    },
    projects: {
      title: 'Proyectos',
      subtitle: 'Lo que he construido en empresas y por mi cuenta',
      filterAll: 'Todos',
      filterEnterprise: 'Profesionales',
      filterPersonal: 'Propios',
      badgeEnterprise: 'Enterprise',
      badgePersonal: 'Personal',
      moreInfo: 'Más Info',
      pH1Title: 'Pasarela de pedidos por voz',
      pH1Desc: 'Expone 17 tools al agente de voz y convierte lo que dicta el cliente en un pedido válido para el POS. La pasarela no llama a ningún LLM: valida y envía, con p99 ≤ 50 ms por tool y envío idempotente. El menú y las reglas de cada restaurante son configuración, así que un cliente nuevo no requiere desplegar.',
      pH2Title: 'Agente de voz telefónico',
      pH2Desc: 'Agente sobre LiveKit Agents con Claude Haiku (fallback a OpenAI), Deepgram y ElevenLabs. Lo migré a arquitectura hexagonal para cambiar de proveedor de LLM, STT o TTS sin tocar la lógica de la conversación. El teléfono del cliente no pasa por el modelo.',
      pH3Title: 'LLM Arena',
      pH3Desc: 'Herramienta interna para elegir LLM con el guion real del negocio: un cliente simulado conversa con modelos de 25 proveedores y un juez LLM califica a ciegas con una rúbrica ponderada, junto con latencia y costo. También funciona como servidor MCP.',
      pV1Title: 'Visabot',
      pV1Desc: 'Bot que vigila 24/7 el sistema oficial de citas de visa americana, detecta cancelaciones y adelanta el turno. Más de 2.500 citas adelantadas, en promedio 360 días. Se cobra solo si funciona.',
      pA1Title: 'Alunas',
      pA1Desc: 'PWA gratuita que convierte material de estudio (imágenes, PDFs, capturas) en juegos con Gemini. Tiene espacios colaborativos con marcadores en vivo y funciona sin conexión.',
      p1Title: 'OMS V3',
      p1Desc: 'Arquitectura que definí para el V3 del Order Management System de Omni.pro: 7 microservicios con gRPC y un bus de transacciones que separa las consultas de la transaccionalidad de las órdenes.',
      p2Title: 'Middleware Magento → Adobe CDP',
      p2Desc: 'Para una farmacéutica en México: envía en tiempo real los eventos transaccionales de Magento a Adobe CDP, a 1.500 RPS.',
      p3Title: 'Beautiful SEO',
      p3Desc: 'Generación de descripciones y metadatos SEO con LLMs para catálogos de eCommerce.',
      p4Title: 'Middleware automotriz → Adobe CDP',
      p4Desc: 'Extracción y procesamiento de datos de una automotriz en México hacia Adobe CDP, para activar campañas de marketing.',
      p5Title: 'Carga automática de promociones',
      p5Desc: 'Carga de promociones en Adobe Commerce para una farmacéutica en México. Una tarea manual de 4 horas diarias pasó a correr en minutos.',
      p6Title: 'OMS V2',
      p6Desc: 'Versión anterior del OMS: middleware separado del core, integraciones con WMS, ERP, eCommerce y marketplaces, y facturación electrónica por cliente.'
    },
    experience: {
      title: 'Experiencia',
      heygiaIntro: 'Arquitecto y líder técnico de la plataforma de agentes de voz. Llegué con la fundación de la empresa; cinco semanas después, una cadena de restaurantes en México ya recibía pedidos por teléfono atendidos por el agente.',
      omni2022Intro: 'Omni.pro es una casa de software a la medida; su producto central era un OMS (Order Management System). Como Technical Lead dirigí un equipo de 20 personas y definí la arquitectura del V3 del OMS.',
      omni2021Intro: 'Backend del V2 del OMS y de proyectos de integración para clientes.',
      apiuxIntro: 'Backend en Python/Django para productos SaaS de clientes.',
      intelloIntro: 'Backend para productos SaaS en una startup.',
      liceoDesc: 'Sistemas de gestión académica para la institución.'
    },
    skills: {
      title: 'Habilidades',
      ai: 'Agentes de IA',
      backend: 'Backend',
      data: 'Datos',
      cloud: 'Cloud y DevOps'
    },
    education: {
      title: 'Educación',
      degree1: 'Ingeniero de Sistemas', date1: '02/2016 - Aplazado',
      degree4: 'Técnico en Operaciones Comerciales', date4: '02/2013 - 10/2014',
      cert1: 'Terraform: De principiante a certificado',
      cert2: 'GOLANG: Curso profesional — De cero a Master'
    },
    articles: {
      title: 'Blog & Artículos',
      subtitle: 'Notas técnicas sobre arquitectura, cloud y liderazgo de ingeniería',
      readMore: 'Leer artículo',
      minRead: 'min de lectura',
      noArticles: 'Próximamente...',
    },
    contact: {
      title: 'Contacto',
      nameLabel: 'Nombre',
      msgLabel: 'Mensaje',
      sendBtn: 'Enviar por WhatsApp'
    },
    footer: {
      rights: 'Todos los derechos reservados.'
    }
  },

  en: {
    nav: {
      home: 'Home', about: 'About', achievements: 'Achievements',
      projects: 'Projects', experience: 'Experience',
      skills: 'Skills', articles: 'Blog', contact: 'Contact'
    },
    hero: {
      badge: 'AI Architect & Tech Lead · 9+ years',
      description: 'I design LLM voice agents that handle real phone calls and connect them to business systems. I come from 9 years of backend and cloud work in Go, Python and AWS, and that is what I use most: clear contracts between the model and the rest of the system, measured latency, and sensitive data kept out of the model.',
      value1: 'Voice agents in production',
      value2: 'Models chosen with data from real calls',
      value3: 'Backend and cloud: Go, Python, AWS',
      cta1: "Let's Work Together",
      cta2: 'View Projects',
      cta3: 'Download CV',
      stat1: 'Years of experience',
      stat2: 'People led',
      stat3: 'Idea to production'
    },
    about: {
      title: 'About Me',
      intro: 'I am a software architect and technical lead. Since September 2026 I have worked on conversational AI at HeyGIA. Before that I spent over five years at Omni.pro, a custom software house, where I led a team of 20 people and defined the architecture for V3 of its OMS.',
      narrative: 'At HeyGIA we built the system a restaurant chain in Mexico uses to take phone orders: a voice agent talks to the customer and a Go gateway I designed validates the order and sends it to the POS. It went to production five weeks after we started. What interests me most in this work is everything around the model: what it can and cannot do, how you measure whether it works, and what happens when it fails.',
      areasTitle: 'Areas of Expertise',
      area1Title: 'Technical leadership',
      area1Text: 'At Omni.pro I led a team of 20 people: code reviews, mentoring, estimation and backlog refinement with product. At HeyGIA I coordinate coding agents with specs and reviews as part of the engineering workflow.',
      area2Title: 'Architecture and backend',
      area2Text: 'Microservices, hexagonal architecture and DDD. REST, gRPC and GraphQL APIs. Backend in Go (Gin) and Python (Django, FastAPI, Flask).',
      area4Title: 'Cloud, DevOps and security',
      area4Text: 'AWS (ECS Fargate, Lambda, API Gateway, Cognito), Terraform and CDK, GitHub Actions. Observability with New Relic and CloudWatch. OWASP Top 10 and static analysis with SonarQube.',
      area6Title: 'AI agents',
      area6Text: 'Voice agents on LiveKit Agents with Claude and OpenAI, Deepgram and ElevenLabs. Tools with versioned contracts, prompt caching and provider fallback. Evaluation with an LLM judge and STT benchmarks on real calls. MCP servers.'
    },
    achievements: {
      title: 'Achievements',
      ai1Title: 'Phone orders taken by a voice agent',
      ai1Desc: 'A restaurant chain in Mexico takes phone orders handled by an AI agent. I designed the gateway that connects the agent to the POS. The system went to production five weeks after the project started.',
      ai2Title: 'STT benchmark on real calls',
      ai2Desc: 'Before switching STT providers I blind-graded 1,271 segments from 87 calls. The candidate scored 71% vs 54% (WER from 18% to 13%). The test also showed that noise cancellation made things worse: WER went from 15% to 24%.',
      ai3Title: 'Building with coding agents',
      ai3Desc: 'A lead agent reviews and integrates; other agents work in isolated worktrees from specs, ADRs and executable rules. In 9 weeks: 2,830 commits, 559 tickets and 48 epics.',
      a6Title: 'OMS V3 architecture',
      a6Desc: "Defined the architecture for V3 of Omni.pro's OMS: 7 microservices talking over gRPC and a transaction bus that separates order queries from order transactions.",
      a1Title: 'Event middleware at 1,500 RPS',
      a1Desc: 'For a pharmaceutical company in Mexico, a Go middleware that streams Magento transactional events to Adobe CDP in real time at 1,500 requests per second.',
      a9Title: 'Team of 20 people',
      a9Desc: 'As Technical Lead at Omni.pro I led 20 people across the OMS and client projects: architecture, code reviews, estimation and technical guidance.',
      lAi1: 'Idea → production', lAi2: 'STT on real calls', lAi3: 'Commits in 9 weeks',
      lSaas: 'Microservices + bus', lPerf: 'Middleware', lLead: 'People'
    },
    projects: {
      title: 'Projects',
      subtitle: "What I've built at companies and on my own",
      filterAll: 'All',
      filterEnterprise: 'Professional',
      filterPersonal: 'Personal',
      badgeEnterprise: 'Enterprise',
      badgePersonal: 'Personal',
      moreInfo: 'More Info',
      pH1Title: 'Voice ordering gateway',
      pH1Desc: "Exposes 17 tools to the voice agent and turns what the customer says into a valid POS order. The gateway never calls an LLM: it validates and submits, with p99 ≤ 50 ms per tool and idempotent submission. Each restaurant's menu and rules are configuration, so a new client needs no deployment.",
      pH2Title: 'Phone voice agent',
      pH2Desc: "Agent on LiveKit Agents with Claude Haiku (OpenAI fallback), Deepgram and ElevenLabs. I moved it to a hexagonal architecture so LLM, STT or TTS providers can be swapped without touching conversation logic. The customer's phone number never goes through the model.",
      pH3Title: 'LLM Arena',
      pH3Desc: 'Internal tool to choose an LLM using the real business script: a simulated customer talks to models from 25 providers and an LLM judge grades them blind with a weighted rubric, alongside latency and cost. It also runs as an MCP server.',
      pV1Title: 'Visabot',
      pV1Desc: 'Bot that watches the official US visa appointment system 24/7, detects cancellations and moves your appointment earlier. Over 2,500 appointments moved, 360 days earlier on average. You only pay if it works.',
      pA1Title: 'Alunas',
      pA1Desc: 'Free PWA that turns study material (images, PDFs, screenshots) into games using Gemini. It has collaborative spaces with live leaderboards and works offline.',
      p1Title: 'OMS V3',
      p1Desc: "Architecture I defined for V3 of Omni.pro's Order Management System: 7 microservices over gRPC and a transaction bus that separates order queries from order transactions.",
      p2Title: 'Middleware Magento → Adobe CDP',
      p2Desc: 'For a pharmaceutical company in Mexico: streams Magento transactional events to Adobe CDP in real time at 1,500 RPS.',
      p3Title: 'Beautiful SEO',
      p3Desc: 'SEO descriptions and metadata generated with LLMs for eCommerce catalogs.',
      p4Title: 'Automotive middleware → Adobe CDP',
      p4Desc: 'Data extraction and processing for an automotive company in Mexico into Adobe CDP, to trigger marketing campaigns.',
      p5Title: 'Automated promotion loading',
      p5Desc: 'Promotion loading into Adobe Commerce for a pharmaceutical company in Mexico. A 4-hour daily manual task now runs in minutes.',
      p6Title: 'OMS V2',
      p6Desc: 'Previous OMS version: middleware split from the core, integrations with WMS, ERP, eCommerce and marketplaces, and per-client electronic invoicing.'
    },
    experience: {
      title: 'Experience',
      heygiaIntro: 'Architect and technical lead of the voice-agent platform. I joined when the company was founded; five weeks later a restaurant chain in Mexico was taking phone orders handled by the agent.',
      omni2022Intro: 'Omni.pro is a custom software house; its core product was an OMS (Order Management System). As Technical Lead I ran a team of 20 people and defined the architecture for V3 of the OMS.',
      omni2021Intro: 'Backend for V2 of the OMS and for client integration projects.',
      apiuxIntro: 'Python/Django backend for client SaaS products.',
      intelloIntro: 'Backend for SaaS products at a startup.',
      liceoDesc: 'Academic management systems for the school.'
    },
    skills: {
      title: 'Skills',
      ai: 'AI agents',
      backend: 'Backend',
      data: 'Data',
      cloud: 'Cloud & DevOps'
    },
    education: {
      title: 'Education',
      degree1: 'Systems Engineer', date1: '02/2016 - On hold',
      degree4: 'Technical in Commercial Operations', date4: '02/2013 - 10/2014',
      cert1: 'Terraform: From beginner to certified',
      cert2: 'GOLANG: Professional course — From zero to Master'
    },
    articles: {
      title: 'Blog & Articles',
      subtitle: 'Technical notes on architecture, cloud and engineering leadership',
      readMore: 'Read article',
      minRead: 'min read',
      noArticles: 'Coming soon...',
    },
    contact: {
      title: 'Contact',
      nameLabel: 'Name',
      msgLabel: 'Message',
      sendBtn: 'Send via WhatsApp'
    },
    footer: {
      rights: 'All rights reserved.'
    }
  }
};
