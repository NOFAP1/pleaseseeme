const missions=[
{title:"Bersihin Pemicu",desc:"Hari pertama fokus pada lingkungan. Jangan cuma mengandalkan kemauan—kurangi akses ke hal yang biasanya memicu.",list:["Hapus/simpan jauh konten pemicu.","Unfollow atau mute akun yang sering memancing.","Jangan bawa HP ke kamar mandi atau tempat tidur."]},
{title:"Tunda 10 Menit",desc:"Dorongan tidak harus langsung dituruti. Latih otak untuk memberi jarak antara dorongan dan tindakan.",list:["Saat muncul dorongan, pasang timer 10 menit.","Berdiri dan pindah tempat.","Minum air atau lakukan gerakan ringan."]},
{title:"Kenali Polanya",desc:"Cari tahu kapan dan kenapa kamu paling sering kepancing. Kesadaran adalah senjata.",list:["Catat jam dan situasinya.","Tulis perasaan sebelum dorongan muncul.","Tentukan satu pemicu utama yang ingin kamu ubah."]},
{title:"Ganti Rutinitas",desc:"Buat kebiasaan pengganti terutama pada jam yang biasanya rawan.",list:["Olahraga 15–30 menit.","Jauhkan HP saat mau tidur.","Isi waktu kosong dengan aktivitas yang membuatmu berkembang."]},
{title:"Hari Tantangan",desc:"Hadapi pemicu terbesar dengan mengubah situasi, bukan dengan memaksa diri menahan sendirian.",list:["Hindari kombinasi tempat + waktu + kebiasaan yang paling rawan.","Kalau sendirian, pindah ke ruang yang lebih terbuka.","Cari kegiatan yang membuatmu sibuk."]},
{title:"Bangun Identitas Baru",desc:"Kamu sedang melatih kemampuan mengendalikan tindakan meskipun dorongan muncul.",list:["Pilih satu aktivitas produktif hari ini.","Ingat: dorongan bukan perintah.","Catat satu hal yang kamu banggakan hari ini."]},
{title:"Evaluasi & Lanjut",desc:"Tujuh hari bukan garis finish. Gunakan pengalaman minggu ini untuk membuat minggu berikutnya lebih kuat.",list:["Lihat pemicu yang paling sering muncul.","Catat strategi yang paling membantu.","Tetapkan target 7 hari berikutnya."]}
];

let state=JSON.parse(localStorage.getItem("sevenDayReset")||'{"done":[],"selected":0,"journal":{}}');
let selected=state.selected||0;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("sevenDayReset",JSON.stringify(state))}
function renderDays(){
  $("days").innerHTML=missions.map((m,i)=>`<button class="day ${selected===i?"active ":""}${state.done.includes(i)?"done":""}" data-i="${i}"><b>${i+1}</b><small>${state.done.includes(i)?"✓":"DAY"}</small></button>`).join("");
  document.querySelectorAll(".day").forEach(b=>b.onclick=()=>{selected=+b.dataset.i;state.selected=selected;save();render()});
}
function renderMission(){
  const m=missions[selected], done=state.done.includes(selected);
  $("dayLabel").textContent=`DAY ${selected+1}`;
  $("dayNumber").textContent=String(selected+1).padStart(2,"0");
  $("missionTitle").textContent=m.title;
  $("missionDesc").textContent=m.desc;
  $("missionList").innerHTML=m.list.map(x=>`<li>${x}</li>`).join("");
  $("completeBtn").textContent=done?"HARI INI SELESAI ✓":"SELESAIKAN HARI INI ✓";
  $("completeBtn").classList.toggle("done",done);
  $("completeBtn").onclick=()=>{
    if(!state.done.includes(selected)) state.done.push(selected);
    else state.done=state.done.filter(x=>x!==selected);
    save();render();
  };
}
function render(){
  renderDays();renderMission();
  const count=state.done.length;
  $("progressText").textContent=`${count} / 7 hari`;
  $("progressBar").style.width=`${count/7*100}%`;
  $("streak").textContent=`${count} 🔥`;
  $("status").textContent=count===7?"7 hari selesai! 🏆":count===0?"Mulai sekarang":`${7-count} hari lagi`;
  $("journalText").value=state.journal[selected]||"";
}
$("saveBtn").onclick=()=>{
  state.journal[selected]=$("journalText").value;
  save();$("savedText").textContent="Jurnal tersimpan ✓";
  setTimeout(()=>$("savedText").textContent="",1800);
};
$("resetBtn").onclick=()=>{
  if(confirm("Reset semua progress dan jurnal?")){state={done:[],selected:0,journal:{}};selected=0;save();render();}
};

let interval=null,seconds=600;
$("urgeBtn").onclick=()=>$("urgeModal").classList.remove("hidden");
$("closeModal").onclick=()=>{$("urgeModal").classList.add("hidden");stopTimer()};
$("startTimer").onclick=()=>{
  stopTimer();seconds=600;$("timer").textContent="10:00";
  interval=setInterval(()=>{
    seconds--;const m=Math.floor(seconds/60),s=seconds%60;
    $("timer").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    if(seconds<=0){stopTimer();$("timer").textContent="SELESAI ✓"}
  },1000);
};
function stopTimer(){if(interval){clearInterval(interval);interval=null}}
render();
