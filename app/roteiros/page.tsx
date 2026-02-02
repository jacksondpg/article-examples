"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const WEBHOOK_URL = "/api/webhook";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function RoteirosForm() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) {
      setStatus("error");
      setFeedback("Digite um texto para enviar.");
      return;
    }

    setStatus("sending");
    setFeedback("Enviando...");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setStatus("success");
      setFeedback("Enviado com sucesso.");
      setText("");
    } catch (error) {
      setStatus("error");
      setFeedback("Nao foi possivel enviar. Tente novamente.");
    }
  }

  const isSending = status === "sending";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        background:
          "radial-gradient(circle at top left, #fff1db 0%, #f3f6ff 38%, #e6e6e6 78%)",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <section
        style={{
          width: "min(720px, 100%)",
          borderRadius: "28px",
          background: "#fffdf8",
          padding: "36px",
          boxShadow: "0 20px 60px rgba(22, 34, 51, 0.16)",
          border: "1px solid rgba(28, 30, 34, 0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontSize: "12px",
            color: "#4a4a4a",
            fontWeight: 600,
          }}
        >
          Roteiros
        </p>
        <h1 style={{ margin: "12px 0 8px", fontSize: "32px" }}>
          Envie o id do processo
        </h1>
        <p style={{ margin: "0 0 28px", color: "#4a4a4a" }}>
          Cole ou digite o processo id para gerar
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <label
            htmlFor="roteiro-text"
            style={{ fontWeight: 600, color: "#2b2b2b" }}
          >
            Processo ID
          </label>
          <input
            id="roteiro-text"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Digite aqui..."
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #c9c9c9",
              fontSize: "16px",
            }}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending}
            style={{
              padding: "14px 20px",
              borderRadius: "999px",
              border: "none",
              background: "#0f6fff",
              color: "white",
              fontWeight: 600,
              fontSize: "16px",
              cursor: isSending ? "not-allowed" : "pointer",
              boxShadow: "0 12px 30px rgba(15, 111, 255, 0.3)",
            }}
          >
            {isSending ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {feedback ? (
          <p
            role="status"
            aria-live="polite"
            style={{
              marginTop: "18px",
              color: status === "error" ? "#b00020" : "#1a5f2d",
              fontWeight: 600,
            }}
          >
            {feedback}
          </p>
        ) : null}
      </section>
    </main>
  );
}
