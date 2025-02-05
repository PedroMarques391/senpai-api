const express = require('express');
const axios = require('axios');
const { greetFirstUser } = require('./src/templates');
const { metaHeadersById } = require('./src/post');

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, VERSION } = process.env;

app.listen(PORT, () => {
  console.log('API iniciou na porta', PORT);
});

app.get('/', (_req, res) => res.send({ status: 'online' }));
app.get('/healthcheck', (req, res) => res.status(200).end());
app.get('/coffee', (_req, res) => res.status(418).end());

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // check the mode and token sent are correct
  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully with challenge', challenge);
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403).end();
  }
});

app.post('/webhook', async (req, res) => {
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  // const payload = req.body.entry[0]?.changes[0]?.value;

  // if (payload?.messages[0]?.type === "request_welcome") return greetFirstUser(req, res);

  if (
    req.body.entry[0]?.changes[0]?.value?.messages &&
    req.body.entry[0]?.changes[0]?.value?.messages[0]?.type === 'text'
  ) {
    const payload = req.body.entry[0]?.changes[0]?.value;
    const { metadata, contacts } = payload;
    const message_content =
      payload?.messages[0]?.type === 'text'
        ? payload?.messages[0]?.text?.body
        : payload?.messages[0]?.type || 'unknown';
    console.info(
      'msg from',
      contacts[0]?.profile?.name,
      metadata?.display_phone_number,
      '>',
      message_content,
      '[' + payload?.messages[0]?.type + ']',
    );
    console.log("metadata", metadata);
    // const myHeaders = metaHeadersById(metadata?.phone_number_id);

    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${metadata?.phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": application/json,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: metadata?.display_phone_number,
        type: "template",
        template: {
            name: "modo_manutencao",
            language: {
                code: "pt_br"
            },
            components: [
            ]
        }
    }
    })

    // await axios
    //   .request({
    //     myHeaders,
    //     data: {
    //       messaging_product: 'whatsapp',
    //       status: 'read',
    //       message_id: payload?.messages[0]?.id,
    //     },
    //   })
    //   .then((response) =>
    //     console.log('greeting sent!', JSON.stringify(response?.data)),
    //   )
    //   .catch((error) => console.error('Erro!', error.code))
    //   .finally(() => {
    //     if (metadata?.display_phone_number.startsWith('55')) {
    //       greetFirstUser(req);
    //     }
    //   });

    // try {
    //   const sendRead = await axios(
    //     {
    //       myHeaders,
    //       data: {
    //         messaging_product: "whatsapp",
    //         status: "read",
    //         message_id: payload?.messages[0]?.id
    //       },
    //     });
    //     console.info("sendRead", sendRead);
    // } catch(err) {
    //   console.error("ERROR:", err);
    // } finally {
    //   if (metadata?.display_phone_number.startsWith("55")) {
    //     await greetFirstUser(req);
    //   }
    // }
  }
  return res.sendStatus(200);
});
