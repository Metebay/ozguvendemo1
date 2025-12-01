// Firebase SDK İçe Aktarma
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// SİZİN FIREBASE BİLGİLERİNİZ
const firebaseConfig = {
    apiKey: "AIzaSyBx7su21qKLnYZ89OOjPm84UC3u63c6iUs",
    authDomain: "potfolyo-e16e4.firebaseapp.com",
    projectId: "potfolyo-e16e4",
    storageBucket: "potfolyo-e16e4.firebasestorage.app",
    messagingSenderId: "778216462965",
    appId: "1:778216462965:web:69c9ad6ea0d22481b8b63c",
    measurementId: "G-WV7WXHF7P0"
};

// Uygulama Başlatma
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = 'ozguven-web';

// --- ORTAK HEADER VE FOOTER OLUŞTURUCU ---
const renderLayout = () => {
    // Header (Menü)
    const headerEl = document.getElementById('main-header');
    if (headerEl) {
        headerEl.innerHTML = `
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <a href="index.html" class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Ö</div>
                <div>
                    <h1 class="text-xl font-bold text-gray-800 leading-none">Özgüven</h1>
                    <p class="text-[10px] text-blue-600 font-bold tracking-wide">ÖZEL EĞİTİM</p>
                </div>
            </a>
            <nav class="hidden md:flex space-x-2">
                <a href="index.html" class="px-3 py-2 rounded-md hover:bg-blue-50 text-gray-600 font-medium text-sm transition">Ana Sayfa</a>
                <a href="kurumsal.html" class="px-3 py-2 rounded-md hover:bg-blue-50 text-gray-600 font-medium text-sm transition">Kurumsal</a>
                <a href="blog.html" class="px-3 py-2 rounded-md hover:bg-blue-50 text-gray-600 font-medium text-sm transition">Blog</a>
                <a href="iletisim.html" class="px-3 py-2 rounded-md hover:bg-blue-50 text-gray-600 font-medium text-sm transition">İletişim</a>
            </nav>
            <div class="flex items-center gap-2">
                <a href="iletisim.html" class="hidden md:block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-xs transition">Randevu Al</a>
                <a href="admin.html" class="text-gray-400 hover:text-blue-600 p-2"><i data-lucide="lock" class="w-5 h-5"></i></a>
            </div>
        </div>`;
    }

    // Footer
    const footerEl = document.getElementById('main-footer');
    if (footerEl) {
        footerEl.innerHTML = `
        <div class="container mx-auto px-4 py-8 text-center text-gray-400 text-sm">
            <div class="grid md:grid-cols-3 gap-8 mb-8 text-left">
                <div>
                    <h4 class="text-white font-bold mb-2">Özgüven Eğitim</h4>
                    <p>Özel eğitimde güvenin adresi.</p>
                </div>
                <div>
                    <h4 class="text-white font-bold mb-2">Hızlı Erişim</h4>
                    <ul class="space-y-1">
                        <li><a href="index.html" class="hover:text-white">Ana Sayfa</a></li>
                        <li><a href="kurumsal.html" class="hover:text-white">Hakkımızda</a></li>
                        <li><a href="iletisim.html" class="hover:text-white">İletişim</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold mb-2">İletişim</h4>
                    <p>0 (212) 555 00 00</p>
                    <p>Merkez Mah. Bağcılar/İst</p>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-4">
                &copy; 2025 Özgüven Özel Eğitim. Tüm hakları saklıdır.
            </div>
        </div>`;
    }
    if(window.lucide) lucide.createIcons();
};

// --- YÖNETİCİ FONKSİYONLARI (GLOBAL) ---
// HTML'den onclick="addStaff()" diyebilmek için window nesnesine atıyoruz.

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

// SİLME İŞLEMİ (Admin Panelinde Çalışır)
window.deleteItem = async (collectionName, id) => {
    if(!confirm("Bu kaydı kalıcı olarak silmek istiyor musunuz?")) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id));
        alert("Kayıt başarıyla silindi.");
    } catch(err) {
        console.error(err);
        alert("Silme hatası: İzinlerinizi kontrol edin.");
    }
};

// İLETİŞİM FORMU
window.handleContact = async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
            name: document.getElementById('contact-name').value,
            phone: document.getElementById('contact-phone').value,
            message: document.getElementById('contact-message').value,
            createdAt: serverTimestamp()
        });
        alert("Mesajınız alındı."); e.target.reset();
    } catch(err) { alert("Hata: " + err.message); }
};

// --- VERİ ÇEKME & LİSTELEME ---
const initPageData = () => {
    const path = window.location.pathname;

    // 1. KADRO LİSTELEME (Kurumsal ve Admin Sayfası İçin)
    if (path.includes('kurumsal.html') || path.includes('admin.html')) {
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'staff'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({id: d.id, ...d.data()}));
            
            // Kurumsal Sayfası İçin Render
            const publicList = document.getElementById('staff-public-list');
            if (publicList) {
                publicList.innerHTML = '';
                const cats = {'kurucu':'Kurucular','mudur':'İdari','ogretmen':'Öğretmenler','fizyoterapist':'Fizyoterapistler','destek':'Destek'};
                for(const [k, t] of Object.entries(cats)) {
                    const grp = list.filter(i => i.category === k);
                    if(grp.length) {
                        publicList.innerHTML += `<h3 class="text-xl font-bold mb-4 mt-8 border-b pb-2">${t}</h3><div class="grid md:grid-cols-4 gap-6">${grp.map(s => `
                            <div class="bg-white p-4 rounded-xl shadow-sm text-center border">
                                <img src="${s.image||'https://ui-avatars.com/api/?name='+s.name}" class="w-20 h-20 mx-auto rounded-full mb-3 object-cover">
                                <h4 class="font-bold">${s.name}</h4><p class="text-blue-600 text-xs">${s.role}</p>
                            </div>`).join('')}</div>`;
                    }
                }
            }

            // Admin Listesi İçin Render
            const adminList = document.getElementById('admin-staff-list');
            if (adminList) {
                adminList.innerHTML = list.map(s => 
                    `<li class="flex justify-between p-2 bg-gray-50 border rounded mb-2">
                        <span>${s.name} <small class="text-gray-400">(${s.role})</small></span>
                        <button onclick="deleteItem('staff', '${s.id}')" class="text-red-500 font-bold hover:underline">Sil</button>
                    </li>`
                ).join('');
            }
        });
    }

    // 2. BLOG LİSTELEME (Blog ve Admin Sayfası İçin)
    if (path.includes('blog.html') || path.includes('admin.html')) {
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'blog'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({id: d.id, ...d.data()}));

            // Blog Sayfası
            const blogGrid = document.getElementById('blog-grid');
            if (blogGrid) {
                blogGrid.innerHTML = list.map(b => `
                    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <img src="${b.image||'https://via.placeholder.com/400x200'}" class="h-48 w-full object-cover">
                        <div class="p-6">
                            <h3 class="font-bold text-lg mb-2">${b.title}</h3>
                            <p class="text-sm text-gray-500 line-clamp-3">${b.content}</p>
                            <div class="mt-4 text-xs text-gray-400">${b.date} - ${b.author}</div>
                        </div>
                    </div>`).join('');
            }

            // Admin Listesi
            const adminBlogList = document.getElementById('admin-blog-list');
            if (adminBlogList) {
                adminBlogList.innerHTML = list.map(b => 
                    `<li class="flex justify-between p-2 bg-gray-50 border rounded mb-2">
                        <span class="truncate w-3/4">${b.title}</span>
                        <button onclick="deleteItem('blog', '${b.id}')" class="text-red-500 font-bold hover:underline">Sil</button>
                    </li>`
                ).join('');
            }
        });
    }

    // 3. MESAJLAR (Sadece Admin)
    if (path.includes('admin.html')) {
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({id: d.id, ...d.data()}));
            const msgList = document.getElementById('admin-messages-list');
            if (msgList) {
                msgList.innerHTML = list.map(m => `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="p-3 font-medium">${m.name}</td>
                        <td class="p-3">${m.phone}</td>
                        <td class="p-3 text-sm text-gray-600 truncate max-w-xs" title="${m.message}">${m.message}</td>
                        <td class="p-3 text-right">
                            <button onclick="deleteItem('messages', '${m.id}')" class="text-red-600 hover:bg-red-100 p-2 rounded">Sil</button>
                        </td>
                    </tr>
                `).join('');
            }
        });
    }
};

// BAŞLAT
signInAnonymously(auth).then(() => {
    renderLayout();
    initPageData();
}).catch(console.error);
