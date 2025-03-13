const { default: axios } = require('axios');
const { randomizeThis, msg_bom_dia } = require('../templates/info');
const { DOTY_APIKEY } = process.env

const bomDia = async () => {
  const today = new Date();
  const hojeYear = today.toLocaleDateString('pt-br', {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hojeMonth = today.toLocaleDateString('pt-br', {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  const hojeWeekday = today.toLocaleDateString('pt-br', {
    weekday: "long"
  })
  const doty = await dayOfTheYear() || '';
  const msg_positividade = randomizeThis(msg_bom_dia);
  const msg_bomdia = randomizeThis([`Hoje � ${hojeYear}.`,
                                    `Finalmente � ${hojeMonth}!`,
                                    `Ol�! Hoje � ${hojeYear}.`,
                                    `Bom dia. Hoje � ${hojeYear}.`,
                                    `Preparado para encarar esta ${hojeWeekday}?`,
                                    `Chegamos na ${hojeYear}`,
                                    `Pronto para enfrentar esta ${hojeWeekday}?`,
                                    `Segure minha m�o e vamos juntos encarar esta ${hojeMonth}.`,
                                    `Marque no seu calend�rio! Hoje � ${hojeYear}`,
                                    `Nessa ${hojeWeekday}, desejamos o melhor pra voc�!`,
                                    `Hoje � dia do abra�o!! (mentira, hoje � ${hojeWeekday})`,
                                    `Pois olha ela, a ${hojeMonth}!`,
                                    `Quem diria que chegar�amos inteiros na ${hojeYear}?`,
                                    `Muito mais que bom dia para esta ${hojeYear}`,
                                    `Aquele nosso bom dia especial pra voc� nessa ${hojeMonth}`,
                                    `Desejamos tudo de bom pra voc� nessa ${hojeMonth}.`
                                  ]);
  const msg_final = msg_bom_dia + "\n\n"
}

const getDoty = async () => {
  return await axios({
    method: 'GET',
    url: 'https://www.daysoftheyear.com/api/v1/today/?timezone_offset=-3',
    headers: {
      'X-Api-Key': DOTY_APIKEY
    },
  }).then((res) => {
    if (res.data.code === 200) return res.data.data;
    else throw new Error({ data: 'Erro ao buscar Days of the Year' })
  }).catch((err) => {
    console.error('Erro getting DOTY', err)
    return err.data || err;
  })
}

const dayOfTheYear = async () => {
  const doty = await getDoty();
  const filteredDoty = doty.filter((days) => days.type === 'day')
  const { name, excerpt } = filteredDoty[Math.floor(Math.random() * filteredDoty.length)]
  const translateThis = name + ' - ' + excerpt;
  const translated = await googleTranslate({ query: translateThis, source: 'en', target: 'pt-BR' })
  return translated;
}

module.exports = {
  bomDia
}