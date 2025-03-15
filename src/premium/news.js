const { randomizeThis } = require("../templates/info")

const topics = ["Lifestyle", "Business", "Entertainment", "General", "Health", "Science", "Technology", "World"]
const subtopics = [
  { id: "entertainment", name: "Entretenimento" },
  { id: "arts", name: "Artes" },
  { id: "books", name: "Livros" },
  { id: "celebrities", name: "Celebridades" },
  { id: "gaming", name: "Jogos" },
  { id: "movies", name: "Filmes" },
  { id: "music", name: "M�sica" },
  { id: "tv", name: "Televis�o" },
  { id: "general", name: "Geral" },
  { id: "fitness", name: "Fitness" },
  { id: "lifestyle", name: "Estilo de Vida" },
  { id: "beauty", name: "Beleza" },
  { id: "cooking", name: "Culin�ria" },
  { id: "fashion", name: "Moda" },
  { id: "tourism", name: "Turismo" },
  { id: "science", name: "Ci�ncia" },
  { id: "climate", name: "Clima" },
  { id: "environment", name: "Meio Ambiente" },
  { id: "genetics", name: "Gen�tica" },
  { id: "geology", name: "Geologia" },
  { id: "physics", name: "F�sica" },
  { id: "space", name: "Espa�o" },
  { id: "wildlife", name: "Vida Selvagem" },
  { id: "technology", name: "Tecnologia" },
  { id: "esports", name: "Esportes Eletr�nicos" },
  { id: "ai", name: "Intelig�ncia Artificial" },
  { id: "computing", name: "Computa��o" },
  { id: "cybersec", name: "Ciberseguran�a" },
  { id: "gadgets", name: "Dispositivos" },
  { id: "internet", name: "Internet" },
  { id: "mobile", name: "Celulares" },
  { id: "robot", name: "Rob�tica" },
  { id: "vr", name: "Realidade Virtual" },
  { id: "world", name: "Mundo" },
  { id: "culture", name: "Cultura" },
  { id: "history", name: "Hist�ria" }
];


const getRandomTopic = async () => {
  let randomTopic = ""
  randomTopic = randomizeThis(topics);
  response = await getNewsApi(randomTopic);
  return { topic: randomTopic, data: response };
}

const getRandomSubtopic = async () => {
  let randomSubtopic = "";
  randomSubtopic = randomizeThis(subtopics);
  response = await getNewsApi(randomSubtopic.id);
  return { topic: randomSubtopic.name, data: response };
}

const getNewsApi = async (topic) => {
  let response = "";
  response = await axios({
    method: 'GET',
    hostname: 'news-api14.p.rapidapi.com',
    port: null,
    path: `/v2/trendings?topic=${topic}&language=pt&country=br&limit=5`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  }).then((res) => res.success && res.data)
  .catch((err) => console.error(err.data || err));
  return response;

}

module.exports = {
  getNewsApi,
  getRandomTopic,
  getRandomSubtopic,
}