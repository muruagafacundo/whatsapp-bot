const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "canje123"; // Este es el token que usarás en Meta
const PORT = process.env.PORT || 3000;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body;

    if (text) {
      console.log(`Mensaje de ${from}: ${text}`);

      // Respuesta según mensaje
      let respuesta;

      if (text.toLowerCase().includes("catálogo")) {
        respuesta = "🏆 Catálogo de premios:\n- Auriculares: 500 pts\n- Parlante: 1000 pts\n- Smart TV: 2500 pts";
      } else if (text.toLowerCase().includes("canjear")) {
        respuesta = "🔁 Para canjear, seguí estos pasos:\n1. Escribí 'Quiero canjear [premio]'\n2. Te pediremos tus datos si es necesario\n3. Esperá la confirmación";
      } else if (text.toLowerCase().includes("ya canjee") || text.toLowerCase().includes("ya canjeé")) {
        respuesta = "🎉 ¡Felicidades! Tu canje puede demorar hasta 48 hs hábiles para ser verificado. Te avisaremos cuando esté listo para retirar.";
      } else if (text.toLowerCase().includes("viaje") || text.toLowerCase().includes("hotel") || text.toLowerCase().includes("voucher")) {
        respuesta = "📝 Por favor indicá los siguientes datos:\n- Nombre completo\n- DNI\n- Celular\n- Mail";
      } else if (text.toLowerCase().includes("humano") || text.toLowerCase().includes("asistente")) {
        respuesta = "🙋‍♂️ En breve te contactará un asistente real.";
      } else {
        respuesta = "Hola 👋 ¿Qué querés hacer?\n1. Ver catálogo\n2. Cómo canjear\n3. Ya canjeé\n4. Hablar con un humano";
      }

      // Respuesta simulada (en la Cloud API real deberías usar el token y endpoint)
      console.log(`Responder a ${from}: ${respuesta}`);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Bot corriendo en puerto ${PORT}`);
});
