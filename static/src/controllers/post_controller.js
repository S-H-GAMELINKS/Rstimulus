import { Controller } from "stimulus"
import FireBase from 'firebase'

const firebase = FireBase.initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DB_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGEING_SENDER_ID
});

const database = firebase.database();

export default class extends Controller {
    static get targets() {
        return ["talks", "content", "preview" ]
    }

    initialize() {
        this.update();
    }

    content() {
        this.previewTarget.innerHTML = this.contentTarget.value
    }

    update() {
        const data = database.ref('ctimulus');

        data.on("value", (snapshot) => {
            const ctimulus = Object.entries(snapshot.val());

            this.talksTarget.innerHTML = "";

            for (let i = 0; i < ctimulus.length; i++) {
                this.talksTarget.innerHTML += `<p>${ctimulus[i][1].content}</p>`
            }
        }, (error) => {
            console.log(error);
        })

    }

    submit() {
        database.ref('ctimulus').push({
            content: this.contentTarget.value
        });
        this.contentTarget.value = "";
        this.previewTarget.innerHTML = "";
    }
}