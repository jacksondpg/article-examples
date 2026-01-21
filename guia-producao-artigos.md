# Guia de producao de artigos compativeis com o Intelexia CDN

Este guia consolida as regras obrigatorias para redigir e estruturar artigos no WordPress usando o tema Wetax em conjunto com o plugin **Intelexia CDN Customizer** e o pacote CSS publicado em `cdn-intelexia-css`. Siga estas instrucoes sempre que criar ou revisar um post para garantir 100% de compatibilidade visual e funcional.

---

## 1. Como o plugin Intelexia CDN Customizer atua
- O plugin carrega automaticamente o bundle `styles.min.css` (por padrao `https://cdn.jsdelivr.net/gh/intelex-ia/cdn-intelexia-css@latest/styles.min.css`) sempre que a pagina atual for `is_singular( 'post' )`.
- Antes de exibir o conteudo, o plugin envolve o HTML publicado em `<article class="article itx-article intelexia-article" data-theme="[slug]" data-intelexia-cdn-wrapper="1">...</article>`. Nao crie um wrapper adicional igual dentro do editor.
- As variaveis CSS (cores, fontes, raios, sombras e layout) sao injetadas inline de acordo com as opcoes salvas em **Settings > Intelexia CDN**. O slug informado em `Tema (data-theme)` precisa existir em `css/v1/themes/`.
- O plugin escreve `<link rel="preload" as="style">` no `<head>` e aplica `integrity`/`crossorigin` ao stylesheet sempre que estes campos estiverem preenchidos.

---

## 2. Pipeline de producao
1. **Confirmar o ambiente**  
   - O post deve ser do tipo `post`. Custom post types nao recebem o wrapper sem filtro adicional.  
   - Verifique se o plugin esta ativo e se o tema correto esta selecionado no painel.
2. **Preparar o texto base**  
   - Estruture a narrativa com H1 unico, H2/H3 hierarquicos e paragrafo introdutorio forte.  
   - Liste CTAs, boxes, tabelas, cases e secoes de FAQ que o conteudo exige.
3. **Montar o HTML no editor**  
   - O conteudo precisa ficar dentro do bloco principal do post.  
  - Use blocos HTML personalizados ou o modo HTML do Gutenberg para aplicar as classes `itx-*`.
4. **Validar antes de publicar**  
   - Visualize a pagina e garanta que todos os componentes renderizem com o estilo esperado.  
   - Rode o checklist da secao 6 antes de marcar o post como pronto.

---

## 3. Estrutura obrigatoria do topo do artigo
- `itx-kicker` (opcional, recomendavel para categoria ou mote).
- `<h1>` unico com o titulo principal do post.
- `itx-meta`: badge de status, data (`<time datetime="AAAA-MM-DD">`) e, se necessario, informacao de leitura. Use `itx-badge` para o chip.
- `itx-highlight-box itx-resumo-executivo`: resumo executivo com duas ou tres frases chave.
- `itx-cta-row`: botoes principais.  
  - `itx-btn itx-btn--whatsapp` para o link direto.  
  - `itx-btn itx-btn--primary` para demais funis (formulario, diagnostico etc.).

Exemplo de cabecalho (cole em um bloco HTML):

```html
<div class="itx-kicker">Planejamento financeiro regional</div>
<h1>Sua empresa esta crescendo - mas sua estrutura financeira esta pronta?</h1>
<div class="itx-meta">
  <span class="itx-badge">Atualizado em 11/10/2025</span>
  <time datetime="2025-10-11">11 out 2025</time>
</div>

<section class="itx-highlight-box itx-resumo-executivo">
  <strong>Atencao:</strong> Crescer no interior paulista exige caixa previsivel, disciplina societaria e leitura fina do mercado local. Este artigo mostra como aplicar a metodologia Wetax para escalar com seguranca.
</section>

<div class="itx-cta-row">
  <a class="itx-btn itx-btn--whatsapp" href="https://api.whatsapp.com/send/?phone=5519992055412" target="_blank" rel="noopener">Falar com a Wetax</a>
  <a class="itx-btn itx-btn--primary" href="https://wetax.com.br/contato" target="_blank" rel="noopener">Solicitar diagnostico</a>
</div>
```

---

## 4. Componentes suportados dentro de `.article`

| Componente | Como usar | Observacoes |
|------------|-----------|-------------|
| Headings | `<h2>` para secoes principais, `<h3>` para subtitulos | Respeite a hierarquia; sem pular niveis |
| Paragrafos | `<p>` | Sem inline style; aproveite as variaveis do tema |
| Listas | `<ul>`/`<ol>` com `<li>` | O padding ja e tratado pelo CSS escopado |
| Tabelas | `<figure class="itx-table">` envolvendo `<table>` com `<thead>` e `<tbody>` | Cabecalho obrigatorio; uma tabela por figure |
| Imagens | `<figure class="itx-figure">` com `<img>` + `<figcaption>` | Defina `alt`, `width`, `height`, `loading="lazy"` (exceto hero) |
| Boxes de destaque | `itx-highlight-box`, `itx-info-box`, `itx-note`, variantes `--primary` / `--success` | Utilize `<strong>` ou `<span>` inicial para rotulo |
| Callout institucional | `itx-callout` | Ideal para bloco final com contatos ou regioes atendidas |
| CTA em linha | `itx-cta-row` + `itx-btn` | Permite multiplos botoes alinhados |
| Fontes | `itx-sources` | Inclua `<h2>` ou `<h3>` seguido de lista de links |
| Utilitarios | `itx-u-*` (margem, alinhamento, visually hidden) | Use apenas quando a diagramacao exigir ajuste fino |

Outros auxiliares:
- `itx-card-grid` + `itx-card`: lista de cards (estudos de caso, posts relacionados, passos).
- `itx-conclusao-artigo` ou `itx-conclusao-capital-giro`: secoes finais com degrade suave.
- `itx-hr`: separador fino entre blocos.

---

## 5. Diretrizes de conteudo e acessibilidade
- **H1 unico**: nunca duplique o titulo em outro elemento.
- **Links**: use `rel="noopener nofollow"` para externos (exceto WhatsApp, que fica apenas com `noopener`).
- **Imagens**: todas com `alt` significativo, larguras/alturas definidas e `loading="lazy"` (menos a imagem principal se estiver fora do post).
- **CTA**: texto claro e acionavel. Evite "clique aqui".
- **Sem estilos inline**: a folha do CDN ja controla cores, pesos e espacamentos.
- **Sem wrappers extras**: nao insira `<article>` ou `<section>` com a classe `.article`. O plugin ja entrega isso.
- **Sem shortcodes legados**: converta boxes antigos para as classes do design system.

---

## 6. Checklist de validacao antes da publicacao
- [ ] Conteudo publicado em `post` (nao pagina ou custom post type).
- [ ] Visualizacao mostra `<article class="article itx-article intelexia-article" ...>` apenas uma vez (inspecione o elemento).
- [ ] `styles.min.css` carregado via inspector (componentes estilizados).
- [ ] H1 unico e headings H2/H3 em ordem.
- [ ] Boxes e CTAs usando apenas classes `itx-*`.
- [ ] Tabelas com `<thead>` e sem colunas vazias.
- [ ] Fontes listadas dentro de `.itx-sources`.
- [ ] Links externos com `rel` correto e abrindo em nova aba quando apropriado.
- [ ] Nenhum erro no console relacionado ao CSS/CDN.

---

## 7. Ajustes via painel (quando necessario)
1. Acesse **Settings > Intelexia CDN**.
2. Ajuste:
   - `URL da CDN`: altere se for usar outro host ou versao. Mantenha bundle unico para producao.
   - `Subresource Integrity` e `Crossorigin`: obrigatorios se o arquivo estiver em CDN publico.
   - `Tema (data-theme)`: precisa corresponder ao arquivo em `css/v1/themes/`. Exemplo: `wetax-2025`.
   - Secoes de **Tipografia**, **Cores**, **Sombras/layout** e **Bordas** alimentam as variaveis inline (usadas por todas as classes `itx-*`).
3. Salve e atualize um post para validar se as declaracoes foram injetadas. O plugin escreve `article.article[data-theme="slug"] { ... }`.

---

## 8. Solucao de problemas rapida
- **Estilo nao aplicado**: confirme que o editor nao converteu o HTML para blocos incompativeis; valide se a classe `itx-*` esta exatamente igual ao esperado.
- **Wrapper duplicado**: se o tema ja possui artigo com `data-intelexia-cdn-wrapper="1"`, desative o auto-wrap via filtro ou remova o wrapper manual extra.
- **Tema errado**: verifique se o slug salvo no painel existe em `css/v1/themes/` e se o atributo `data-theme` confere.
- **Novos componentes**: adicione primeiro o CSS em `cdn-intelexia-css`, publique o bundle e so entao utilize a nova classe no conteudo.

---

Seguindo este roteiro, cada artigo permanece dentro do escopo `.article`, consome o bundle do CDN sem quebra visual e aproveita integralmente as configuracoes dinamicas do Intelexia CDN Customizer.
