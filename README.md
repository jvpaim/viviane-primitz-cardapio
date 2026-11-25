# Viviane Primitz Confeitaria · Cardápio online

Site estático (HTML, CSS e JavaScript puro, sem dependências) com o cardápio de Natal da Viviane Primitz Confeitaria. Cada botão abre o WhatsApp da confeiteira com uma mensagem já preenchida com o nome do produto.

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Boas-vindas com brilhos animados, quiz "Qual doce é a sua cara?" e destaques |
| `chocotones.html` | Chocotone tradicional, com cobertura, trufado (seletor P/M/G) e ChocoMimo |
| `sobremesas.html` | Sobremesas natalinas: morango, abacaxi, banoffee e uva |
| `alfajores.html` | Alfajores com "Monte sua caixinha" (soma quantidades e total) |
| `sobre.html` | História, WhatsApp, Instagram, horários, Pix e chamadas para festas |

## Estrutura

```
├── index.html, chocotones.html, sobremesas.html, alfajores.html, sobre.html
├── css/style.css        # todo o visual (paleta e fontes nas variáveis :root)
├── js/main.js           # WhatsApp, tamanhos, caixinha, quiz, Pix, animações
├── assets/img/          # fotos em WebP (versão grande e -sm para celular)
├── assets/logo/         # logo oficial (SVG) e ícones
├── assets/og-image.jpg  # imagem de compartilhamento (WhatsApp, Instagram)
└── vercel.json          # URLs limpas e cache dos arquivos estáticos
```

## Como editar

- **Número do WhatsApp / Pix:** `CONFIG` no topo de `js/main.js`. Os links `href` nos HTMLs são apenas reserva (caso o JS não carregue); procure por `5588996527350` para trocar em todos.
- **Preços com tamanho (chocotones):** atributo `data-price` de cada opção e o texto `R$` ao lado, em `chocotones.html`.
- **Preços dos alfajores:** `data-price` de cada `<li class="flavor-row">` e o texto do cabeçalho do grupo em `alfajores.html`.
- **Mensagens do WhatsApp:** atributo `data-wa` de cada botão.
- **Cores e fontes:** variáveis no início de `css/style.css`.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar na Vercel

1. Em vercel.com, clique em **Add New → Project** e importe este repositório.
2. Framework Preset: **Other**. Não há comando de build; o diretório de saída é a raiz.
3. Clique em **Deploy**.

Com `cleanUrls` ativo, as páginas também abrem sem `.html` (ex.: `/chocotones`).
