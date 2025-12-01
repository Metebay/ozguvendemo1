import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// FIREBASE AYARLARI
const firebaseConfig = {
    apiKey: "AIzaSyBx7su21qKLnYZ89OOjPm84UC3u63c6iUs",
    authDomain: "potfolyo-e16e4.firebaseapp.com",
    projectId: "potfolyo-e16e4",
    storageBucket: "potfolyo-e16e4.firebasestorage.app",
    messagingSenderId: "778216462965",
    appId: "1:778216462965:web:69c9ad6ea0d22481b8b63c",
    measurementId: "G-WV7WXHF7P0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = 'ozguven-web';

// --- ORTAK HEADER VE FOOTER OLUŞTURUCU (Tüm Sayfalar İçin) ---
const renderLayout = () => {
    // 1. HEADER (MENÜ) OLUŞTURMA
    const headerEl = document.getElementById('main-header');
    if (headerEl) {
        headerEl.innerHTML = `
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <!-- LOGO ALANI -->
            <a href="index.html" class="flex items-center gap-3 group">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-200 group-hover:scale-105 transition duration-300">Ö</div>
                <div class="flex flex-col">
                    <h1 class="text-xl font-extrabold text-slate-800 leading-none tracking-tight">Özgüven</h1>
                    <p class="text-[10px] text-blue-600 font-bold tracking-widest uppercase mt-0.5">Özel Eğitim Merkezi</p>
                </div>
            </a>

            <!-- MENÜ LİNKLERİ -->
            <nav class="hidden md:flex space-x-1">
                <a href="index.html" class="px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm text-slate-600">Ana Sayfa</a>
                <a href="kurumsal.html" class="px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm text-slate-600">Kurumsal</a>
                <a href="blog.html" class="px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm text-slate-600">Blog</a>
                <a href="iletisim.html" class="px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm text-slate-600">İletişim</a>
            </nav>

            <!-- SAĞ BUTONLAR -->
            <div class="flex items-center gap-3">
                <a href="iletisim.html" class="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold text-sm transition shadow-md hover:shadow-lg items-center gap-2 transform active:scale-95">
                    <i data-lucide="calendar-check" class="w-4 h-4"></i> Randevu Al
                </a>
                <a href="admin.html" class="text-gray-400 hover:text-blue-600 transition p-2 rounded-full hover:bg-gray-100" title="Yönetici Paneli">
                    <i data-lucide="lock" class="w-5 h-5"></i>
                </a>
                <!-- Mobil Menü Butonu -->
                <button class="md:hidden text-gray-600 p-2" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
                    <i data-lucide="menu" class="w-7 h-7"></i>
                </button>
            </div>
        </div>
        
        <!-- MOBİL MENÜ İÇERİĞİ -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl p-4 flex flex-col gap-2 z-50">
            <a href="index.html" class="p-3 bg-gray-50 rounded-lg font-medium text-slate-700">Ana Sayfa</a>
            <a href="kurumsal.html" class="p-3 bg-gray-50 rounded-lg font-medium text-slate-700">Kurumsal</a>
            <a href="blog.html" class="p-3 bg-gray-50 rounded-lg font-medium text-slate-700">Blog</a>
            <a href="iletisim.html" class="p-3 bg-gray-50 rounded-lg font-medium text-slate-700">İletişim</a>
        </div>
        `;
    }

    // 2. FOOTER (ALT BİLGİ) OLUŞTURMA
    const footerEl = document.getElementById('main-footer');
    if (footerEl) {
        footerEl.innerHTML = `
        <div class="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-center md:text-left">
            <div class="md:col-span-1">
                <div class="flex items-center justify-center md:justify-start gap-2 mb-4 group">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">Ö</div>
                    <h3 class="text-xl font-bold text-white">Özgüven Eğitim</h3>
                </div>
                <p class="text-sm leading-relaxed mb-6 text-slate-400">
                    Özel eğitimde güvenin adresi. Bilimsel metotlar ve sevgi dolu bir yaklaşımla, her bireyin potansiyelini en üst düzeye çıkarıyoruz.
                </p>
            </div>

            <div>
                <h3 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Hızlı Erişim</h3>
                <ul class="space-y-2 text-sm text-slate-400">
                    <li><a href="index.html" class="hover:text-white transition flex items-center justify-center md:justify-start gap-2"><i data-lucide="chevron-right" class="w-3 h-3 text-orange-500"></i> Ana Sayfa</a></li>
                    <li><a href="kurumsal.html" class="hover:text-white transition flex items-center justify-center md:justify-start gap-2"><i data-lucide="chevron-right" class="w-3 h-3 text-orange-500"></i> Hakkımızda</a></li>
                    <li><a href="blog.html" class="hover:text-white transition flex items-center justify-center md:justify-start gap-2"><i data-lucide="chevron-right" class="w-3 h-3 text-orange-500"></i> Blog</a></li>
                    <li><a href="iletisim.html" class="hover:text-white transition flex items-center justify-center md:justify-start gap-2"><i data-lucide="chevron-right" class="w-3 h-3 text-orange-500"></i> İletişim</a></li>
                </ul>
            </div>

            <div>
                <h3 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Hizmetlerimiz</h3>
                <ul class="space-y-2 text-sm text-slate-400">
                    <li>Özel Öğrenme Güçlüğü</li>
                    <li>Otizm Spektrum Eğitimi</li>
                    <li>Fizyoterapi ve Rehabilitasyon</li>
                    <li>Dil ve Konuşma Terapisi</li>
                </ul>
            </div>

            <div>
                <h3 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Bize Ulaşın</h3>
                <div class="space-y-3 text-sm text-slate-400">
                    <div class="flex flex-col items-center md:items-start">
                        <span class="text-slate-500 text-xs uppercase font-bold">Telefon</span>
                        <a href="tel:02125550000" class="hover:text-white transition">0 (212) 555 00 00</a>
                    </div>
                    <div class="flex flex-col items-center md:items-start">
                        <span class="text-slate-500 text-xs uppercase font-bold">Adres</span>
                        <span>Merkez Mah. Eğitim Cad. No:1<br>Bağcılar / İstanbul</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
            <div class="container mx-auto px-4">
                <p>&copy; 2025 Özgüven Özel Eğitim ve Rehabilitasyon Merkezi. Tüm hakları saklıdır.</p>
            </div>
        </div>`;
    }
    
    // İkonları Yükle
    if(window.lucide) lucide.createIcons();
};

// --- VERİ İŞLEMLERİ ---

// 1. KADRO LİSTELEME
const initStaff = () => {
    const listDiv = document.getElementById('staff-public-list');
    const adminList = document.getElementById('admin-staff-list');
    
    if(!listDiv && !adminList) return;

    onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'staff'), orderBy('createdAt', 'desc')), (snap) => {
        const list = snap.docs.map(d => ({id: d.id, ...d.data()}));

        // Kurumsal Sayfası Render
        if(listDiv) {
            listDiv.innerHTML = '';
            const cats = {'kurucu':'Kurucular','mudur':'İdari','ogretmen':'Öğretmenler','fizyoterapist':'Fizyoterapistler','destek':'Destek'};
            for(const [k, t] of Object.entries(cats)) {
                const grp = list.filter(i => i.category === k);
                if(grp.length) {
                    listDiv.innerHTML += `
                    <div class="mb-16 animate-fade-in-up">
                        <h3 class="text-2xl font-bold text-slate-800 mb-8 border-l-4 border-blue-500 pl-4">${t}</h3>
                        <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                            ${grp.map(s => `
                                <div class="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100 hover:shadow-xl transition group">
                                    <div class="w-32 h-32 mx-auto bg-slate-100 rounded-full mb-6 overflow-hidden border-4 border-white shadow-md">
                                        <img src="${s.image || 'https://ui-avatars.com/api/?name='+s.name+'&background=random'}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                                    </div>
                                    <h4 class="font-bold text-lg text-slate-800">${s.name}</h4>
                                    <p class="text-blue-600 font-medium text-sm mt-1">${s.role}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>`;
                }
            }
            document.getElementById('staff-loading').style.display = 'none';
        }

        // Admin Listesi Render
        if(adminList) {
            adminList.innerHTML = list.map(s => `
                <li class="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-3">
                        <img src="${s.image || 'https://ui-avatars.com/api/?name='+s.name}" class="w-8 h-8 rounded-full">
                        <div>
                            <div class="font-bold text-sm text-slate-800">${s.name}</div>
                            <div class="text-xs text-slate-500">${s.role}</div>
                        </div>
                    </div>
                    <button onclick="deleteItem('staff', '${s.id}')" class="text-red-500 hover:bg-red-50 p-2 rounded-full transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </li>
            `).join('');
            lucide.createIcons();
        }
    });
};

// 2. BLOG LİSTELEME
const initBlog = () => {
    const blogGrid = document.getElementById('blog-grid');
    const adminBlogList = document.getElementById('admin-blog-list');

    if(!blogGrid && !adminBlogList) return;

    onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'blog'), orderBy('createdAt', 'desc')), (snap) => {
        const list = snap.docs.map(d => ({id: d.id, ...d.data()}));

        // Blog Sayfası Render
        if(blogGrid) {
            document.getElementById('blog-loading').style.display = 'none';
            blogGrid.innerHTML = list.map(b => `
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col h-full group" onclick="localStorage.setItem('currentBlog', JSON.stringify({id:'${b.id}', title:'${b.title}', content:'${b.content.replace(/'/g, "\\'")}', author:'${b.author}', date:'${b.date}', image:'${b.image}'})); window.location.href='blog-detay.html'">
                    <div class="h-56 bg-slate-200 overflow-hidden relative">
                        <img src="${b.image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                             ${b.date}
                        </div>
                    </div>
                    <div class="p-8 flex flex-col flex-grow">
                        <h3 class="font-bold text-xl text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition">${b.title}</h3>
                        <p class="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">${b.content}</p>
                        <div class="flex items-center justify-between text-xs border-t border-slate-50 pt-4 mt-auto">
                            <span class="text-slate-400 font-medium flex items-center gap-1"><i data-lucide="user" class="w-3 h-3"></i> ${b.author}</span>
                            <span class="text-blue-600 font-bold flex items-center gap-1">Oku <i data-lucide="arrow-right" class="w-3 h-3"></i></span>
                        </div>
                    </div>
                </div>
            `).join('');
            lucide.createIcons();
        }

        // Admin Listesi Render
        if(adminBlogList) {
            adminBlogList.innerHTML = list.map(b => `
                <li class="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div class="truncate w-3/4 font-medium text-slate-700">${b.title}</div>
                    <button onclick="deleteItem('blog', '${b.id}')" class="text-red-500 hover:bg-red-50 p-2 rounded-full transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </li>
            `).join('');
            lucide.createIcons();
        }
    });
};

// 3. ADMİN MESAJLARI
const initMessages = () => {
    const msgList = document.getElementById('admin-messages-list');
    if(!msgList) return;

    onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), orderBy('createdAt', 'desc')), (snap) => {
        const list = snap.docs.map(d => ({id: d.id, ...d.data()}));
        
        if (list.length === 0) {
            document.getElementById('messages-empty').classList.remove('hidden');
        } else {
            document.getElementById('messages-empty').classList.add('hidden');
        }

        msgList.innerHTML = list.map(m => `
            <tr class="border-b border-slate-50 hover:bg-slate-50 transition">
                <td class="p-4 font-medium text-slate-800">${m.name}</td>
                <td class="p-4 text-slate-600">${m.phone}</td>
                <td class="p-4 text-sm text-slate-500 max-w-xs truncate" title="${m.message}">${m.message}</td>
                <td class="p-4 text-right">
                    <button onclick="deleteItem('messages', '${m.id}')" class="text-red-600 hover:bg-red-50 p-2 rounded transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    });
};

// GLOBAL FONKSİYONLAR (HTML'den Erişilebilir)
window.addStaff = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = "Ekleniyor..."; btn.disabled = true;
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'staff'), {
            category: document.getElementById('staff-category').value,
            name: document.getElementById('staff-name').value,
            role: document.getElementById('staff-role').value,
            image: document.getElementById('staff-img').value,
            createdAt: serverTimestamp()
        });
        alert("Kayıt Eklendi!"); e.target.reset();
    } catch(err) { alert("Hata: " + err.message); }
    btn.innerHTML = "Ekle"; btn.disabled = false;
};

window.addBlog = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = "Yayınlanıyor..."; btn.disabled = true;
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'blog'), {
            title: document.getElementById('blog-title').value,
            author: document.getElementById('blog-author').value,
            content: document.getElementById('blog-content').value,
            image: document.getElementById('blog-img').value,
            date: new Date().toLocaleDateString('tr-TR'),
            createdAt: serverTimestamp()
        });
        alert("Yazı Yayınlandı!"); e.target.reset();
    } catch(err) { alert("Hata: " + err.message); }
    btn.innerHTML = "Yayınla"; btn.disabled = false;
};

window.handleContact = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = "Gönderiliyor..."; btn.disabled = true;
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
            name: document.getElementById('contact-name').value,
            phone: document.getElementById('contact-phone').value,
            message: document.getElementById('contact-message').value,
            createdAt: serverTimestamp()
        });
        alert("Mesajınız İletildi."); e.target.reset();
    } catch(err) { alert("Hata: " + err.message); }
    btn.innerHTML = "Gönder"; btn.disabled = false;
};

window.deleteItem = async (col, id) => {
    if(!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', col, id));
    } catch(err) { alert("Silinemedi: " + err.message); }
};

// BAŞLATMA
signInAnonymously(auth).then(() => {
    renderLayout(); // Header ve Footer'ı çiz
    initStaff();    // Kadro verilerini çek (varsa)
    initBlog();     // Blog verilerini çek (varsa)
    initMessages(); // Mesajları çek (varsa - admin)
}).catch(console.error);
