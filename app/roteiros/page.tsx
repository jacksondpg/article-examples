"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const WEBHOOK_URL = "/api/webhook";

type VideoItem = {
  titulo: string;
  url_video: string;
};

type ThemeResult = {
  tema: string;
  match_score_medio: number;
  videos: VideoItem[];
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

type ActiveVideo = {
  title: string;
  url: string;
  embedUrl: string;
};

function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (hostname.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      const parts = parsed.pathname.split("/").filter(Boolean);

      if (parts[0] === "embed" && parts[1]) {
        return parts[1];
      }

      if (parts[0] === "shorts" && parts[1]) {
        return parts[1];
      }

      if (parts[0] === "live" && parts[1]) {
        return parts[1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

function toEmbedUrl(url: string): string {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

function normalizeResults(data: unknown): ThemeResult[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    const tema = typeof item?.tema === "string" ? item.tema : "Tema";
    const matchScore =
      typeof item?.match_score_medio === "number"
        ? item.match_score_medio
        : Number(item?.match_score_medio ?? 0);
    const videos = Array.isArray(item?.videos)
      ? item.videos
          .filter(
            (video: any) =>
              typeof video?.titulo === "string" &&
              typeof video?.url_video === "string",
          )
          .map((video: { titulo: string; url_video: string }) => ({
            titulo: video.titulo,
            url_video: video.url_video,
          }))
      : [];

    return {
      tema,
      match_score_medio: Number.isNaN(matchScore) ? 0 : matchScore,
      videos,
    };
  });
}

export default function RoteirosPage() {
  const [processId, setProcessId] = useState("");
  const [isShorts, setIsShorts] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<ThemeResult[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

  const isLoading = status === "loading";
  const hasVideos = results.some((tema) => tema.videos.length > 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = processId.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Informe o ID do processo.");
      return;
    }

    setStatus("loading");
    setMessage("");
    setResults([]);
    setCopiedUrl(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processo_id: trimmed,
          is_shorts: isShorts,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const normalized = normalizeResults(data);

      setResults(normalized);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage("Nao foi possivel buscar videos. Tente novamente.");
    }
  }

  async function handleCopy(url: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedUrl(url);
      window.setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      setCopiedUrl(null);
    }
  }

  function openVideo(video: VideoItem) {
    setActiveVideo({
      title: video.titulo,
      url: video.url_video,
      embedUrl: toEmbedUrl(video.url_video),
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px 80px",
        background:
          "linear-gradient(135deg, #f5f7fb 0%, #eef2f7 40%, #e7edf5 100%)",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        color: "#1f2937",
      }}
    >
      <div style={{ width: "min(980px, 100%)", display: "grid", gap: "24px" }}>
        <section
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: "12px",
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            Roteiros
          </p>
          <h1 style={{ margin: "10px 0 6px", fontSize: "30px" }}>
            Buscar videos por processo
          </h1>
          <p style={{ margin: "0 0 22px", color: "#4b5563" }}>
            Informe o ID do processo e escolha o tipo de conteudo.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "18px",
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: "10px" }}>
              <label
                htmlFor="process-id"
                style={{ fontWeight: 600, color: "#1f2937" }}
              >
                ID do processo
              </label>
              <input
                id="process-id"
                type="text"
                value={processId}
                onChange={(event) => setProcessId(event.target.value)}
                placeholder="Ex: 123456"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5f5",
                  fontSize: "16px",
                  outline: "none",
                }}
                disabled={isLoading}
              />
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <span style={{ fontWeight: 600, color: "#1f2937" }}>
                Tipo de video
              </span>
              <div
                role="radiogroup"
                aria-label="Tipo de video"
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={!isShorts}
                  onClick={() => setIsShorts(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "999px",
                    border: !isShorts
                      ? "1px solid #1d4ed8"
                      : "1px solid #cbd5f5",
                    background: !isShorts ? "#e0ebff" : "#ffffff",
                    color: "#1f2937",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Longos
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isShorts}
                  onClick={() => setIsShorts(true)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "999px",
                    border: isShorts
                      ? "1px solid #1d4ed8"
                      : "1px solid #cbd5f5",
                    background: isShorts ? "#e0ebff" : "#ffffff",
                    color: "#1f2937",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Shorts
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "14px 22px",
                borderRadius: "12px",
                border: "none",
                background: "#1d4ed8",
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: "0 16px 30px rgba(29, 78, 216, 0.2)",
                justifySelf: "start",
              }}
            >
              {isLoading ? "Buscando..." : "Buscar videos"}
            </button>

            {status === "error" && message ? (
              <p
                role="status"
                aria-live="polite"
                style={{
                  margin: 0,
                  color: "#b00020",
                  fontWeight: 600,
                }}
              >
                {message}
              </p>
            ) : null}
          </form>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "18px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "22px" }}>Resultados</h2>
            <span style={{ color: "#6b7280", fontSize: "13px" }}>
              {results.length} temas
            </span>
          </div>

          {isLoading ? (
            <p style={{ margin: 0, color: "#475569" }}>Carregando...</p>
          ) : null}

          {!isLoading && status === "success" && !hasVideos ? (
            <p style={{ margin: 0, color: "#475569" }}>
              Nenhum video encontrado.
            </p>
          ) : null}

          {!isLoading && results.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {results.map((tema, index) => (
                <details
                  key={`${tema.tema}-${index}`}
                  style={{
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                    background: "#f8fafc",
                    overflow: "hidden",
                  }}
                >
                  <summary
                    style={{
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px 18px",
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    <span>{tema.tema}</span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      match_score_medio: {tema.match_score_medio}
                    </span>
                  </summary>
                  <div style={{ padding: "0 18px 18px" }}>
                    {tema.videos.length === 0 ? (
                      <p style={{ margin: "12px 0 0", color: "#6b7280" }}>
                        Nenhum video neste tema.
                      </p>
                    ) : (
                      tema.videos.map((video, videoIndex) => (
                        <div
                          key={`${video.titulo}-${videoIndex}`}
                          style={{
                            display: "grid",
                            gap: "10px",
                            padding: "14px 0",
                            borderBottom:
                              videoIndex === tema.videos.length - 1
                                ? "none"
                                : "1px solid #e5e7eb",
                          }}
                        >
                          <div style={{ fontWeight: 600, color: "#1f2937" }}>
                            {video.titulo}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleCopy(video.url_video)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                borderRadius: "10px",
                                border: "1px solid #cbd5f5",
                                background: "#ffffff",
                                color: "#1f2937",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                              aria-label="Copiar link do video"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M8 8.5C8 7.12 9.12 6 10.5 6H17.5C18.88 6 20 7.12 20 8.5V17.5C20 18.88 18.88 20 17.5 20H10.5C9.12 20 8 18.88 8 17.5V8.5Z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />
                                <path
                                  d="M6.5 18H6C4.9 18 4 17.1 4 16V6C4 4.9 4.9 4 6 4H16C17.1 4 18 4.9 18 6V6.5"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />
                              </svg>
                              Copiar link
                            </button>
                            <button
                              type="button"
                              onClick={() => openVideo(video)}
                              style={{
                                padding: "8px 14px",
                                borderRadius: "10px",
                                border: "none",
                                background: "#111827",
                                color: "#ffffff",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Assistir
                            </button>
                            {copiedUrl === video.url_video ? (
                              <span style={{ color: "#166534", fontSize: "12px" }}>
                                Copiado
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </details>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      {activeVideo ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 50,
          }}
          onClick={() => setActiveVideo(null)}
        >
          <div
            style={{
              width: "min(860px, 100%)",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 30px 80px rgba(15, 23, 42, 0.4)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px" }}>
                {activeVideo.title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                style={{
                  border: "none",
                  background: "#e5e7eb",
                  color: "#111827",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Fechar
              </button>
            </div>
            <div
              style={{
                position: "relative",
                paddingTop: "56.25%",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#111827",
              }}
            >
              <iframe
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
