import Link from "next/link";
import { articles } from "./artigos/data";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      {articles.map((article) => (
        <div key={article.id} style={{ marginBottom: 40 }} className="divHome">
          <h2>{article.payload.theme}</h2>

          <pre>{JSON.stringify(article.payload, null, 2)}</pre>

          <Link href={`/artigos/${article.id}`}>
            Ver artigo gerado
          </Link>
        </div>
      ))}
    </main>
  );
}
