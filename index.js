const chunks = [
  {
    id: 1,
    title: "Auth Notes",
    text: "JWT middleware protects routes by checking whether a request has a valid token. If the token is missing, return 401 Unauthorized.",
    keywords: [
      "jwt",
      "auth",
      "token",
      "middleware",
      "route",
      "routes",
      "protected",
    ],
  },
  {
    id: 2,
    title: "Database Notes",
    text: "PostgreSQL stores relational data in tables. Tables can be connected using foreign keys.",
    keywords: [
      "postgresql",
      "database",
      "tables",
      "relations",
      "relational",
      "foreign",
      "keys",
    ],
  },
  {
    id: 3,
    title: "Queue Notes",
    text: "Redis with BullMQ can process background jobs outside the request-response cycle.",
    keywords: [
      "redis",
      "bullmq",
      "queue",
      "worker",
      "background",
      "jobs",
      "async",
    ],
  },
];

function retrieveTopChunks(question, limit) {
  const questionWords = question.toLowerCase().split(/\W+/);

  let bestChunks = [];

  for (const chunk of chunks) {
    let score = 0;
    let currentKeywords = [];

    for (const word of questionWords) {
      if (chunk.keywords.includes(word)) {
        if (!currentKeywords.includes(word)) {
          score++;
          currentKeywords.push(word);
        }
      }
    }

    if (score > 0) {
      bestChunks.push({
        chunk,
        score,
        keywords: currentKeywords,
      });
    }
  }

  bestChunks.sort((a, b) => b.score - a.score);

  return bestChunks.slice(0, limit);
}

function askTinyRag(question) {
  const results = retrieveTopChunks(question, 3);

  if (results.length === 0) {
    return "I could not find relevant information in the documents.";
  }

  const answerText = results
    .map((result, index) => `[${index + 1}] ${result.chunk.text}`)
    .join("\n");

  const sourcesText = results
    .map(
      (result, index) =>
        `[${index + 1}] ${result.chunk.title} - score: ${result.score} - matched: ${result.keywords.join(", ")}`,
    )
    .join("\n");

  return `
  Question:
  ${question}
  
  Answer:
  Based on the documents:
  ${answerText}
  
  Sources:
  ${sourcesText}
  `;
}

console.log(askTinyRag("how do i protect routes with a token?"));
