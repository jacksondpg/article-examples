import { articles } from "../data";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <main className="prose max-w-none p-6">
      <h1>{article.payload.theme}</h1>

      <div
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </main>
  );
}
