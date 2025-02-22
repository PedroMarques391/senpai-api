const { default: axios } = require('axios');
const { senpaiMongoDb } = require('../utils/connections');
const { randomizeThis, msg_premium_thankyou } = require('../templates/info');
const { sendAdmin } = require('../utils/sender');
const { VERSION, GRAPH_API_TOKEN, PHONE_NUMBER_ID } = process.env;

const senpaiCoupons = async () => {
  const dbCoupons = await senpaiMongoDb.collection('coupons').find().toArray();
  if (dbCoupons.filter((el) => el.left > 0).length === 0) return false;
  return dbCoupons;
};

const checkCupom = async (body, user) => {
  const userCoupon = body.split(' ')[1].trim();
  const dbCoupons = await senpaiCoupons();
  const validCoupom = dbCoupons.find(
    (el) => el.code === userCoupon && el.left > 0,
  );

  if (validCoupom) {
    return await senpaiMongoDb
      .collection('customers')
      .findOneAndUpdate(
        { wa_id: user.wa_id },
        {
          $set: {
            premium: true,
            subscription: {
              type: 'premium',
              start: new Date(),
            },
          },
        },
        { upsert: true },
      )
      .then(async (res) => {
        await senpaiMongoDb
          .collection('coupons')
          .findOneAndUpdate({ _id: validCoupom._id }, { $inc: { left: -1 } })
          .then((cpres) => {
            const newPremiumUser = `🔆 Usuário ${res?.name} @${res?.wa_id} virou premium com o cupom ${userCoupon}! Ainda restam: ${cpres.left}`;
            console.info(newPremiumUser);
          })
          .catch((err) =>
            console.error('Error updating coupom', err.response?.data || err),
          )
          .finally(async () => await sendAdmin(newPremiumUser));
        return await welcome_premium(res);
      })
      .catch((err) =>
        console.error('Erro concedendo cupom', err.response?.data || err),
      );
  }
};

const welcome_premium = async ({ wa_id }) => {
  const welcome_message = randomizeThis(msg_premium_thankyou);
  await axios({
    method: 'POST',
    url: `https://graph.facebook.com/${VERSION}/${PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: wa_id,
      type: 'text',
      text: {
        preview_url: false,
        body: welcome_message,
      },
    },
  });
};

module.exports = {
  checkCupom,
};
