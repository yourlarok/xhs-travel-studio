const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
function edit(file, from, to) {
  const target = path.join(root, file); const text = fs.readFileSync(target, "utf8");
  if (!text.includes(from)) { console.log(`${file}: already changed or anchor missing`); return; }
  fs.writeFileSync(target, text.replace(from, to), "utf8"); console.log(`${file}: updated`);
}
edit("xhs-integration.js",
  "const keywords = Array.isArray(input.keywords) ? input.keywords.map(String).map(v => v.trim()).filter(Boolean).slice(0, 5) : [];",
  "const keywords = Array.isArray(input.keywords) ? input.keywords.map(String).map(v => v.trim()).filter(Boolean).slice(0, 30) : [];"
);
const main = path.join(root, "main.js");
let text = fs.readFileSync(main, "utf8");
const oldPrompt = `  const prompt = [\n    "Act as a local capability test for China Travel Studio.",\n    "Do not edit files and do not browse. Return only a compact English planning card.",\n    "Propose one Chengdu topic for an international first-time visitor.",\n    "It must state exactly three coordinates: door-to-door duration, RMB budget per person, and execution difficulty with one reason.",\n    \`Assembled skills: \${skills.join(", ") || "none"}.\`,\n    \`Enabled image tools: \${imageTools.join(", ") || "none"}.\`\n  ].join("\\n");`;
const newPrompt = `  const prompt = config.mode === "comment_reply" ? [\n    "Draft one concise Xiaohongshu reply for a China inbound-travel creator.",\n    "Answer in the language used by the commenter. Be warm, specific, and cautious.",\n    "If price, schedule, passport, payment, allergy, safety, or booking facts are not verified, say they need rechecking instead of inventing an answer.",\n    "Return only the reply text, under 350 characters. Do not edit files or browse.",\n    \`Comment: \${String(config.comment || "").slice(0, 1200)}\`\n  ].join("\\n") : [\n    "Act as a local capability test for China Travel Studio.",\n    "Do not edit files and do not browse. Return only a compact English planning card.",\n    "Propose one Chengdu topic for an international first-time visitor.",\n    "It must state exactly three coordinates: door-to-door duration, RMB budget per person, and execution difficulty with one reason.",\n    \`Assembled skills: \${skills.join(", ") || "none"}.\`,\n    \`Enabled image tools: \${imageTools.join(", ") || "none"}.\`\n  ].join("\\n");`;
if (text.includes(oldPrompt)) { text = text.replace(oldPrompt, newPrompt); fs.writeFileSync(main, text, "utf8"); console.log("main.js: prompt updated"); }
else console.log("main.js: prompt already changed or anchor missing");
