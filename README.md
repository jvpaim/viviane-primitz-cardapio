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
