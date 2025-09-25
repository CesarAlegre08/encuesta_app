import type { VotingQuestion } from "./types"

export const votingQuestions: VotingQuestion[] = [
  {
    id: "1",
    question_text: "¿Qué es lo que más te atrae de la Carrera?",
    type: "multiple_choice",
    options: [
      { id: "1a", text: "Profesores" },
      { id: "1b", text: "Formación recibida" },
      { id: "1c", text: "Compañeros" },
    ],
  },
  {
    id: "2",
    question_text: "A tu parecer, ¿Quién es el más exigente?",
    type: "multiple_choice",
    options: [
      { id: "2a", text: "Miguel Arias (Kelo)", image: "/images/miguel-arias.png" },
      { id: "2b", text: "Rosa Fornerón", image: "/images/rosa-forneron.png" },
      { id: "2c", text: "Julián Ruiz", image: "/images/julian-ruiz.png" },
      { id: "2d", text: "Mireya Céspedes", image: "/images/mireya-cespedes.png" },
      { id: "2e", text: "Edgar Vergara", image: "/images/edgar-vergara.png" },
    ],
  },
  {
    id: "3",
    question_text: "¿Cuál es la cátedra que más te gusta entre estas?",
    type: "multiple_choice",
    options: [
      { id: "3a", text: "Gabinete 1 (Mireya)", image: "/images/gabinete-i.png" },
      { id: "3b", text: "Legislación Tributaria (Venancio)", image: "/images/legislacion-tributaria.png" },
      { id: "3c", text: "Matemática Financiera (Lorena)", image: "/images/matematica-financiera.png" },
      { id: "3d", text: "Organización y Método (Minu)", image: "/images/organizacion-metodos.png" },
    ],
  },
  {
    id: "4",
    question_text: "¿Cómo se llama la Secretaria General?",
    type: "multiple_choice",
    options: [
      { id: "4a", text: "Celeste Mendoza", image: "/images/celeste-mendoza.png" },
      { id: "4b", text: "Teresa López", image: "/images/teresa-lopez.png" },
      { id: "4c", text: "Bety Cáceres", image: "/images/bety-caceres.png" },
    ],
  },
  {
    id: "5",
    question_text: "¿Quién es el profe más churro?",
    type: "multiple_choice",
    options: [
      { id: "5a", text: "Julián Ruiz", image: "/images/julian-ruiz.png" },
      { id: "5b", text: "Miguel Arias", image: "/images/miguel-arias.png" },
      { id: "5c", text: "Nicolás Benítez", image: "/images/nicolas-benitez.png" },
      { id: "5d", text: "Pánfilo González", image: "/images/panfilo-gonzalez.png" },
      { id: "5e", text: "Pascual Jiménez", image: "/images/pascual-jimenez.png" },
    ],
  },
  {
    id: "6",
    question_text: "¿Quién es la Profe más churra?",
    type: "multiple_choice",
    options: [
      { id: "6a", text: "Rosa Fornerón", image: "/images/rosa-forneron.png" },
      { id: "6b", text: "Lorena Llano", image: "/images/lorena-llano.png" },
      { id: "6c", text: "Betina Guerrero", image: "/images/betina-guerrero.png" },
      { id: "6d", text: "Liz Vázquez", image: "/images/liz-vazquez.png" },
      { id: "6e", text: "Mireya Céspedes", image: "/images/mireya-cespedes.png" },
    ],
  },
  {
    id: "7",
    question_text: "¿Cuál es el profe que más te marcó en la carrera?",
    type: "text_input",
    options: [],
  },
  {
    id: "8",
    question_text: "¿Cuál fue tu peor pelada en la universidad?",
    type: "text_input",
    options: [],
  },
  {
    id: "9",
    question_text: "¿Cuál fue tu mejor día en la universidad?",
    type: "multiple_choice",
    options: [
      { id: "9a", text: "Juegos UCSI" },
      { id: "9b", text: "Festejos día de la juventud" },
      { id: "9c", text: "Día que ingresaste" },
      { id: "9d", text: "Día de exámenes" },
      { id: "9e", text: "Otro" },
    ],
  },
  {
    id: "10",
    question_text: "¿Cuál es tu expectativa al término de la carrera?",
    type: "multiple_choice",
    options: [
      { id: "10a", text: "Salida laboral" },
      { id: "10b", text: "Obtener todas las herramientas necesarias para ejercer la Profesión" },
      { id: "10c", text: "Ser un profesional íntegro formado en valores" },
    ],
  },
  {
    id: "11",
    question_text: "¿Quién es la Directora de la Unidad Pedagógica?",
    type: "multiple_choice",
    options: [
      { id: "11a", text: "Esperanza Del Puerto", image: "/images/esperanza-del-puerto.png" },
      { id: "11b", text: "Olga Ortiz", image: "/images/olga-ortiz.png" },
      { id: "11c", text: "Elvia Valdez", image: "/images/elvia-valdez.png" },
    ],
  },
  {
    id: "12",
    question_text: "¿Quién es el Director de la Carrera de Contabilidad?",
    type: "multiple_choice",
    options: [
      { id: "12a", text: "Edgar Vergara", image: "/images/edgar-vergara.png" },
      { id: "12b", text: "Amado Mereles", image: "/images/amado-mereles.png" },
      { id: "12c", text: "Don Cáceres", image: "/images/don-caceres.png" },
    ],
  },
  {
    id: "13",
    question_text: "¿Con quién te da más miedo rendir?",
    type: "multiple_choice",
    options: [
      { id: "13a", text: "Mireya Céspedes", image: "/images/mireya-cespedes.png" },
      { id: "13b", text: "Pánfilo González", image: "/images/panfilo-gonzalez.png" },
      { id: "13c", text: "Julián Ruiz", image: "/images/julian-ruiz.png" },
      { id: "13d", text: "Rosa Fornerón", image: "/images/rosa-forneron.png" },
    ],
  },
]
