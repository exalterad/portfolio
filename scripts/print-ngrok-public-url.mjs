/**
 * Läser ngroks lokala API (webb-UI på 4040) och skriver ut den publika https-URL:en.
 * Sätt OPEN_BROWSER=0 för att inte öppna webbläsaren automatiskt.
 */
import { exec } from "node:child_process";

async function main() {
  for (let attempt = 0; attempt < 90; attempt++) {
    try {
      const res = await fetch("http://127.0.0.1:4040/api/tunnels");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const tunnel = (data.tunnels ?? []).find((t) => t.public_url?.startsWith("https:"));
      const url = tunnel?.public_url;
      if (url) {
        console.log("\n\x1b[32m========================================\x1b[0m");
        console.log("\x1b[32m  ÖPPNA / DELA DENNA LÄNK:\x1b[0m");
        console.log(`\x1b[1m\x1b[36m  ${url}\x1b[0m`);
        console.log("\x1b[32m========================================\x1b[0m\n");

        if (process.env.OPEN_BROWSER !== "0") {
          const { platform } = process;
          if (platform === "win32") {
            exec(`cmd /c start "" "${url}"`);
          } else if (platform === "darwin") {
            exec(`open "${url}"`);
          } else {
            exec(`xdg-open "${url}"`);
          }
        }
        return;
      }
    } catch {
      // ngrok API inte uppe ännu
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.error(
    "Kunde inte läsa ngrok-URL från http://127.0.0.1:4040 — kontrollera att ngrok startade (t.ex. ERR_NGROK_334 / redan online).",
  );
  process.exitCode = 1;
}

main();
