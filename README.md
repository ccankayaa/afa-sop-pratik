# AFA SOP Pratik

Diamond DA20-C1 için bağımsız, kişisel SOP çalışma uygulaması. **6 test, 144 soru**, Türkçe/İngilizce arayüz ve açık/koyu tema. Sorular ile şıklar her iki dilde de İngilizce kalır.

## Kullanım

Sol menüden seçilen test doğrudan soru ekranında açılır. Cevabı gösterme, soru işaretleme, soru haritası, önceki/sonraki gezinme, test sonucu ve yeniden çözme desteklenir. Ana sayfada toplam çözülen, doğru/yanlış cevap, tam biten test, test başına ortalama doğru yüzdesi ve doğru sayısı gösterilir. İstatistikler test ekranında bulunmaz.

İlerleme, sonuç geçmişi, dil, tema ve masaüstü menü tercihi aynı tarayıcıda saklanır. Önceki sürümün `afa-sop-pratik:v1` verileri korunur. Hesap veya sunucu gerekmez. Veriler başka cihazlarla eşitlenmez.

## Çalıştırma ve Vercel

Derleme adımı veya npm bağımlılığı yoktur. Proje klasöründe:

```sh
python -m http.server 4173
```

Ardından `http://localhost:4173` adresini açın. Vercel'de depoyu içe aktarın; framework **Other**, çıktı klasörü **.**, install/build komutları boş olmalıdır. `vercel.json` bu ayarları içerir. Git entegrasyonu bağlıysa `main` dalına gönderilen commit otomatik yayımlanır.

## Puanlama

- Puan: doğru cevap / puanlı soru sayısı × 100. Boş sorular puanı düşürür.
- Çözülen, doğru ve yanlış sayaçları tüm bitirilen denemeler ile devam eden denemelerdeki puanlı cevapların toplamıdır. Bitirilen deneme tekrar sayılmaz.
- Tam biten test: tüm puanlı soruları cevaplanmış, bitirilmiş deneme. Eksik bitirilen denemeler bu sayaca eklenmez.
- Test başı ortalama: tam biten testlerin eşit ağırlıklı başarı yüzdesi ve doğru sayısı ortalaması.
- Kaynakta belirsiz veya çelişkili dört soru görünür kaynak notuyla puan dışında tutulur. Bu sorular için doğru cevap uydurulmaz.

## Kaynak ve bağımsızlık

Soru bankası paylaşılan `grnd class -.docx` AFA SOP çalışma belgesinden aktarılmıştır. Önceki soru bankası ve cevap anahtarları korunmuştur. Açık uçlu maddeler için önceki aktarımda pratik şıklar eklenmiştir. Numaradan ibaret üç boş madde ve aynı testte şıklı olarak bulunan cevapsız bir açık uçlu tekrar bankaya dahil değildir.

**AFA ile bağlantısı yoktur. Resmî belge veya eğitim materyali değildir.** Uçuşta güncel, kontrollü SOP/AFM esas alınır.

AFA logosu, kullanıcının talebiyle [AFA'nın web sitesinden](https://afa.aero/afa-logo-light.png) alınmış olup ilgili sahibine aittir. Arayüz ikonları [Tabler Icons](https://github.com/tabler/tabler-icons) MIT lisanslıdır; lisans `assets/Tabler-LICENSE.txt` içindedir. Yazı tipi sistem fontudur; uygulama çalışma sırasında harici font, CDN veya API isteği yapmaz.

## Doğrulama

Tarayıcıda tam ve eksik test bitirme, doğru/yanlış cevaplar, cevap gösterme, dört puan dışı soru, ortalama hesapları, yenilemede veri koruma, TR/EN, temalar, soru haritası ve açılır/kapanır menü kontrol edildi. 144 sorunun tamamında 320–1920 px aralığındaki 11 telefon/tablet/masaüstü boyutunda yatay taşma kontrolü yapıldı; iPad dikey ve yatay düzenleri görsel olarak incelendi.

Geliştirici: [ccankaya](https://github.com/ccankayaa)
