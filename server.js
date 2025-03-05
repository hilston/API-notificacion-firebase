require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Cargar la clave de Firebase desde variables de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("🔥 API de Notificaciones Push con Firebase está funcionando!");
});

// Ruta para enviar notificaciones push
app.post("/send-notification", async (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const message = {
        topic: "global",
        notification: { title, body },
        data: { extraData: "Información adicional en la notificación" },
    };

    try {
        const response = await admin.messaging().send(message);
        res.json({ success: true, messageId: response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
