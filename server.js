const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://monitoringbanjiramikom-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();
const statusRef = db.ref('data/status_air');

let lastStatus = "";

statusRef.on('value', async (snapshot) => {
  const status = snapshot.val();

  if (status !== lastStatus) {
    console.log(`⚠️ Status air berubah: ${status}`);
    lastStatus = status;

    const message = {
      token: 'cS12UGIJScqbW9hsCQWXC_:APA91bHIY1iOUSTPhHzYE4xVB29m4ri8X1E0zX9eXZxAc5jJNPwsMeQaG3WiYJkuFFhOxKzyegqd83Nor9ICkuyqVhvOiGgmfxKXhK2vgTrjEOu5ohsxUKk',
      notification: {
        title: '⚠️ Peringatan Banjir',
        body: `Status air sekarang: ${status.toUpperCase()}`
      }
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('✅ Notifikasi dikirim:', response);
    } catch (error) {
      console.error('❌ Gagal mengirim notifikasi:', error);
    }
  } else {
    console.log('ℹ️ Tidak ada perubahan status air');
  }
});
