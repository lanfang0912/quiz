#!/usr/bin/env node
// 用 Gemini 為輪播 slides 生成水彩背景圖
// 執行方式：node generate-images.js

const https = require("https");
const fs = require("fs");
const path = require("path");

// 讀 .env
const envPath = path.join(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/GEMINI_API_KEY=(.+)/);
if (!match) {
  console.error("找不到 GEMINI_API_KEY，請先在 scripts/.env 填入");
  process.exit(1);
}
const API_KEY = match[1].trim();

const OUTPUT_DIR = path.join(__dirname, "images");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// ── 每張 slide 的水彩圖 prompt ──
const slides = [
  {
    id: "slide-1",
    // 封面：女兒被送進光裡，溫柔而發光
    prompt:
      "soft watercolor painting, warm golden light radiating through pink rose petals, dreamy glowing atmosphere, bokeh, motherly warmth, pastel pink and gold tones, no text, no people",
  },
  {
    id: "slide-2",
    // 那通電話：一通改變命運的電話
    prompt:
      "watercolor illustration, vintage telephone receiver, soft botanical vines wrapping around it, warm peach and cream tones, delicate hand-painted style, destiny and connection theme, no text, no people",
  },
  {
    id: "slide-3",
    // 她的過去：事業、履歷、犧牲
    prompt:
      "watercolor painting, elegant career woman symbols, briefcase and blooming flowers side by side, sage green and warm beige, professional yet soft, life choices theme, no text, no people",
  },
  {
    id: "slide-4",
    // 賣農場搬家：告別童年農場
    prompt:
      "watercolor landscape, Pennsylvania countryside farmhouse, golden autumn field, moving boxes with wildflowers, bittersweet warm tones, leaving home theme, no text, no people",
  },
  {
    id: "slide-5",
    // 癌症仍站上台：脆弱與堅強並存
    prompt:
      "watercolor, delicate cherry blossoms falling on a stage spotlight, fragile yet brave, soft pink and white, strength through illness theme, award stage glow, no text, no people",
  },
  {
    id: "slide-6",
    // 後台擁抱：崩潰後被接住
    prompt:
      "watercolor painting, warm embrace silhouette, mother holding daughter, backstage curtain, deep rose and mauve tones, emotional healing moment, soft tears and warmth, no text",
  },
  {
    id: "slide-7",
    // 那通媒合電話：友誼手環、愛媽媽的男人
    prompt:
      "watercolor illustration, friendship bracelet with beads, phone and hearts, warm terracotta and golden tones, matchmaking and love, cozy autumn feeling, no text, no people",
  },
  {
    id: "slide-8",
    // 結尾：有些媽媽沒有站上舞台，但她是光
    prompt:
      "watercolor painting, mother silhouette behind a glowing stage spotlight, warm golden and soft pink light, unconditional love, quiet sacrifice, ethereal and emotional, no text",
  },
];

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    });

    const options = {
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const parts = json?.candidates?.[0]?.content?.parts ?? [];
          const imgPart = parts.find((p) => p.inlineData);
          if (imgPart) {
            resolve(imgPart.inlineData);
          } else {
            reject(new Error("回應中沒有圖片：" + JSON.stringify(json).slice(0, 200)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`開始生成 ${slides.length} 張水彩圖...\n`);

  for (const slide of slides) {
    console.log(`▶ ${slide.id}...`);
    try {
      const imgData = await callGemini(slide.prompt);
      const ext = imgData.mimeType.includes("png") ? "png" : "jpg";
      const filePath = path.join(OUTPUT_DIR, `${slide.id}.${ext}`);
      fs.writeFileSync(filePath, Buffer.from(imgData.data, "base64"));
      console.log(`  ✓ 存到 images/${slide.id}.${ext}`);
    } catch (err) {
      console.warn(`  ✗ 失敗，跳過：${err.message}`);
    }
    // 避免 rate limit，每張間隔 2 秒
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("\n完成！圖片存在 scripts/carousel/images/");
  console.log("接著請打開 andrea-swift.html 確認效果。");
}

main();
