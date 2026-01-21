# cdn-intelexia â€” DocumentaÃ§Ã£o de Uso (Blog Post WordPress)
  - Tokens extras úteis: `--layout-max-width`, `--layout-padding`, `--color-warning-bg`, `--color-warning-border`.

Objetivo: padronizar o CSS dos artigos com escopo restrito ao conteÃºdo do post no WordPress, permitindo troca global de cores/tema por cliente via variÃ¡veis CSS (Custom Properties).

---

## Regra 1 â€” Escopo obrigatÃ³rio
- O CSS sÃ³ se aplica ao conteÃºdo do post.
- Todos os seletores sÃ£o escopados com `.article`.
- Tokens e temas sÃ£o definidos no prÃ³prio wrapper do post para nÃ£o vazar para header/footer/sidebar.

Wrapper exigido no template Single Post (Elementor):
```html
<article class="article" itemscope itemtype="https://schema.org/Article" data-theme="cdn-intelexia">
  <!-- Aqui dentro vai o widget "Post Content" -->
</article>
```

Carregamento do CSS (Elementor â†’ Custom Code):
- Conditions: `singular/posts` APENAS.
- Insira os links de CSS no <head> conforme a ordem de import abaixo.

---

## Estrutura do CDN e Ordem de import
Arquivos hospedados no CDN (exemplo de path):
```
/css/
  /v1/
    /tokens/
      core.css
    /themes/
      cdn-intelexia.css
    /base/
      reset.css
      typography.css
      layout.css
    /components/
      article.css
      buttons.css
      table.css
      card.css
      itx-figure.css
      boxes.css
      utilities.css
```

Ordem de import recomendada (no <head> e condicionado a `singular/posts`):
```html
<!-- Tokens base (escopados ao article) -->
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/tokens/core.css">

<!-- Base -->
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/base/reset.css">
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/base/typography.css">
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/base/layout.css">

<!-- Componentes -->
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/components/article.css">
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/components/buttons.css">
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/components/table.css">
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/components/card.css">
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/components/itx-figure.css">
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/components/boxes.css">
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/components/utilities.css">

<!-- Tema do cliente (override de variÃ¡veis) -->
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/themes/cdn-intelexia.css">
```

---

## Tokens e Temas (cores globais por cliente)

- Tokens (base) definidos no wrapper do post:
  - Arquivo: `css/v1/tokens/core.css`
  - Seletor: `article.article { ... }`
  - VariÃ¡veis semÃ¢nticas de cor, tipografia, espaÃ§amentos, raios e sombras.

- Tema por cliente (override das variÃ¡veis semÃ¢nticas):
  - Arquivo: `css/v1/themes/cdn-intelexia.css`
  - Seletor: `article.article[data-theme="cdn-intelexia"] { ... }`
  - AtivaÃ§Ã£o: atributo `data-theme="cdn-intelexia"` no `<article class="article">`.

PrincÃ­pios:
- Componentes nÃ£o usam cores HEX diretamente; sempre `var(--color-*)`.
- Para trocar o cliente: crie `themes/cliente-x.css`, ajuste variÃ¡veis e mude `data-theme="cliente-x"` no wrapper.

---

## Tags suportadas e regras de aplicação (sempre dentro de `.article`)

- `article.article`
  - Papel: wrapper do post; centraliza e aplica o layout padrão.
  - Propriedades: `max-width: var(--layout-max-width)`, `padding: var(--layout-padding)`, `background: var(--color-bg)`, `box-shadow: var(--shadow-sm)`.
  - Atributos: `itemscope itemtype="https://schema.org/Article"`, `data-theme="cdn-intelexia"`.

- `h1`
  - Uso: título principal (único).
  - Regra: `font-size: var(--fs-800)`, `line-height: 1.2`, cor `var(--color-heading)`.

- `h2`, `h3`
  - Uso: seções/subseções.
  - Regras: cor `var(--color-heading)` e margens definidas em `components/article.css` (`var(--s6)` e `var(--s5)`).

- `p`
  - Regra: `font-size: var(--fs-400)`, `line-height: 1.7`, `margin: var(--s3) 0`.

- `ul`, `ol`, `li`
  - Regra: `margin: var(--s3) 0 var(--s4)`, `padding-inline-start: 1.4rem`.

- `a`
  - Links herdam `var(--color-link)` e ganham peso 600. Para CTAs utilize `.itx-btn` e modificadores (`.itx-btn--primary`, `.itx-btn--whatsapp`).

- `figure`, `img`, `figcaption`
  - Use quando precisar de legenda. O helper `.itx-figure` centraliza e aplica sombra/raio.

- Tabelas (`.itx-table`)
  - Envolva o `<table>` em `<figure class="itx-table">` para obter borda, scroll horizontal e cabeçalho destacado (`--color-table-head-bg`).

- Blocos de destaque
  - `.itx-highlight-box`, `.itx-info-box`, `.itx-note` aplicam o estilo de callout com borda lateral de 6 px.
  - `.itx-callout` gera o bloco institucional / CTA centralizado (rodapé).

- Utilitários
  - `.itx-u-*` (espaçamentos, alinhamento, conteúdo oculto) seguem prefixo `itx-` para evitar conflitos com temas.

---

## Classes de componentes (dentro de `.article`)

- `.itx-kicker`: texto superior (categoria/subcategoria).
- `.itx-meta`: linha itx-meta (data, itx-badges) com flex layout.
- `.itx-badge`: chip com borda e fundo superfÃ­cie.
- `.itx-highlight-box`, `.itx-info-box`, `.itx-note`: caixas com borda lateral de 6px; fundos controlados por `--color-surface-highlight`, `--color-surface-alt` e `--color-warning-bg`.
- `.itx-resumo-executivo`: bloco de resumo com fundo `--color-surface-highlight`.
- `.itx-cta-row`: linha de CTAs com `display: flex`, `gap` e `wrap`.
- `.itx-btn`, `.itx-btn--primary`, `.itx-btn--whatsapp`: botÃµes e variantes semÃ¢nticas.
- `.itx-table`: contêiner com borda/scroll; destaca `thead` usando `--color-table-head-bg`.
- `.itx-card-grid`, `.itx-card`: grid responsivo de cards com sombra média e hover suave.
- `.itx-figure`: estilos para imagens e legendas.
- `.itx-sources`: bloco de fontes com fundo `--color-surface-muted` e borda sólida.
- `.itx-conclusao-*`: gradiente leve para seções finais.
- `.itx-hr`: separador fino.
- `.itx-container`: helper de largura (layout).
- `.itx-full-bleed`: seÃ§Ã£o full width dentro do post.


Variantes/Utilitários:
- `.itx-highlight-box--primary`, `.itx-note--primary`: borda-esquerda com `--color-primary`.
- `.itx-highlight-box--success`, `.itx-note--success`: borda-esquerda com `--color-success` e fundo `--color-whatsapp-bg`.
- `.itx-u-mb-0`, `.itx-u-mb-s2`, `.itx-u-mb-s3`, `.itx-u-mb-s4`, `.itx-u-mt-s3`, `.itx-u-p-s4`
- `.itx-u-text-center`, `.itx-u-text-right`, `.itx-u-visually-hidden`
---

## IntegraÃ§Ã£o no Elementor (passo a passo)

1) Template Single Post:
   - Envolver o widget â€œPost Contentâ€ com um itx-container/Section:
     - Tag: `article`
     - CSS Classes: `article`
     - Atributos: `itemscope itemtype="https://schema.org/Article" data-theme="cdn-intelexia"`

2) Custom Code (Elementor â†’ Custom Code):
   - Adicionar cada `<link rel="stylesheet" ...>` conforme ordem de import.
   - Definir Condition: `singular/posts` (apenas posts).

3) ConteÃºdo:
   - Usar as classes conforme documentaÃ§Ã£o acima.
   - Manter hierarquia de headings (H1 Ãºnico; depois H2/H3).

Exemplo simplificado dentro de `<article class="article" ...>`:
```html
<div class="itx-kicker">Categoria â€¢ Subcategoria</div>
<h1>TÃ­tulo do Post</h1>
<div class="itx-meta">
  <span class="itx-badge">Sem comentÃ¡rios</span>
  <time datetime="2025-01-01">1 jan 2025</time>
</div>

<section class="itx-highlight-box itx-resumo-executivo">
  <strong>Ponto Central â€”</strong> Resumo do artigo em 2-3 frases.
</section>

<div class="itx-cta-row">
  <a class="itx-btn itx-btn--whatsapp" href="#">ðŸ’¬ Falar no WhatsApp</a>
  <a class="itx-btn itx-btn--primary" href="#ancora">Chamada Principal</a>
</div>

<h2 id="secao-1">SeÃ§Ã£o</h2>
<p>ParÃ¡grafo com conteÃºdo.</p>

<figure class="itx-table">
  <table>
    <thead><tr><th>Coluna 1</th><th>Coluna 2</th></tr></thead>
    <tbody>
      <tr><td>Valor 1</td><td>Valor 2</td></tr>
      <tr><td>Valor 3</td><td>Valor 4</td></tr>
    </tbody>
  </table>
</itx-figure>

<itx-figure class="itx-figure">
  <img src="..." width="1200" height="628" alt="DescriÃ§Ã£o detalhada" loading="lazy" decoding="async">
  <figcaption>Legenda da imagem</figcaption>
</itx-figure>

<aside class="itx-info-box note">
  <strong>ObservaÃ§Ã£o:</strong> Nota importante contextualizada.
</aside>

<section class="itx-sources">
  <h2>Fontes de referÃªncia</h2>
  <ul>
    <li><a href="#" rel="noopener nofollow">Fonte 1</a></li>
  </ul>
</section>
```

---

## Boas prÃ¡ticas, Acessibilidade e Performance
- Tipografia base mÃ­nima: `--fs-400 >= 1.0625rem`.
- Links com texto descritivo; evitar â€œclique aquiâ€.
- Imagens secundÃ¡rias com `loading="lazy"`, `decoding="async"`, `width`/`height` definidos.
- Usar apenas variÃ¡veis CSS nos componentes (nÃ£o usar valores HEX diretos).
- Evitar sobrescrever estilos fora do `.article`.

---

## Versionamento
- VersÃ£o atual: `/css/v1/â€¦`
- MudanÃ§as com quebra de compatibilidade devem ir para `/css/v2/â€¦`.
- Manter compatibilidade retroativa sempre que possÃ­vel.

---

## Criar um novo tema de cliente
1) Copie `css/v1/themes/cdn-intelexia.css` para `css/v1/themes/cliente-x.css`.
2) Ajuste variÃ¡veis necessÃ¡rias (`--color-brand`, `--color-heading`, `--color-surface-highlight`, etc.).
3) No template, troque `data-theme="cdn-intelexia"` por `data-theme="cliente-x"` no `<article class="article">`.

---

## Uso com bundle (produÃ§Ã£o)
- Em produÃ§Ã£o, recomenda-se incluir apenas o bundle minificado:
```html
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/bundle/cdn-intelexia.min.css">
```
- Em homologaÃ§Ã£o/depuraÃ§Ã£o, pode-se usar o bundle legÃ­vel:
```html
<link rel="stylesheet" href="https://cdn.seitx-u-dominio.com/css/v1/bundle/cdn-intelexia.css">
```
- ObservaÃ§Ã£o: o bundle jÃ¡ respeita a ordem correta (tokens â†’ base â†’ componentes â†’ tema). Mantenha o wrapper do post com `data-theme="cdn-intelexia"`.

---

Checklist rÃ¡pido de validaÃ§Ã£o
- [ ] CSS carregado apenas em `singular/posts`.
- [ ] Wrapper `<article class="article" ... data-theme="...">` presente.
- [ ] H1 Ãºnico, hierarquia H2/H3 correta.
- [ ] Tabela com `<thead>` obrigatÃ³rio.
- [ ] Imagens com `alt`, `width`, `height`.
- [ ] Caixas de destaque com classes `.itx-highlight-box`, `.itx-info-box` ou `.note`.
- [ ] CTAs com `.itx-btn`, `.itx-btn--primary` ou `.itx-btn--whatsapp`.
- [ ] Fontes listadas em `.itx-sources`.

