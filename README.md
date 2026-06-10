# 📖 Leitura Mágica

App de estudo para **alfabetização infantil**: a criança lê uma história em voz alta, o app
**escuta** (reconhecimento de voz do navegador), **compara** com o texto esperado e dá
**feedback de leitura** — destaca acertos, trocas e palavras puladas, mostra precisão,
fluência (palavras por minuto) e uma lista de palavras para treinar (com pronúncia correta).

É um **PWA** (app web instalável): roda no navegador e pode ser "instalado" no celular.

## Como rodar (computador)

O reconhecimento de voz exige um *contexto seguro* (`localhost` ou `https`).
Não basta abrir o `index.html` direto — sirva por um servidor local:

```bash
# opção 1 (Node)
npx serve .

# opção 2 (Python)
python -m http.server 8000
```

Depois abra `http://localhost:8000` (ou a porta indicada) no **Google Chrome**.

## Como testar no celular (Android)

O microfone no celular precisa de **HTTPS**. Caminhos fáceis:

- **GitHub Pages**: suba a pasta num repositório e ative o Pages → vira um link `https://...`.
- **Netlify / Vercel**: arraste a pasta e ganhe um link https na hora.
- **ngrok**: `ngrok http 8000` expõe seu servidor local com https temporário.

Abra o link no **Chrome do Android**, permita o microfone e toque em "Instalar app".

## Estrutura

| Arquivo         | Função                                                            |
|-----------------|-------------------------------------------------------------------|
| `index.html`    | Telas (biblioteca + leitor)                                       |
| `styles.css`    | Visual mobile, colorido e infantil                                |
| `data.js`       | Histórias de exemplo (texto esperado)                             |
| `alignment.js`  | **Motor de correção**: alinha fala × texto, classifica palavras   |
| `speech.js`     | Reconhecimento de voz (ouvir) e síntese (falar a palavra certa)   |
| `app.js`        | Liga tudo: navegação, microfone, relatório                        |
| `manifest.json` + `sw.js` | Tornam o app instalável / offline                       |

## Cores das palavras

- 🟢 **Verde** = leu certo
- 🔴 **Vermelho** = trocou a palavra
- 🟡 **Amarelo** (sublinhado) = pulou a palavra
- ⚪ **Normal** = ainda não leu

## Limitações conhecidas

- **iPhone/Safari**: suporte instável à Web Speech API. Para iOS garantido, migrar para
  Whisper (offline) ou um serviço de nuvem (Azure/Google).
- Voz infantil é mais difícil para o reconhecedor — por isso há o controle de **Rigor**
  (Fácil/Médio/Difícil), que ajusta a tolerância na comparação.
