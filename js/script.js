// 🔁 التنقل بين التبويبات
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
}

// 🔍 استعلام عن حالة الجهاز من Google Sheet
function checkStatus() {
  const code = document.getElementById("clientCode").value.trim();
  const resultArea = document.getElementById("resultArea");

  if (!code) {
    resultArea.innerHTML = "⚠️ الرجاء إدخال الكود.";
    return;
  }

  resultArea.innerHTML = "⏳ جاري التحقق...";

  fetch(`https://script.google.com/macros/s/AKfycbzvraBZNIdx5hUvEp2Vn2URpxv5xcbKSgP5lEH33mB_L_ZEO_tKq9iHjDjJApRcAkyWJg/exec?code=${code}`)
    .then(res => res.json())
    .then(data => {
      if (data.name) {
        resultArea.innerHTML = `
          👤 <b>الاسم:</b> ${data.name}<br>
          📱 <b>الجهاز:</b> ${data.device}<br>
          🛠️ <b>العطل:</b> ${data.issue}<br>
          🔧 <b>الحالة:</b> ${data.status}<br>
          💰 <b>المبلغ:</b> ${data.price}
        `;
      } else {
        resultArea.innerHTML = "❌ لم يتم العثور على هذا الكود.";
      }
    })
    .catch(() => {
      resultArea.innerHTML = "❌ حدث خطأ أثناء الاتصال.";
    });
}

// ➕ استقبال بيانات جهاز جديد + توليد كود + حفظ + عرض QR
function submitForm(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const device = document.getElementById("device").value.trim();
  const issue = document.getElementById("issue").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const code = generateCode();

  const data = {
    name, phone, device, issue, notes, code
  };

  // إرسال البيانات إلى Google Sheet
  fetch("https://script.google.com/macros/s/YOUR-RECEIVE-FORM-ENDPOINT/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  // عرض الوصل
  const receipt = document.getElementById("receipt");
  const receiptData = document.getElementById("receiptData");
  receiptData.innerHTML = `
    🧾 <b>الاسم:</b> ${name}<br>
    📞 <b>الهاتف:</b> ${phone}<br>
    📱 <b>الجهاز:</b> ${device}<br>
    🛠️ <b>العطل:</b> ${issue}<br>
    🗒️ <b>ملاحظات:</b> ${notes || "لا يوجد"}<br>
    🔑 <b>الكود:</b> <span style="color:#e74c3c;">${code}</span>
  `;
  new QRCode(document.getElementById("qrcode"), {
    text: `https://aymanjassoum.github.io/ayman-mobile-center/?code=${code}`,
    width: 150,
    height: 150
  });

  receipt.classList.remove("hidden");
}

// توليد كود رباعي عشوائي
function generateCode() {
  const letters = "AYMN";
  const digits = Math.floor(1000 + Math.random() * 9000);
  const letter = letters[Math.floor(Math.random() * letters.length)];
  return `${letter}${digits}`.toUpperCase();
}
