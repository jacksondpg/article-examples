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

  const themeTitle = article.payload.theme;
  const html = article.html;

  return (
    <article
      className="article itx-article intelexia-article"
      data-theme="cdn-intelexia"
      data-intelexia-cdn-wrapper="1"
      itemScope
      itemType="https://schema.org/Article"
    >
      {themeTitle ? <h1>{themeTitle}</h1> : null}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
