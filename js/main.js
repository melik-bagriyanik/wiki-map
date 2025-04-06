// Haritayı başlat
const map = L.map('map').setView([20, 0], 2);

// Harita stilini ayarla
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

// Harita kontrollerini ekle
map.zoomControl.setPosition('bottomright');

// Fare tekerleği ile yakınlaştırma/uzaklaştırma
map.scrollWheelZoom.enable();

// Modal HTML'ini oluştur
const modalHTML = `
<div id="countryModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2 id="countryName"></h2>
        <img id="countryFlag" src="" alt="Bayrak">
        <p id="notablePerson"></p>
    </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Modal elementlerini seç
const modal = document.getElementById('countryModal');
const closeBtn = document.getElementsByClassName('close')[0];
const countryNameElement = document.getElementById('countryName');
const countryFlagElement = document.getElementById('countryFlag');
const notablePersonElement = document.getElementById('notablePerson');

// Modal kapatma fonksiyonu
function closeModal() {
    modal.style.display = "none";
    // Ses çalıyorsa durdur
    const audioElement = document.getElementById('anthemAudio');
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
}

// Modal kapatma butonuna tıklandığında
closeBtn.onclick = function() {
    closeModal();
}

// Modal dışına tıklandığında kapatma
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Mat renk paleti
const matteColors = [
    '#E6D5AC', // Mat Bej
    '#D4C4A1', // Mat Kahverengi
    '#C2B3A1', // Mat Gri-Kahve
    '#B1A3A1', // Mat Gri
    '#A1B1C2', // Mat Mavi-Gri
    '#A1C2D4', // Mat Açık Mavi
    '#A1D4C2', // Mat Yeşil-Mavi
    '#A1C2B1', // Mat Yeşil
    '#B1C2A1', // Mat Açık Yeşil
    '#C2D4A1', // Mat Sarı-Yeşil
    '#D4C2A1', // Mat Sarı
    '#E6D4A1', // Mat Altın
    '#D4A1C2', // Mat Pembe
    '#C2A1D4', // Mat Mor
    '#A1A1C2'  // Mat Lavanta
];

// Ülke sınırlarını ekle
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                // Her ülke için rastgele bir mat renk seç
                const colorIndex = Math.floor(Math.random() * matteColors.length);
                return {
                    fillColor: matteColors[colorIndex],
                    weight: 1,
                    opacity: 1,
                    color: '#999',
                    fillOpacity: 0.8
                };
            },
            onEachFeature: function(feature, layer) {
                layer.on({
                    click: zoomToFeature
                });
            }
        }).addTo(map);
    });

// Ülke adını düzeltme fonksiyonu
function normalizeCountryName(countryName) {
    // Bazı ülke adlarını Türkçe Wikipedia'da arama için düzelt
    const countryMap = {
        'United States': 'Amerika Birleşik Devletleri',
        'United States of America': 'Amerika Birleşik Devletleri',
        'United Kingdom': 'Birleşik Krallık',
        'Russia': 'Rusya',
        'China': 'Çin',
        'Japan': 'Japonya',
        'Germany': 'Almanya',
        'France': 'Fransa',
        'Italy': 'İtalya',
        'Spain': 'İspanya',
        'India': 'Hindistan',
        'Brazil': 'Brezilya',
        'Canada': 'Kanada',
        'Australia': 'Avustralya',
        'Mexico': 'Meksika',
        'South Korea': 'Güney Kore',
        'North Korea': 'Kuzey Kore',
        'Iran': 'İran',
        'Saudi Arabia': 'Suudi Arabistan',
        'Turkey': 'Türkiye',
        'Egypt': 'Mısır',
        'South Africa': 'Güney Afrika',
        'Nigeria': 'Nijerya',
        'Argentina': 'Arjantin',
        'Chile': 'Şili',
        'Colombia': 'Kolombiya',
        'Peru': 'Peru',
        'Venezuela': 'Venezuela',
        'Pakistan': 'Pakistan',
        'Indonesia': 'Endonezya',
        'Thailand': 'Tayland',
        'Vietnam': 'Vietnam',
        'Malaysia': 'Malezya',
        'Philippines': 'Filipinler',
        'Poland': 'Polonya',
        'Ukraine': 'Ukrayna',
        'Netherlands': 'Hollanda',
        'Belgium': 'Belçika',
        'Sweden': 'İsveç',
        'Norway': 'Norveç',
        'Denmark': 'Danimarka',
        'Finland': 'Finlandiya',
        'Switzerland': 'İsviçre',
        'Austria': 'Avusturya',
        'Greece': 'Yunanistan',
        'Portugal': 'Portekiz',
        'Ireland': 'İrlanda',
        'New Zealand': 'Yeni Zelanda',
        'Singapore': 'Singapur',
        'Israel': 'İsrail',
        'United Arab Emirates': 'Birleşik Arap Emirlikleri',
        'Qatar': 'Katar',
        'Kuwait': 'Kuveyt',
        'Iraq': 'Irak',
        'Syria': 'Suriye',
        'Jordan': 'Ürdün',
        'Lebanon': 'Lübnan',
        'Yemen': 'Yemen',
        'Oman': 'Umman',
        'Afghanistan': 'Afganistan',
        'Bangladesh': 'Bangladeş',
        'Myanmar': 'Myanmar',
        'Cambodia': 'Kamboçya',
        'Laos': 'Laos',
        'Nepal': 'Nepal',
        'Sri Lanka': 'Sri Lanka',
        'Maldives': 'Maldivler',
        'Bhutan': 'Bhutan',
        'Mongolia': 'Moğolistan',
        'Kazakhstan': 'Kazakistan',
        'Uzbekistan': 'Özbekistan',
        'Turkmenistan': 'Türkmenistan',
        'Tajikistan': 'Tacikistan',
        'Kyrgyzstan': 'Kırgızistan',
        'Azerbaijan': 'Azerbaycan',
        'Georgia': 'Gürcistan',
        'Armenia': 'Ermenistan',
        'Belarus': 'Belarus',
        'Moldova': 'Moldova',
        'Romania': 'Romanya',
        'Bulgaria': 'Bulgaristan',
        'Croatia': 'Hırvatistan',
        'Slovenia': 'Slovenya',
        'Slovakia': 'Slovakya',
        'Czech Republic': 'Çek Cumhuriyeti',
        'Hungary': 'Macaristan',
        'Serbia': 'Sırbistan',
        'Montenegro': 'Karadağ',
        'North Macedonia': 'Kuzey Makedonya',
        'Albania': 'Arnavutluk',
        'Bosnia and Herzegovina': 'Bosna Hersek',
        'Estonia': 'Estonya',
        'Latvia': 'Letonya',
        'Lithuania': 'Litvanya',
        'Iceland': 'İzlanda',
        'Luxembourg': 'Lüksemburg',
        'Malta': 'Malta',
        'Cyprus': 'Kıbrıs',
        'Morocco': 'Fas',
        'Algeria': 'Cezayir',
        'Tunisia': 'Tunus',
        'Libya': 'Libya',
        'Sudan': 'Sudan',
        'Ethiopia': 'Etiyopya',
        'Kenya': 'Kenya',
        'Tanzania': 'Tanzanya',
        'Uganda': 'Uganda',
        'Ghana': 'Gana',
        'Senegal': 'Senegal',
        'Ivory Coast': 'Fildişi Sahili',
        'Cameroon': 'Kamerun',
        'Angola': 'Angola',
        'Mozambique': 'Mozambik',
        'Zimbabwe': 'Zimbabve',
        'Zambia': 'Zambiya',
        'Namibia': 'Namibya',
        'Botswana': 'Botsvana',
        'Madagascar': 'Madagaskar',
        'Cuba': 'Küba',
        'Dominican Republic': 'Dominik Cumhuriyeti',
        'Haiti': 'Haiti',
        'Jamaica': 'Jamaika',
        'Trinidad and Tobago': 'Trinidad ve Tobago',
        'Panama': 'Panama',
        'Costa Rica': 'Kosta Rika',
        'Nicaragua': 'Nikaragua',
        'Honduras': 'Honduras',
        'El Salvador': 'El Salvador',
        'Guatemala': 'Guatemala',
        'Belize': 'Belize',
        'Uruguay': 'Uruguay',
        'Paraguay': 'Paraguay',
        'Bolivia': 'Bolivya',
        'Ecuador': 'Ekvador',
        'Guyana': 'Guyana',
        'Suriname': 'Surinam',
        'Fiji': 'Fiji',
        'Papua New Guinea': 'Papua Yeni Gine',
        'Solomon Islands': 'Solomon Adaları',
        'Vanuatu': 'Vanuatu',
        'Samoa': 'Samoa',
        'Tonga': 'Tonga',
        'Kiribati': 'Kiribati',
        'Marshall Islands': 'Marshall Adaları',
        'Micronesia': 'Mikronezya',
        'Palau': 'Palau',
        'Tuvalu': 'Tuvalu',
        'Nauru': 'Nauru',
        'Timor-Leste': 'Doğu Timor',
        'Brunei': 'Brunei',
        'East Timor': 'Doğu Timor',
        'Mauritania': 'Moritanya',
        'Mali': 'Mali',
        'Niger': 'Nijer',
        'Chad': 'Çad',
        'Central African Republic': 'Orta Afrika Cumhuriyeti',
        'South Sudan': 'Güney Sudan',
        'Eritrea': 'Eritre',
        'Djibouti': 'Cibuti',
        'Somalia': 'Somali',
        'Burundi': 'Burundi',
        'Rwanda': 'Ruanda',
        'Democratic Republic of the Congo': 'Kongo Demokratik Cumhuriyeti',
        'Republic of the Congo': 'Kongo Cumhuriyeti',
        'Gabon': 'Gabon',
        'Equatorial Guinea': 'Ekvator Ginesi',
        'São Tomé and Príncipe': 'São Tomé ve Príncipe',
        'Cape Verde': 'Yeşil Burun Adaları',
        'Guinea-Bissau': 'Gine-Bissau',
        'Guinea': 'Gine',
        'Sierra Leone': 'Sierra Leone',
        'Liberia': 'Liberya',
        'Mauritius': 'Mauritius',
        'Seychelles': 'Seyşeller',
        'Comoros': 'Komorlar',
        'Malawi': 'Malavi',
        'Lesotho': 'Lesotho',
        'Eswatini': 'Esvatini',
        'Benin': 'Benin',
        'Togo': 'Togo',
        'Burkina Faso': 'Burkina Faso',
        'Niger': 'Nijer',
        'Mali': 'Mali',
        'Mauritania': 'Moritanya',
        'Senegal': 'Senegal',
        'Gambia': 'Gambiya',
        'Guinea-Bissau': 'Gine-Bissau',
        'Guinea': 'Gine',
        'Sierra Leone': 'Sierra Leone',
        'Liberia': 'Liberya',
        'Côte d\'Ivoire': 'Fildişi Sahili',
        'Ghana': 'Gana',
        'Togo': 'Togo',
        'Benin': 'Benin',
        'Nigeria': 'Nijerya',
        'Cameroon': 'Kamerun',
        'Equatorial Guinea': 'Ekvator Ginesi',
        'São Tomé and Príncipe': 'São Tomé ve Príncipe',
        'Gabon': 'Gabon',
        'Republic of the Congo': 'Kongo Cumhuriyeti',
        'Democratic Republic of the Congo': 'Kongo Demokratik Cumhuriyeti',
        'Rwanda': 'Ruanda',
        'Burundi': 'Burundi',
        'Uganda': 'Uganda',
        'Kenya': 'Kenya',
        'Tanzania': 'Tanzanya',
        'Malawi': 'Malavi',
        'Mozambique': 'Mozambik',
        'Zimbabwe': 'Zimbabve',
        'Zambia': 'Zambiya',
        'Angola': 'Angola',
        'Namibia': 'Namibya',
        'Botswana': 'Botsvana',
        'South Africa': 'Güney Afrika',
        'Lesotho': 'Lesotho',
        'Eswatini': 'Esvatini',
        'Madagascar': 'Madagaskar',
        'Comoros': 'Komorlar',
        'Mauritius': 'Mauritius',
        'Seychelles': 'Seyşeller',
        'Djibouti': 'Cibuti',
        'Eritrea': 'Eritre',
        'Ethiopia': 'Etiyopya',
        'Somalia': 'Somali',
        'South Sudan': 'Güney Sudan',
        'Sudan': 'Sudan',
        'Libya': 'Libya',
        'Tunisia': 'Tunus',
        'Algeria': 'Cezayir',
        'Morocco': 'Fas',
        'Western Sahara': 'Batı Sahra',
        'Mauritania': 'Moritanya',
        'Mali': 'Mali',
        'Niger': 'Nijer',
        'Chad': 'Çad',
        'Central African Republic': 'Orta Afrika Cumhuriyeti',
        'Cameroon': 'Kamerun',
        'Nigeria': 'Nijerya',
        'Benin': 'Benin',
        'Togo': 'Togo',
        'Ghana': 'Gana',
        'Côte d\'Ivoire': 'Fildişi Sahili',
        'Liberia': 'Liberya',
        'Sierra Leone': 'Sierra Leone',
        'Guinea': 'Gine',
        'Guinea-Bissau': 'Gine-Bissau',
        'Senegal': 'Senegal',
        'Gambia': 'Gambiya',
        'Cape Verde': 'Yeşil Burun Adaları',
        'Greenland': 'Grönland'
    };
    
    return countryMap[countryName] || countryName;
}

// Tab işlevselliği
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Aktif tab'ı değiştir
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // İlgili içeriği göster
        const tabId = button.getAttribute('data-tab');
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        
        // Eğer modal açıksa ve bir ülke seçiliyse, veriyi güncelle
        if (modal.style.display === "block" && currentCountry) {
            fetchCountryInfo(currentCountry, tabId);
        }
    });
});

let currentCountry = null;

// Ülke bilgilerini çekme fonksiyonu
async function fetchCountryInfo(countryName, category) {
    currentCountry = countryName;
    const tabContent = document.getElementById(category);
    tabContent.innerHTML = '<div class="loading">Yükleniyor...</div>';
    
    try {
        const normalizedCountryName = normalizeCountryName(countryName);
        
        if (category === 'anthem') {
            // Milli marş için özel arama
            let anthemQuery = '';
            
            // Türkiye için özel sorgu
            if (normalizedCountryName === 'Türkiye') {
                anthemQuery = 'İstiklal Marşı';
            } else {
                anthemQuery = `${normalizedCountryName} milli marşı`;
            }
            
            // Milli marş bilgisini formatla
            const countryCode = getCountryCode(countryName);
            
            // Türkiye için özel içerik
            if (normalizedCountryName === 'Türkiye') {
                const formattedContent = `
                    <div class="anthem-content">
                        <h3>İstiklal Marşı</h3>
                        <div class="anthem-text">
                            <p>İstiklal Marşı, Türkiye Cumhuriyeti'nin ve Kuzey Kıbrıs Türk Cumhuriyeti'nin milli marşıdır. Mehmet Akif Ersoy tarafından yazılmış, Osman Zeki Üngör tarafından bestelenmiştir.</p>
                            <p>İstiklal Marşı, 12 Mart 1921'de TBMM tarafından kabul edilmiştir.</p>
                        </div>
                        <div class="anthem-audio">
                            <h4>Milli Marş</h4>
                            <audio id="anthemAudio" controls>
                                <source src="https://www.nationalanthems.info/tr.mp3" type="audio/mpeg">
                                Tarayıcınız audio elementini desteklemiyor.
                            </audio>
                        </div>
                    </div>
                `;
                tabContent.innerHTML = formattedContent;
            } else {
                // Diğer ülkeler için
                const formattedContent = `
                    <div class="anthem-content">
                        <h3>${normalizedCountryName} Milli Marşı</h3>
                        <div class="anthem-audio">
                            <h4>Milli Marş</h4>
                            <audio id="anthemAudio" controls>
                                <source src="https://www.nationalanthems.info/${countryCode.toLowerCase()}.mp3" type="audio/mpeg">
                                Tarayıcınız audio elementini desteklemiyor.
                            </audio>
                        </div>
                    </div>
                `;
                tabContent.innerHTML = formattedContent;
            }
        } else if (category === 'general') {
            // Genel bilgileri çek
            const url = `https://tr.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(normalizedCountryName)}&origin=*`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            const pageId = Object.keys(data.query.pages)[0];
            const page = data.query.pages[pageId];
            
            if (page.extract) {
                // Metni formatla
                const extract = page.extract;
                
                // HTML içeriğini oluştur
                const formattedContent = `
                    <div class="general-info">
                        <div class="info-text">
                            ${extract.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                        </div>
                    </div>
                `;
                
                tabContent.innerHTML = formattedContent;
            } else {
                // İngilizce Wikipedia'da dene
                const englishUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(countryName)}&origin=*`;
                
                const englishResponse = await fetch(englishUrl);
                const englishData = await englishResponse.json();
                
                const englishPageId = Object.keys(englishData.query.pages)[0];
                const englishPage = englishData.query.pages[englishPageId];
                
                if (englishPage.extract) {
                    const extract = englishPage.extract;
                    
                    const formattedContent = `
                        <div class="general-info">
                            <div class="info-text">
                                ${extract.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                                <p class="translation-note">(İngilizce kaynaktan çeviri)</p>
                            </div>
                        </div>
                    `;
                    
                    tabContent.innerHTML = formattedContent;
                } else {
                    tabContent.innerHTML = `<p>${normalizedCountryName} hakkında genel bilgi bulunamadı.</p>`;
                }
            }
        } else {
            // Diğer kategoriler için mevcut kod
            let searchQuery = '';
            
            switch(category) {
                case 'history':
                    searchQuery = `${normalizedCountryName} tarihi`;
                    break;
                case 'geography':
                    searchQuery = `${normalizedCountryName} coğrafyası`;
                    break;
                case 'economy':
                    searchQuery = `${normalizedCountryName} ekonomisi`;
                    break;
                default:
                    searchQuery = normalizedCountryName;
            }
            
            console.log(`Aranan sorgu: ${searchQuery}`);
            
            // Türkçe Wikipedia'da ara
            const url = `https://tr.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(searchQuery)}&origin=*`;
            
            console.log(`API URL: ${url}`);
            
            const response = await fetch(url);
            const data = await response.json();
            
            const pageId = Object.keys(data.query.pages)[0];
            const page = data.query.pages[pageId];
            
            if (page.extract) {
                // Metni kısalt ve formatla
                const extract = page.extract;
                const sentences = extract.split('. ');
                const shortExtract = sentences.slice(0, 5).join('. ') + '.';
                
                tabContent.innerHTML = `<p>${shortExtract}</p>`;
            } else {
                // İngilizce Wikipedia'da dene
                let englishQuery = '';
                
                switch(category) {
                    case 'history':
                        englishQuery = `${countryName} history`;
                        break;
                    case 'geography':
                        englishQuery = `${countryName} geography`;
                        break;
                    case 'economy':
                        englishQuery = `${countryName} economy`;
                        break;
                    default:
                        englishQuery = countryName;
                }
                
                const englishUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(englishQuery)}&origin=*`;
                
                console.log(`İngilizce sorgu: ${englishQuery}`);
                console.log(`İngilizce API URL: ${englishUrl}`);
                
                const englishResponse = await fetch(englishUrl);
                const englishData = await englishResponse.json();
                
                const englishPageId = Object.keys(englishData.query.pages)[0];
                const englishPage = englishData.query.pages[englishPageId];
                
                if (englishPage.extract) {
                    const extract = englishPage.extract;
                    const sentences = extract.split('. ');
                    const shortExtract = sentences.slice(0, 5).join('. ') + '.';
                    
                    tabContent.innerHTML = `<p>${shortExtract} (İngilizce kaynaktan çeviri)</p>`;
                } else {
                    // Eğer hem Türkçe hem İngilizce'de bulunamazsa, daha genel bir arama yap
                    const generalQuery = countryName;
                    const generalUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(generalQuery)}&origin=*`;
                    
                    console.log(`Genel sorgu: ${generalQuery}`);
                    console.log(`Genel API URL: ${generalUrl}`);
                    
                    const generalResponse = await fetch(generalUrl);
                    const generalData = await generalResponse.json();
                    
                    const generalPageId = Object.keys(generalData.query.pages)[0];
                    const generalPage = generalData.query.pages[generalPageId];
                    
                    if (generalPage.extract) {
                        const extract = generalPage.extract;
                        const sentences = extract.split('. ');
                        const shortExtract = sentences.slice(0, 5).join('. ') + '.';
                        
                        tabContent.innerHTML = `<p>${shortExtract} (İngilizce kaynaktan çeviri)</p>`;
                    } else {
                        tabContent.innerHTML = `<p>${normalizedCountryName} hakkında ${category} kategorisinde bilgi bulunamadı.</p>`;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        tabContent.innerHTML = `<p>${countryName} hakkında ${category} kategorisinde bilgi çekilirken bir hata oluştu.</p>`;
    }
}

// Ülkeye tıklandığında
async function zoomToFeature(e) {
    const layer = e.target;
    const countryName = layer.feature.properties.name;
    
    // Ülke adını düzelt
    const normalizedCountryName = normalizeCountryName(countryName);
    
    // Modal'ı göster ve ülke adını yaz
    countryNameElement.textContent = normalizedCountryName;
    modal.style.display = "block";
    
    // Ülke bayrağını yükle
    loadCountryFlag(countryName);
    
    // Tüm tab içeriklerini sıfırla
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.innerHTML = '<div class="loading">Yükleniyor...</div>';
    });
    
    // Tüm tab butonlarını pasif yap
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Genel tab butonunu aktif yap
    document.querySelector('.tab-button[data-tab="general"]').classList.add('active');
    
    // Genel tab içeriğini aktif yap
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById('general').classList.add('active');
    
    // İlk tab'ın içeriğini yükle
    fetchCountryInfo(countryName, 'general');
}

// Ülke bayrağını yükleme fonksiyonu
async function loadCountryFlag(countryName) {
    try {
        // Ülke kodunu al
        const countryCode = getCountryCode(countryName);
        
        // Bayrak URL'sini oluştur
        const flagUrl = `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`;
        
        // Bayrağı yükle
        countryFlagElement.src = flagUrl;
        countryFlagElement.alt = `${countryName} Bayrağı`;
    } catch (error) {
        console.error('Bayrak yükleme hatası:', error);
        // Hata durumunda varsayılan bir bayrak göster
        countryFlagElement.src = 'https://flagcdn.com/w160/unknown.png';
    }
}

// Ülke kodunu alma fonksiyonu
function getCountryCode(countryName) {
    // Bazı ülkelerin ISO kodları
    const countryCodes = {
        'United States': 'US',
        'United States of America': 'US',
        'United Kingdom': 'GB',
        'Russia': 'RU',
        'China': 'CN',
        'Japan': 'JP',
        'Germany': 'DE',
        'France': 'FR',
        'Italy': 'IT',
        'Spain': 'ES',
        'India': 'IN',
        'Brazil': 'BR',
        'Canada': 'CA',
        'Australia': 'AU',
        'Mexico': 'MX',
        'South Korea': 'KR',
        'North Korea': 'KP',
        'Iran': 'IR',
        'Saudi Arabia': 'SA',
        'Turkey': 'TR',
        'Egypt': 'EG',
        'South Africa': 'ZA',
        'Nigeria': 'NG',
        'Argentina': 'AR',
        'Chile': 'CL',
        'Colombia': 'CO',
        'Peru': 'PE',
        'Venezuela': 'VE',
        'Pakistan': 'PK',
        'Indonesia': 'ID',
        'Thailand': 'TH',
        'Vietnam': 'VN',
        'Malaysia': 'MY',
        'Philippines': 'PH',
        'Poland': 'PL',
        'Ukraine': 'UA',
        'Netherlands': 'NL',
        'Belgium': 'BE',
        'Sweden': 'SE',
        'Norway': 'NO',
        'Denmark': 'DK',
        'Finland': 'FI',
        'Switzerland': 'CH',
        'Austria': 'AT',
        'Greece': 'GR',
        'Portugal': 'PT',
        'Ireland': 'IE',
        'New Zealand': 'NZ',
        'Singapore': 'SG',
        'Israel': 'IL',
        'United Arab Emirates': 'AE',
        'Qatar': 'QA',
        'Kuwait': 'KW',
        'Iraq': 'IQ',
        'Syria': 'SY',
        'Jordan': 'JO',
        'Lebanon': 'LB',
        'Yemen': 'YE',
        'Oman': 'OM',
        'Afghanistan': 'AF',
        'Bangladesh': 'BD',
        'Myanmar': 'MM',
        'Cambodia': 'KH',
        'Laos': 'LA',
        'Nepal': 'NP',
        'Sri Lanka': 'LK',
        'Maldives': 'MV',
        'Bhutan': 'BT',
        'Mongolia': 'MN',
        'Kazakhstan': 'KZ',
        'Uzbekistan': 'UZ',
        'Turkmenistan': 'TM',
        'Tajikistan': 'TJ',
        'Kyrgyzstan': 'KG',
        'Azerbaijan': 'AZ',
        'Georgia': 'GE',
        'Armenia': 'AM',
        'Belarus': 'BY',
        'Moldova': 'MD',
        'Romania': 'RO',
        'Bulgaria': 'BG',
        'Croatia': 'HR',
        'Slovenia': 'SI',
        'Slovakia': 'SK',
        'Czech Republic': 'CZ',
        'Hungary': 'HU',
        'Serbia': 'RS',
        'Montenegro': 'ME',
        'North Macedonia': 'MK',
        'Albania': 'AL',
        'Bosnia and Herzegovina': 'BA',
        'Estonia': 'EE',
        'Latvia': 'LV',
        'Lithuania': 'LT',
        'Iceland': 'IS',
        'Luxembourg': 'LU',
        'Malta': 'MT',
        'Cyprus': 'CY',
        'Morocco': 'MA',
        'Algeria': 'DZ',
        'Tunisia': 'TN',
        'Libya': 'LY',
        'Sudan': 'SD',
        'Ethiopia': 'ET',
        'Kenya': 'KE',
        'Tanzania': 'TZ',
        'Uganda': 'UG',
        'Ghana': 'GH',
        'Senegal': 'SN',
        'Ivory Coast': 'CI',
        'Cameroon': 'CM',
        'Angola': 'AO',
        'Mozambique': 'MZ',
        'Zimbabwe': 'ZW',
        'Zambia': 'ZM',
        'Namibia': 'NA',
        'Botswana': 'BW',
        'Madagascar': 'MG',
        'Cuba': 'CU',
        'Dominican Republic': 'DO',
        'Haiti': 'HT',
        'Jamaica': 'JM',
        'Trinidad and Tobago': 'TT',
        'Panama': 'PA',
        'Costa Rica': 'CR',
        'Nicaragua': 'NI',
        'Honduras': 'HN',
        'El Salvador': 'SV',
        'Guatemala': 'GT',
        'Belize': 'BZ',
        'Uruguay': 'UY',
        'Paraguay': 'PY',
        'Bolivia': 'BO',
        'Ecuador': 'EC',
        'Guyana': 'GY',
        'Suriname': 'SR',
        'Fiji': 'FJ',
        'Papua New Guinea': 'PG',
        'Solomon Islands': 'SB',
        'Vanuatu': 'VU',
        'Samoa': 'WS',
        'Tonga': 'TO',
        'Kiribati': 'KI',
        'Marshall Islands': 'MH',
        'Micronesia': 'FM',
        'Palau': 'PW',
        'Tuvalu': 'TV',
        'Nauru': 'NR',
        'Timor-Leste': 'TL',
        'Brunei': 'BN',
        'East Timor': 'TL',
        'Mauritania': 'MR',
        'Mali': 'ML',
        'Niger': 'NE',
        'Chad': 'TD',
        'Central African Republic': 'CF',
        'South Sudan': 'SS',
        'Eritrea': 'ER',
        'Djibouti': 'DJ',
        'Somalia': 'SO',
        'Burundi': 'BI',
        'Rwanda': 'RW',
        'Democratic Republic of the Congo': 'CD',
        'Republic of the Congo': 'CG',
        'Gabon': 'GA',
        'Equatorial Guinea': 'GQ',
        'São Tomé and Príncipe': 'ST',
        'Cape Verde': 'CV',
        'Guinea-Bissau': 'GW',
        'Guinea': 'GN',
        'Sierra Leone': 'SL',
        'Liberia': 'LR',
        'Mauritius': 'MU',
        'Seychelles': 'SC',
        'Comoros': 'KM',
        'Malawi': 'MW',
        'Lesotho': 'LS',
        'Eswatini': 'SZ',
        'Benin': 'BJ',
        'Togo': 'TG',
        'Burkina Faso': 'BF',
        'Greenland': 'GL'
    };
    
    return countryCodes[countryName] || 'unknown';
} 