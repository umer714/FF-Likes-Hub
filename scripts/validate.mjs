import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8"));
const studyApi = await readFile(new URL("../api/study.js", import.meta.url), "utf8");
const plannerApi = await readFile(new URL("../api/study-plan.js", import.meta.url), "utf8");

const checks = [];
function check(name, condition) {
  checks.push({ name, pass: Boolean(condition) });
}
check("HTML document has a doctype", /^<!doctype html>/i.test(html.trimStart()));
check("Mindora branding is present", /Mindora — Learn Smarter\. Go Further\./.test(html));
check("Web app manifest is valid JSON", Boolean(manifest && manifest.name && manifest.start_url));
check("PWA manifest link exists", /rel=["']manifest["']/.test(html));
check("Study API supports all six tools", ["summarize", "explain", "outline", "quiz", "flashcards", "mnemonics"].every((task) => studyApi.includes(task + ":")));
check("Study API has input length limit", /MAX_TEXT_LENGTH\s*=\s*12000/.test(studyApi));
check("Study API uses server-side key", /process\.env\.OPENAI_API_KEY/.test(studyApi));
check("Planner API validates daily minutes", /dailyMinutes < 15 \|\| dailyMinutes > 360/.test(plannerApi));
check("Local data backup controls exist", html.includes('id="exportMindoraBackup"') && html.includes('id="importMindoraBackup"'));
check("Study streak panel exists", html.includes('id="currentStreak"') && html.includes('id="longestStreak"'));
check("Timer controls exist", html.includes('id="timerStart"') && html.includes('id="timerFinish"'));
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
check("HTML element IDs are unique", duplicates.length === 0);
const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).filter((value) => value.trim());
let inlineSyntaxOkay = true;
try {
  for (const source of inlineScripts) new Function(source);
} catch (error) {
  inlineSyntaxOkay = false;
  console.error("Inline JavaScript syntax error:", error.message);
}
check("Inline JavaScript parses", inlineSyntaxOkay);

for (const item of checks) console.log((item.pass ? "PASS " : "FAIL ") + item.name);
const failures = checks.filter((item) => !item.pass);
console.log(`\nMindora validation: ${checks.length - failures.length}/${checks.length} checks passed.`);
if (failures.length) process.exitCode = 1;
