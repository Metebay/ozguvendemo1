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

// Global Veri Deposu
window.blogData = [];

// --- ORTAK HEADER VE FOOTER OLUŞTURUCU (Tüm Sayfalar İçin) ---
const renderLayout = () => {
    // 1. HEADER (MENÜ) OLUŞTURMA
    const headerEl = document.getElementById('main-header');
    if (headerEl) {
        headerEl.innerHTML = `
        <!-- ÜST BİLGİ ÇUBUĞU (Top Bar) -->
        <div class="bg-[#0f172a] text-slate-400 py-3 text-[11px] font-medium tracking-wide border-b border-slate-800/50">
            <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
                <div class="flex items-center gap-6">
                    <a href="tel:02125550000" class="flex items-center gap-2 hover:text-white transition-colors duration-300 group">
                        <i data-lucide="phone" class="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform"></i> 
                        <span>0 (212) 555 00 00</span>
                    </a>
                    <a href="mailto:bilgi@ozguvenegitim.com" class="flex items-center gap-2 hover:text-white transition-colors duration-300 group">
                        <i data-lucide="mail" class="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform"></i> 
                        <span>bilgi@ozguvenegitim.com</span>
                    </a>
                </div>
                <div class="flex items-center gap-6">
                    <span class="hidden md:flex items-center gap-1.5 text-slate-500"><i data-lucide="clock" class="w-3.5 h-3.5 text-red-500"></i> Pzt-Cmt: 09:00 - 18:00</span>
                    <div class="flex gap-4 border-l border-slate-800 pl-6">
                        <a href="#" class="hover:text-blue-400 hover:scale-110 transition-all duration-300"><i data-lucide="facebook" class="w-3.5 h-3.5"></i></a>
                        <a href="#" class="hover:text-pink-400 hover:scale-110 transition-all duration-300"><i data-lucide="instagram" class="w-3.5 h-3.5"></i></a>
                        <a href="#" class="hover:text-sky-400 hover:scale-110 transition-all duration-300"><i data-lucide="twitter" class="w-3.5 h-3.5"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <!-- ANA MENÜ -->
        <div class="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300 relative z-50">
            <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                <!-- LOGO ALANI -->
                <a href="index.html" class="flex items-center gap-3 group">
                    <div class="relative">
                        <div class="absolute inset-0 bg-red-600/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div class="relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border border-red-500/50 group-hover:scale-105 transition-transform duration-300">Ö</div>
                    </div>
                    <div class="flex flex-col">
                        <h1 class="text-2xl font-black text-slate-800 leading-none tracking-tight uppercase group-hover:text-red-700 transition-colors">Özgüven</h1>
                        <p class="text-[10px] text-red-600 font-bold tracking-[0.25em] uppercase mt-1.5 opacity-80">Özel Eğitim Merkezi</p>
                    </div>
                </a>

                <!-- MENÜ LİNKLERİ (Desktop) -->
                <nav class="hidden lg:flex items-center gap-1">
                    <a href="index.html" class="relative group px-5 py-2.5 font-semibold text-[13px] text-slate-600 hover:text-red-700 transition-colors uppercase tracking-wide">
                        Ana Sayfa
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-1/2 opacity-0 group-hover:opacity-100"></span>
                    </a>
                    <a href="kurumsal.html" class="relative group px-5 py-2.5 font-semibold text-[13px] text-slate-600 hover:text-red-700 transition-colors uppercase tracking-wide">
                        Kurumsal
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-1/2 opacity-0 group-hover:opacity-100"></span>
                    </a>
                    <a href="blog.html" class="relative group px-5 py-2.5 font-semibold text-[13px] text-slate-600 hover:text-red-700 transition-colors uppercase tracking-wide">
                        Blog
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-1/2 opacity-0 group-hover:opacity-100"></span>
                    </a>
                    <a href="iletisim.html" class="relative group px-5 py-2.5 font-semibold text-[13px] text-slate-600 hover:text-red-700 transition-colors uppercase tracking-wide">
                        İletişim
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-1/2 opacity-0 group-hover:opacity-100"></span>
                    </a>
                </nav>

                <!-- SAĞ AKSİYONLAR -->
                <div class="flex items-center gap-4">
                    <a href="iletisim.html" class="hidden md:flex bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded shadow-lg shadow-red-600/20 font-bold text-xs transition-all hover:-translate-y-0.5 items-center gap-2 uppercase tracking-wider group">
                        <i data-lucide="calendar-check" class="w-4 h-4 group-hover:animate-pulse"></i> Randevu Al
                    </a>
                    <a href="admin.html" class="text-slate-400 hover:text-red-600 transition-all p-2 rounded-full hover:bg-red-50 border border-transparent hover:border-red-100" title="Yönetici Paneli">
                        <i data-lucide="lock" class="w-4 h-4"></i>
                    </a>
                    <!-- Mobil Menü Butonu -->
                    <button class="lg:hidden text-slate-700 p-2 hover:bg-slate-50 rounded-lg transition" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
                        <i data-lucide="menu" class="w-7 h-7"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- MOBİL MENÜ İÇERİĞİ -->
        <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-2xl p-0 flex flex-col z-40 animate-in slide-in-from-top-2 duration-200">
            <a href="index.html" class="p-4 border-b border-slate-50 font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:pl-6 transition-all uppercase text-xs flex justify-between group">
                Ana Sayfa <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 group-hover:text-red-500"></i>
            </a>
            <a href="kurumsal.html" class="p-4 border-b border-slate-50 font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:pl-6 transition-all uppercase text-xs flex justify-between group">
                Kurumsal <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 group-hover:text-red-500"></i>
            </a>
            <a href="blog.html" class="p-4 border-b border-slate-50 font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:pl-6 transition-all uppercase text-xs flex justify-between group">
                Blog <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 group-hover:text-red-500"></i>
            </a>
            <a href="iletisim.html" class="p-4 border-b border-slate-50 font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:pl-6 transition-all uppercase text-xs flex justify-between group">
                İletişim <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 group-hover:text-red-500"></i>
            </a>
        </div>
        `;
    }

    // 2. FOOTER (ALT BİLGİ) OLUŞTURMA
    const footerEl = document.getElementById('main-footer');
    if (footerEl) {
        footerEl.innerHTML = `
        <div class="bg-[#0f172a] text-slate-400 pt-20 pb-10 border-t-4 border-red-600 relative overflow-hidden">
            <!-- Arka Plan Deseni -->
            <div class="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <i data-lucide="shield-check" class="w-64 h-64 text-white"></i>
            </div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="grid md:grid-cols-4 gap-12 mb-16 border-b border-slate-800 pb-12">
                    
                    <!-- Sütun 1: Kurumsal -->
                    <div class="md:col-span-1">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg border border-red-500/30">Ö</div>
                            <h3 class="text-xl font-bold text-white uppercase tracking-wider">Özgüven</h3>
                        </div>
                        <p class="text-sm leading-7 mb-8 text-slate-400">
                            Özel eğitimde güvenin adresi. Bilimsel metotlar, uzman kadro ve sevgi dolu bir yaklaşımla, her bireyin potansiyelini en üst düzeye çıkarıyoruz.
                        </p>
                        <div class="flex gap-3">
                            <a href="#" class="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 border border-slate-700 hover:border-blue-500"><i data-lucide="facebook" class="w-4 h-4"></i></a>
                            <a href="#" class="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all hover:-translate-y-1 border border-slate-700 hover:border-pink-500"><i data-lucide="instagram" class="w-4 h-4"></i></a>
                            <a href="#" class="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all hover:-translate-y-1 border border-slate-700 hover:border-sky-400"><i data-lucide="twitter" class="w-4 h-4"></i></a>
                        </div>
                    </div>

                    <!-- Sütun 2: Hızlı Erişim -->
                    <div>
                        <h3 class="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em] flex items-center gap-3">
                            <span class="w-2 h-2 bg-red-600 rounded-full inline-block"></span> Hızlı Erişim
                        </h3>
                        <ul class="space-y-3 text-sm">
                            <li><a href="index.html" class="hover:text-red-400 hover:pl-2 transition-all flex items-center gap-2 group"><i data-lucide="chevron-right" class="w-3 h-3 text-slate-600 group-hover:text-red-500 transition-colors"></i> Ana Sayfa</a></li>
                            <li><a href="kurumsal.html" class="hover:text-red-400 hover:pl-2 transition-all flex items-center gap-2 group"><i data-lucide="chevron-right" class="w-3 h-3 text-slate-600 group-hover:text-red-500 transition-colors"></i> Hakkımızda</a></li>
                            <li><a href="blog.html" class="hover:text-red-400 hover:pl-2 transition-all flex items-center gap-2 group"><i data-lucide="chevron-right" class="w-3 h-3 text-slate-600 group-hover:text-red-500 transition-colors"></i> Blog</a></li>
                            <li><a href="iletisim.html" class="hover:text-red-400 hover:pl-2 transition-all flex items-center gap-2 group"><i data-lucide="chevron-right" class="w-3 h-3 text-slate-600 group-hover:text-red-500 transition-colors"></i> İletişim</a></li>
                        </ul>
                    </div>

                    <!-- Sütun 3: Hizmetler -->
                    <div>
                        <h3 class="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em] flex items-center gap-3">
                            <span class="w-2 h-2 bg-red-600 rounded-full inline-block"></span> Hizmetlerimiz
                        </h3>
                        <ul class="space-y-3 text-sm">
                            <li class="flex items-center gap-2 text-slate-400 hover:text-white transition cursor-default group"><i data-lucide="activity" class="w-3 h-3 text-red-600 group-hover:scale-125 transition-transform"></i> Özel Öğrenme Güçlüğü</li>
                            <li class="flex items-center gap-2 text-slate-400 hover:text-white transition cursor-default group"><i data-lucide="activity" class="w-3 h-3 text-red-600 group-hover:scale-125 transition-transform"></i> Otizm Spektrum Eğitimi</li>
                            <li class="flex items-center gap-2 text-slate-400 hover:text-white transition cursor-default group"><i data-lucide="activity" class="w-3 h-3 text-red-600 group-hover:scale-125 transition-transform"></i> Fizyoterapi</li>
                            <li class="flex items-center gap-2 text-slate-400 hover:text-white transition cursor-default group"><i data-lucide="activity" class="w-3 h-3 text-red-600 group-hover:scale-125 transition-transform"></i> Dil ve Konuşma</li>
                        </ul>
                    </div>

                    <!-- Sütun 4: İletişim -->
                    <div>
                        <h3 class="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em] flex items-center gap-3">
                            <span class="w-2 h-2 bg-red-600 rounded-full inline-block"></span> Bize Ulaşın
                        </h3>
                        <div class="space-y-5 text-sm">
                            <div class="flex gap-4 group">
                                <div class="bg-slate-800 p-2.5 rounded-lg text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors border border-slate-700 group-hover:border-red-500">
                                    <i data-lucide="map-pin" class="w-4 h-4"></i>
                                </div>
                                <span class="text-slate-400 group-hover:text-white transition-colors leading-tight">Merkez Mah. Eğitim Cad.<br>No:1 Bağcılar / İstanbul</span>
                            </div>
                            <div class="flex gap-4 group">
                                <div class="bg-slate-800 p-2.5 rounded-lg text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors border border-slate-700 group-hover:border-red-500">
                                    <i data-lucide="phone" class="w-4 h-4"></i>
                                </div>
                                <a href="tel:02125550000" class="text-slate-400 group-hover:text-white transition-colors self-center font-medium">0 (212) 555 00 00</a>
                            </div>
                            <div class="flex gap-4 group">
                                <div class="bg-slate-800 p-2.5 rounded-lg text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors border border-slate-700 group-hover:border-red-500">
                                    <i data-lucide="mail" class="w-4 h-4"></i>
                                </div>
                                <a href="mailto:bilgi@ozguvenegitim.com" class="text-slate-400 group-hover:text-white transition-colors self-center">bilgi@ozguvenegitim.com</a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 pt-4">
                    <p>&copy; 2025 Özgüven Özel Eğitim ve Rehabilitasyon Merkezi.</p>
                    <div class="flex gap-6">
                        <a href="#" class="hover:text-white transition underline-offset-4 hover:underline">Gizlilik Politikası</a>
                        <a href="#" class="hover:text-white transition underline-offset-4 hover:underline">Kullanım Şartları</a>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    // İkonları Yükle
    if(window.lucide) lucide.createIcons();
};

// --- YÖNETİCİ & NAVİGASYON FONKSİYONLARI (GLOBAL) ---

// Blog Detayına Gitme (Güvenli Yöntem)
window.goToBlogDetail = (id) => {
    const selectedBlog = window.blogData.find(b => b.id === id);
    if (selectedBlog) {
        localStorage.setItem('currentBlog', JSON.stringify(selectedBlog));
        window.location.href = 'blog-detay.html';
    } else {
        alert("Blog yazısı bulunamadı veya yüklenemedi.");
    }
};

window.addStaff = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Ekleniyor..."; btn.disabled = true;
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'staff'), {
            category: document.getElementById('staff-category').value,
            name: document.getElementById('staff-name').value,
            role: document.getElementById('staff-role').value,
            image: document.getElementById('staff-img').value,
            createdAt: serverTimestamp()
        });
        alert("Personel Eklendi!"); e.target.reset();
    } catch(err) { alert("Hata: " + err.message); }
    btn.innerText = "Ekle"; btn.disabled = false;
};

window.addBlog = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Yayınlanıyor..."; btn.disabled = true;
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
    btn.innerText = "Yayınla"; btn.disabled = false;
};

window.handleContact = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Gönderiliyor..."; btn.disabled = true;
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
            name: document.getElementById('contact-name').value,
            phone: document.getElementById('contact-phone').value,
            message: document.getElementById('contact-message').value,
            createdAt: serverTimestamp()
        });
        alert("Mesajınız alındı."); e.target.reset();
    } catch(err) { alert("Hata: " + err.message); }
    btn.innerText = "Gönder"; btn.disabled = false;
};

window.deleteItem = async (collectionName, id) => {
    if(!confirm("Bu kaydı kalıcı olarak silmek istiyor musunuz?")) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id));
    } catch(err) {
        console.error(err);
        alert("Silme hatası: İzinlerinizi kontrol edin.");
    }
};

// --- VERİ ÇEKME & LİSTELEME ---

// 1. KADRO LİSTELEME
const initStaff = () => {
    const listDiv = document.getElementById('staff-public-list');
    const adminList = document.getElementById('admin-staff-list');
    
    if(!listDiv && !adminList) return;

    onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'staff'), orderBy('createdAt', 'desc')), (snap) => {
        const list = snap.docs.map(d => ({id: d.id, ...d.data()}));

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
        
        window.blogData = list;

        if(blogGrid) {
            document.getElementById('blog-loading').style.display = 'none';
            blogGrid.innerHTML = list.map(b => `
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col h-full group" 
                     onclick="goToBlogDetail('${b.id}')">
                    <div class="h-56 bg-slate-200 overflow-hidden relative">
                        <img src="${b.image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy">
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
        const emptyMsg = document.getElementById('messages-empty');
        
        if (list.length === 0) {
            if(emptyMsg) emptyMsg.classList.remove('hidden');
        } else {
            if(emptyMsg) emptyMsg.classList.add('hidden');
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

// BAŞLAT
signInAnonymously(auth).then(() => {
    renderLayout();
    initStaff();
    initBlog();
    initMessages();
}).catch(console.error);
