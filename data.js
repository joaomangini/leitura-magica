/* Biblioteca de histórias em português (pt-BR).
   Cada história tem páginas curtas — frases simples, boas para leitura em voz alta.
   level: 1 = Primeiras palavras, 2 = Frases, 3 = Pequenas histórias. */

window.LEVELS = [
  { n: 1, emoji: "🌱", name: "Primeiras palavras", hint: "frases bem curtas" },
  { n: 2, emoji: "📖", name: "Frases", hint: "histórias com frases maiores" },
  { n: 3, emoji: "🚀", name: "Pequenas histórias", hint: "textos mais longos" }
];

window.STORIES = [
  /* ----------------------- Nível 1 — Primeiras palavras ----------------------- */
  {
    id: "gato-rato",
    emoji: "🐭",
    level: 1,
    title: "O Gato e o Rato",
    pages: [
      "O gato é preto.",
      "O rato é pequeno.",
      "O gato viu o rato.",
      "O rato correu rápido.",
      "O gato não pegou.",
      "O rato ficou feliz."
    ]
  },
  {
    id: "a-bola",
    emoji: "⚽",
    level: 1,
    title: "A Bola",
    pages: [
      "A bola é azul.",
      "Eu chuto a bola.",
      "A bola pula alto.",
      "A bola rola no chão.",
      "Que bom brincar!"
    ]
  },
  {
    id: "o-pato",
    emoji: "🦆",
    level: 1,
    title: "O Pato",
    pages: [
      "O pato é amarelo.",
      "O pato nada no lago.",
      "O pato faz quá-quá.",
      "O pato come pão.",
      "O pato dorme na grama."
    ]
  },
  {
    id: "vaca-mimosa",
    emoji: "🐮",
    level: 1,
    title: "A Vaca Mimosa",
    pages: [
      "A vaca é branca.",
      "A vaca come capim.",
      "A vaca faz muu.",
      "A vaca dá leite.",
      "O leite é bom."
    ]
  },

  /* --------------------------- Nível 2 — Frases --------------------------- */
  {
    id: "sapo-lua",
    emoji: "🐸",
    level: 2,
    title: "O Sapo e a Lua",
    pages: [
      "O sapo verde mora perto do lago.",
      "Toda noite ele olha para a lua no céu.",
      "A lua é grande, branca e brilhante.",
      "O sapo quer pular bem alto para tocar a lua.",
      "Ele pula, pula e pula sem parar.",
      "Mas a lua está muito longe dele.",
      "Então o sapo sorri e canta uma canção feliz."
    ]
  },
  {
    id: "joaninha",
    emoji: "🐞",
    level: 2,
    title: "A Joaninha Curiosa",
    pages: [
      "A joaninha tem pintinhas pretas nas asas.",
      "Ela voa de flor em flor pelo jardim.",
      "Hoje a joaninha quer conhecer lugares novos.",
      "Ela passa pela rosa, pelo girassol e pela margarida.",
      "De repente começa a chover no jardim.",
      "A joaninha se esconde embaixo de uma folha verde.",
      "Quando o sol volta, ela voa feliz de novo."
    ]
  },
  {
    id: "cachorro-caramelo",
    emoji: "🐶",
    level: 2,
    title: "O Cachorro Caramelo",
    pages: [
      "O cachorro caramelo gosta muito de correr.",
      "Todo dia ele brinca no quintal de casa.",
      "Ele abana o rabo quando vê o dono.",
      "Na hora do almoço, ele come bem rápido.",
      "À noite, ele dorme pertinho da porta."
    ]
  },
  {
    id: "gato-botas",
    emoji: "🐱",
    level: 2,
    title: "O Gato de Botas",
    pages: [
      "Era uma vez um gato muito esperto.",
      "Ele usava botas e um chapéu bonito.",
      "O gato ajudava o seu dono todos os dias.",
      "Com astúcia, ele enganava o gigante mau.",
      "No final, todos viveram felizes para sempre."
    ]
  },
  {
    id: "estrela",
    emoji: "⭐",
    level: 2,
    title: "A Estrela Cadente",
    pages: [
      "No alto do céu mora uma estrela pequena.",
      "Ela quer descer para ver a Terra de perto.",
      "Numa noite escura, a estrela faz um pedido.",
      "Ela risca o céu deixando um rastro de luz.",
      "As crianças apontam e fazem um pedido também."
    ]
  },

  /* --------------------- Nível 3 — Pequenas histórias --------------------- */
  {
    id: "tartaruga-lebre",
    emoji: "🐢",
    level: 3,
    title: "A Tartaruga e a Lebre",
    pages: [
      "A lebre vivia se gabando de ser a mais veloz da floresta.",
      "Cansada das provocações, a tartaruga a desafiou para uma corrida.",
      "Confiante, a lebre disparou na frente e logo parou para descansar.",
      "Devagar e sem parar, a tartaruga seguiu firme pelo caminho.",
      "Quando a lebre acordou, a tartaruga já cruzava a linha de chegada.",
      "E assim todos aprenderam que a constância vence a pressa."
    ]
  },
  {
    id: "pequeno-inventor",
    emoji: "🔧",
    level: 3,
    title: "O Pequeno Inventor",
    pages: [
      "Tomás adorava construir coisas com peças e parafusos velhos.",
      "Numa tarde chuvosa, ele decidiu criar um robô ajudante.",
      "Depois de muitas tentativas, as luzes do robô finalmente acenderam.",
      "O robozinho passou a ajudar Tomás a organizar os brinquedos.",
      "Orgulhoso, o menino entendeu que errar faz parte de inventar."
    ]
  },
  {
    id: "floresta-encantada",
    emoji: "🌳",
    level: 3,
    title: "A Floresta Encantada",
    pages: [
      "No coração da floresta crescia uma árvore muito antiga e sábia.",
      "Os animais se reuniam à sua sombra para contar histórias.",
      "Certa vez, uma seca deixou o riacho quase sem água.",
      "Juntos, os bichos cavaram um novo caminho para a nascente.",
      "Com esforço e amizade, a floresta voltou a florescer."
    ]
  },

  /* ----- mais histórias ----- */
  {
    id: "o-sol",
    emoji: "☀️",
    level: 1,
    title: "O Sol",
    pages: [
      "O sol é quente.",
      "O sol brilha no céu.",
      "O dia está claro.",
      "Eu vejo o sol.",
      "Que lindo dia!"
    ]
  },
  {
    id: "a-casa",
    emoji: "🏠",
    level: 1,
    title: "A Minha Casa",
    pages: [
      "A casa é grande.",
      "A porta é azul.",
      "Tem uma flor na janela.",
      "Eu moro na casa.",
      "Minha casa é boa."
    ]
  },
  {
    id: "peixinho-dourado",
    emoji: "🐟",
    level: 2,
    title: "O Peixinho Dourado",
    pages: [
      "O peixinho dourado vive no aquário.",
      "Ele nada o dia inteiro entre as pedrinhas.",
      "Quando vê comida, ele fica bem rápido.",
      "À noite, as luzes do aquário se apagam.",
      "E o peixinho descansa bem quietinho."
    ]
  },
  {
    id: "chuva-telhado",
    emoji: "🌧️",
    level: 2,
    title: "A Chuva no Telhado",
    pages: [
      "As nuvens cinzentas cobriram o céu.",
      "Começou a cair uma chuva fininha.",
      "As gotas faziam música no telhado.",
      "As crianças olhavam pela janela.",
      "Depois da chuva, nasceu um arco-íris."
    ]
  },
  {
    id: "tesouro-vovo",
    emoji: "🗺️",
    level: 3,
    title: "O Tesouro do Vovô",
    pages: [
      "O vovô guardava uma caixa antiga no sótão.",
      "Dentro dela havia mapas, moedas e fotografias.",
      "Cada objeto contava uma história de viagem.",
      "Naquela tarde, ele dividiu cada lembrança com o neto.",
      "O verdadeiro tesouro, descobriram juntos, eram as memórias."
    ]
  },
  {
    id: "menina-vento",
    emoji: "🍃",
    level: 3,
    title: "A Menina e o Vento",
    pages: [
      "Sofia adorava soltar pipa no fim da tarde.",
      "Certo dia, o vento ficou forte demais.",
      "A pipa subiu tão alto que sumiu nas nuvens.",
      "Em vez de chorar, Sofia fez um novo desenho.",
      "No dia seguinte, construiu uma pipa ainda mais bonita."
    ]
  }
];
