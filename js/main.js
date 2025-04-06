// Haritayı başlat
const map = L.map('map').setView([0, 0], 2);

// OpenStreetMap katmanını ekle
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
        <p id="notablePerson"></p>
    </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Modal elementlerini seç
const modal = document.getElementById('countryModal');
const closeBtn = document.getElementsByClassName('close')[0];
const countryNameElement = document.getElementById('countryName');
const notablePersonElement = document.getElementById('notablePerson');

// Modal kapatma fonksiyonu
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Modal dışına tıklandığında kapatma
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Farklı renkler için renk paleti
const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF3333', 
    '#33FFF3', '#F3FF33', '#FF33A8', '#33A8FF', '#A833FF',
    '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF3333', 
    '#33FFF3', '#F3FF33', '#FF33A8', '#33A8FF', '#A833FF'
];

// Ülke verilerini yükle
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                // Her ülke için farklı bir renk seç
                const colorIndex = Math.floor(Math.random() * colorPalette.length);
                return {
                    fillColor: colorPalette[colorIndex],
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
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
        'Cape Verde': 'Yeşil Burun Adaları'
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
        // Ülke adını düzelt
        const normalizedCountryName = normalizeCountryName(countryName);
        
        // Kategori bazlı arama sorgusu oluştur
        let searchQuery = '';
        
        switch(category) {
            case 'history':
                searchQuery = `${normalizedCountryName} tarihi`;
                break;
            case 'politics':
                searchQuery = `${normalizedCountryName} siyaset`;
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
                case 'politics':
                    englishQuery = `${countryName} politics`;
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
                tabContent.innerHTML = `<p>${normalizedCountryName} hakkında ${category} kategorisinde bilgi bulunamadı.</p>`;
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
    
    // Modal'ı göster ve ülke adını yaz
    countryNameElement.textContent = countryName;
    modal.style.display = "block";
    
    // İlk tab'ın içeriğini yükle
    fetchCountryInfo(countryName, 'history');
} 