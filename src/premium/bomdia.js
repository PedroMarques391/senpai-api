const { default: axios } = require('axios');
const { randomizeThis, msg_bom_dia } = require('../templates/info');
const { googleTranslate } = require('../utils/googletranslate');
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

  const hojePreface = [
    `Hoje � ${hojeYear}.`,
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
  ];

  const doty = await dayOfTheYear() || '';
  const msg_positividade = randomizeThis(msg_bom_dia);
  const msg_bomdia = randomizeThis(hojePreface);
  const msg_aniversariante = await getWishiy();

  const msg_final = msg_bomdia + " " + msg_positividade + "\n\n" + doty + "\n\n" + msg_aniversariante;
  return msg_final;
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

const getWishiy = async () => {
  const allWishiyes = await axios({
    method: 'POST',
    url: 'https://wishiy.com/api/today',
    data: {
      limit: 7,
      response: "json"
    }
  }).then((res) => res)
    .catch((err) => console.error(err.data || err));
  
  const wishiy = randomizeThis(allWishiyes);
  const jobTranslated = await googleTranslate({ query: wishiy.occupation, target: 'pt-br', source: 'en' })
  const g1 = wishiy.gender === 'male' ? 'e' : 'a'; 
  const g2 = wishiy.gender === 'male' ? 'o' : 'a'; 
  const hojeAniversario = [
    `???????? Quem apaga as velinhas hoje � ${wishiy.name} (${jobTranslated}) ???????`,
    `Anivers�rio de nascimento de ${wishiy.name}, ${jobTranslated}. Fica a� nossa lembran�a: ??`,
    `?????? Mais um ano de vida para ${g2} ${jobTranslated} ${wishiy.name}! Parab�ns pra voc�, nessa data querida!`,
    `� um dia especial para ${wishiy.name}, excelente ${jobTranslated} que comemora mais um ano de vida hoje.`,
    `Os parab�ns de hoje v�o para ${wishiy.name}, ${jobTranslated} que apaga as velinhas por mais um ano.`,
    `${wishiy.name}, renomad${g2} ${jobTranslated} faz anivers�rio hoje. ????? Conhece mais algu�m que faz?`,
    `Lembran�a especial para ${g2} maior ${jobTranslated} chamad${g2} ${wishiy.name}, que faz anivers�rio hoje.`,
    `Parab�ns pra voc�, nessa data querida! Muitas felicidades, muitos anos de vida! ${g2.toUpperCase()} ${wishiy.name} faz anos, que el${g1} seja feliz! Parab�ns para ${g2} ${wishiy.name}, que el${g1} seja feliz!`,
    `?????????? � dia de festa para ${g2} memor�vel ${jobTranslated} *${wishiy.name}*, que comemora mais uma volta ao sol hoje!`,
    `Sabia que ${g2} ${jobTranslated} ${g1} comemora anivers�rio hoje? Os nossos parab�ns especiais a el${1} e a todos que ficam mais velhos hoje.`
  ]
  return randomizeThis(hojeAniversario);
}

module.exports = {
  bomDia
}