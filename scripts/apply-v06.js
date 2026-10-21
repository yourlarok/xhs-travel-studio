const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");

function edit(relative, transform) {
  const file = path.join(root, relative);
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before);
  if (after === before) throw new Error(`No change applied to ${relative}`);
  fs.writeFileSync(file, after, "utf8");
}

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing anchor: ${label}`);
  return text.replace(from, to);
}

edit("content-skill/SKILL.md", text => replaceOnce(
  text,
  "Read [references/voice-and-localization.md](references/voice-and-localization.md) for sentence rhythm, transitions, emoji, symbols, Chinese terms, and examples of natural phrasing.",
  "Read [references/voice-and-localization.md](references/voice-and-localization.md) for sentence rhythm, transitions, emoji, symbols, Chinese terms, and examples of natural phrasing.\n\nWhen research includes international traveler reviews, read [references/traveler-voice-synthesis.md](references/traveler-voice-synthesis.md). Learn recurring expectations, vocabulary level, question framing, and tradeoff language without copying a reviewer's distinctive wording or imitating Tripadvisor as a brand voice.",
  "editorial voice reference"
));

edit("main.js", text => replaceOnce(
  text,
  "const roots = [path.join(os.homedir(), \".codex\", \"skills\"), path.join(os.homedir(), \".codex\", \"skills\", \".system\")];",
  "const roots = [path.join(__dirname, \"agent-skills\"), path.join(__dirname, \"content-skill-parent\"), path.join(os.homedir(), \".codex\", \"skills\"), path.join(os.homedir(), \".codex\", \"skills\", \".system\")];",
  "skill roots"
));

edit("package.json", text => {
  text = replaceOnce(text, '"version": "0.5.0"', '"version": "0.6.0"', "version");
  return replaceOnce(text, '"content-skill/**/*",', '"content-skill/**/*",\n      "agent-skills/**/*",', "packaged skills");
});

edit("preload.js", text => replaceOnce(
  text,
  "readOwnData: () => ipcRenderer.invoke(\"xhs:read-own\"),",
  "readOwnData: () => ipcRenderer.invoke(\"xhs:read-own\"),\n  readComments: () => ipcRenderer.invoke(\"xhs:read-comments\"),\n  prepareCommentReply: (payload) => ipcRenderer.invoke(\"xhs:prepare-comment-reply\", payload),",
  "comment bridge"
));

console.log("v0.6 file updates applied");
