import { NextRequest, NextResponse } from "next/server";

function splitTextIntoChunks(text: string, maxLen = 180): string[] {
  // Split text by punctuation (. , ! ? ; \n)
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.,!?;:\n])\s+/)
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length <= maxLen) {
      current = (current + " " + sentence).trim();
    } else {
      if (current) chunks.push(current);
      // If a single sentence is longer than maxLen, split by words
      if (sentence.length > maxLen) {
        const words = sentence.split(" ");
        let sub = "";
        for (const w of words) {
          if ((sub + " " + w).trim().length <= maxLen) {
            sub = (sub + " " + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        if (sub) current = sub;
        else current = "";
      } else {
        current = sentence;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.length ? chunks : [text.slice(0, maxLen)];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text")?.trim();
  const lang = searchParams.get("lang") || "vi";

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  try {
    let ttsLang = "vi";
    if (lang.startsWith("en")) ttsLang = "en";
    else if (lang.startsWith("zh")) ttsLang = "zh-CN";
    else if (lang.startsWith("ko")) ttsLang = "ko";
    else if (lang.startsWith("ja")) ttsLang = "ja";

    const chunks = splitTextIntoChunks(text, 180);

    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/"
        }
      });

      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuffer));
      }
    }

    if (!audioBuffers.length) {
      return NextResponse.json({ error: "Could not generate audio" }, { status: 500 });
    }

    const combinedBuffer = Buffer.concat(audioBuffers);

    return new Response(combinedBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combinedBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "TTS Error" }, { status: 500 });
  }
}
