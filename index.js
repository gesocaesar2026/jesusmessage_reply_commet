const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PAGE_ID = "90118319153";
const ACCESS_TOKEN = "EAAUmqjbT57QBOZBdPSIvCfyGmfSEyFx2tWLlLNaMZAO9ZBKCd4EJEFhtbgZBm87N6KNYqvl5QGlLurkgHLjVNFUPU9MVJXtfQbGlz45hJX79Wd3PwEp7OF50THiZAqG0A0M3DNF290CdPeYIEMG5YB99uFg3UKK04iqDZBRZCkYWMbE7ltZCHl4ZAEjMSWHi1NeYIgEcs25WIdo7kIRwqWdgZD";
const COMMENTS_FILE = path.join(__dirname, 'replied_comments.json');

const messages = [
    "شكراً على تعليقك! رسالة المسيح ليك: 'أنا هو الراعي الصالح، والراعي الصالح يبذل نفسه عن الخراف.' (يوحنا ١٠:١١)",
    "المسيح بيقولك: 'لا تخف، لأني فديتك. دعوتك باسمك، أنت لي.' (إشعياء ٤٣:١)",
    "رسالة ليك: 'سلامي أترك لكم، سلامي أعطيكم، لا كما يعطي العالم أعطيكم أنا.' (يوحنا ١٤:٢٧)",
    "أوعى تنسى: المسيح بيحبك حب غير مشروط ❤️",
    "تأكد إنك مش لوحدك، المسيح معاك دايمًا 🙏",
    "الرب نور ليك في كل طريق مظلم ✨",
    "تعبك مش رايح، الرب شايف كل دمعة وكل صرخة 💧",
    "ثق إن الخطة الإلهية أجمل من كل تخطيط بشري 🕊️",
    "كل يوم جديد هو فرصة جديدة من الرب ليك 🌅",
    "الرب يقول: 'لا أهملك ولا أتركك' (عبرانيين ١٣:٥)",
    "في ضعفك، المسيح هو قوتك 💪",
    "الرب سندك، ومش هيسيبك تقع أبدًا 🕊️",
    "كل ضيقة ليها موعد نهاية، والمسيح منتظر يعزيك ❤️",
    "افتح قلبك لي، لأني واقف على الباب وأقرع (رؤيا ٣:٢٠)",
    "أنت غالي في عيني الرب، ومحبوب جدًا 🙌",
    "المسيح يقول: 'تعالوا إليّ يا جميع المتعبين' (متى ١١:٢٨)",
    "مهما حصل، حب المسيح ليك ثابت لا يتغير ⛅",
    "خلي إيمانك ثابت، مهما كانت الرياح قوية ⛈️",
    "أنا معك، لا تتلفّت، لأني إلهك (إشعياء ٤١:١٠)",
    "الرب يعطيك رجاء، ومهما تأخرت الاستجابة، هي جاية بإذن الله 🙏"
];

const loadCommentIDs = () => {
    try {
        return JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
    } catch {
        return [];
    }
};

const saveCommentIDs = (ids) => {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(ids, null, 2));
};

const getLatestPostID = async () => {
    const res = await axios.get(`https://graph.facebook.com/${PAGE_ID}/posts?access_token=${ACCESS_TOKEN}`);
    return res.data.data[0]?.id;
};

const getComments = async (postId) => {
    const res = await axios.get(`https://graph.facebook.com/${postId}/comments?access_token=${ACCESS_TOKEN}`);
    return res.data.data;
};

const replyToComment = async (commentId, message) => {
    await axios.post(`https://graph.facebook.com/${commentId}/comments`, null, {
        params: {
            message,
            access_token: ACCESS_TOKEN,
        },
    });
};

(async () => {
    try {
        const replied = loadCommentIDs();
        const postId = await getLatestPostID();
        const comments = await getComments(postId);

        for (const comment of comments) {
            if (!replied.includes(comment.id)) {
                const msg = `شكراً على تعليقك! رسالة المسيح ليك مخصوص: ${messages[Math.floor(Math.random() * messages.length)]}`;
                await replyToComment(comment.id, msg);
                replied.push(comment.id);
            }
        }

        saveCommentIDs(replied);
        console.log("✅ Done replying to comments.");
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
})();