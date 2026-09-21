const M=[
["Bersihin Pemicu","Hari pertama fokus pada lingkungan. Kurangi akses ke hal yang biasanya memicu.","Hapus atau simpan jauh konten pemicu.","Unfollow atau mute akun yang sering memancing.","Jangan bawa HP ke kamar mandi atau tempat tidur."],
["Tunda 10 Menit","Dorongan tidak harus langsung dituruti. Latih jarak antara dorongan dan tindakan.","Saat muncul dorongan, pasang timer 10 menit.","Berdiri dan pindah tempat.","Minum air atau lakukan gerakan ringan."],
["Kenali Polanya","Cari tahu kapan dan kenapa kamu paling sering kepancing.","Catat jam dan situasinya.","Tulis perasaan sebelum dorongan muncul.","Tentukan satu pemicu utama yang ingin kamu ubah."],
["Ganti Rutinitas","Buat kebiasaan pengganti, terutama pada jam yang biasanya rawan.","Olahraga 15–30 menit.","Jauhkan HP saat mau tidur.","Isi waktu kosong dengan aktivitas yang membuatmu berkembang."],
["Hari Tantangan","Hadapi pemicu terbesar dengan mengubah situasi, bukan dengan memaksa diri sendirian.","Hindari kombinasi tempat + waktu + kebiasaan yang paling rawan.","Kalau sendirian, pindah ke ruang yang lebih terbuka.","Cari kegiatan yang membuatmu sibuk."],
["Bangun Identitas Baru","Kamu sedang melatih kemampuan mengendalikan tindakan meskipun dorongan muncul.","Pilih satu aktivitas produktif hari ini.","Ingat: dorongan bukan perintah.","Catat satu hal yang kamu banggakan hari ini."],
["Evaluasi & Lanjut","Tujuh hari bukan garis finish. Gunakan pengalaman ini untuk minggu berikutnya.","Lihat pemicu yang paling sering muncul.","Catat strategi yang paling membantu.","Tetapkan target 7 hari berikutnya."]
];
const BADGES=[["🌱","FIRST STEP","Hari pertama"],["🧱","3 DAYS","Tiga hari"],["🔥","5 DAYS","Lima hari"],["🏆","7 DAYS","Tujuh hari"],["⚡","URGE MASTER","Pakai Urge Mode"],["📝","REFLECT","Tulis jurnal"],["🚀","RESET","Mulai lagi"]];

let S=JSON.parse(localStorage.getItem("7dayV2")||'{"done":[],"sel":0,"journal":{},"urge":false,"started":false}');
const $=x=>document.getElementById(x);
const quotes=["“Mulai dari hari ini.”","“Dorongan bukan perintah.”","“Kamu tidak harus sempurna.”","“Satu momen bisa kamu lewati.”","“Ubah lingkungan, bukan cuma niat.”","“Kamu sedang membangun kebiasaan baru.”","“Tujuh hari. Satu langkah setiap hari.”"];
function save(){localStorage.setItem("7dayV2",JSON.stringify(S))}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}
function renderDays(){$("days").innerHTML=M.map((x,i)=>`<button class="day ${S.sel===i?"active ":""}${S.done.includes(i)?"done":""}" data-i="${i}"><b>${i+1}</b><small>${S.done.includes(i)?"✓":"DAY"}</small></button>`).join("");document.querySelectorAll(".day").forEach(b=>b.onclick=()=>{S.sel=+b.dataset.i;save();render();$("mission").scrollIntoView({behavior:"smooth",block:"center"})})}
function renderMission(){let i=S.sel,x=M[i],done=S.done.includes(i);$("dayLabel").textContent=`DAY ${String(i+1).padStart(2,"0")}`;$("bigNum").textContent=String(i+1).padStart(2,"0");$("title").textContent=x[0];$("desc").textContent=x[1];$("tasks").innerHTML=x.slice(2).map((t,n)=>`<div class="task"><i>0${n+1}</i><span>${t}</span></div>`).join("");$("complete").innerHTML=done?"HARI INI SELESAI <span>✓</span>":"SELESAIKAN HARI INI <span>✓</span>";$("complete").classList.toggle("done",done);$("doneBadge").classList.toggle("hidden",!done);$("journal").value=S.journal[i]||""}
function renderBadges(){let n=S.done.length;let unlocked=[n>=1,n>=3,n>=5,n>=7,S.urge,Object.values(S.journal).some(x=>x.trim()),S.started];$("badges").innerHTML=BADGES.map((b,i)=>`<div class="badge ${unlocked[i]?"unlocked":""}"><div class="badge-icon">${b[0]}</div><b>${b[1]}</b><small>${b[2]}</small></div>`).join("");$("badgeCount").textContent=`${unlocked.filter(Boolean).length} / 7`}
function render(){let n=S.done.length,p=Math.round(n/7*100);$("heroDays").textContent=n;$("progressTitle").textContent=`${n} dari 7 hari`;$("ringNum").textContent=p+"%";$("ring").style.background=`conic-gradient(var(--accent) ${p*3.6}deg,#262b36 0deg)`;$("bar").style.width=p+"%";$("quote").textContent=quotes[Math.min(n,quotes.length-1)];renderDays();renderMission();renderBadges()}
$("startBtn").onclick=()=>{S.started=true;save();$("challenge").scrollIntoView({behavior:"smooth"});renderBadges();toast("Challenge dimulai. Gas! 🔥")};
$("complete").onclick=()=>{let i=S.sel;if(S.done.includes(i))S.done=S.done.filter(x=>x!==i);else{S.done.push(i);S.done.sort();toast("Hari ini berhasil! 🔥")}save();render()};
$("saveJournal").onclick=()=>{S.journal[S.sel]=$("journal").value;save();renderBadges();$("saved").textContent="Tersimpan ✓";setTimeout(()=>$("saved").textContent="",1800)};
$("resetBtn").onclick=()=>{if(confirm("Reset semua progress, badge, dan jurnal?")){S={done:[],sel:0,journal:{},urge:false,started:false};save();render();toast("Progress direset.")}};
const modal=$("modal");let timerId=null,sec=600;
$("urgeBtn").onclick=()=>{S.urge=true;save();renderBadges();modal.classList.remove("hidden")};
$("close").onclick=()=>{modal.classList.add("hidden");stop()};
$("timerBtn").onclick=()=>{stop();sec=600;$("timer").textContent="10:00";$("timerBtn").textContent="TIMER BERJALAN...";timerId=setInterval(()=>{sec--;let m=Math.floor(sec/60),s=sec%60;$("timer").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;if(sec<=0){stop();$("timer").textContent="SELESAI ✓";$("timerBtn").textContent="SELESAI — KAMU BERHASIL";toast("10 menit lewat. Kamu berhasil melewatinya.")}},1000)};
function stop(){if(timerId)clearInterval(timerId);timerId=null;$("timerBtn").textContent="MULAI 10 MENIT"}
render();
