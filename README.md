# AFA SOP Pratik

Diamond DA20-C1 için bağımsız, kişisel SOP çalışma uygulaması. **6 test, 144 soru**, Türkçe/İngilizce arayüz ve açık/koyu tema. Sorular ile şıklar her iki dilde de İngilizce kalır.

## Kullanım

Sol menüden seçilen test doğrudan soru ekranında açılır. Cevabı gösterme, soru işaretleme, soru haritası, önceki/sonraki gezinme, test sonucu ve yeniden çözme desteklenir. Ana sayfada toplam çözülen, doğru/yanlış cevap, tam biten test, test başına ortalama doğru yüzdesi ve doğru sayısı gösterilir. İstatistikler test ekranında bulunmaz.

Doğru seçimden sonra sonraki soru otomatik açılır. Yanlış seçim kırmızı kalır ve başka bir soruya geçmek için gezinme düğmesi veya soru haritası kullanılır. Test sayacı 00:00’dan başlar ve testin başlangıcından beri geçen süreyi gösterir. Sonuçta her sorunun açık ve sekmenin görünür olduğu süre ile bunların toplamı gösterilir. Soru araması açıkken geçirilen süre bu ölçüme dahil edilmez.

Her sorunun sol üstünde benzersiz bir ID görünür. Üst menüdeki **Soru ara** ile ID’yi (ör. `AFA-032`) veya soru ve şıklardaki kelimeleri arayabilirsin. Sonucu şıklarıyla açabilir ve doğrudan ilgili soruya gidebilirsin.

Sol menüde **Testleri birleştir** ile en az iki test seçilebilir. **Tüm soruları çöz** bütün soru bankasını açar.

**Retest Incorrect**, son cevabı yanlış olan soruları gösterir. Doğru cevaplanan soru listeden çıkar. **Worst Questions**, en az üç kez cevaplanmış ve hata oranı %30 veya üzeri olan soruları içerir. Bu testlere tekrar girildiğinde yeni uygun sorular eklenir ve devam eden denemenin sırası korunur. Ana sayfada toplam yanlış sayısına göre ilk 10 soru ve her birinin hata oranı gösterilir. Önceki sürümlerden yalnızca eldeki yanlış kayıtları aktarılabilir.

**Görülmemiş sorular** testini açtığında, o an daha önce soru ekranında açmadığın sorulardan yeni bir liste oluşturulur. Çözüm yüzdesi, en az bir kez cevaplanan benzersiz soruların tüm bankaya oranıdır. Test kartları deneme ve tekrar sayısını, soru kartları cevaplama sayısını gösterir. Ortalama puan, gönderilen puanlı testlerin 100 üzerinden puanlarının ortalamasıdır. Eski sürümde soru bazında kayıt tutulmadığı için önceki sayılar eldeki denemelerden çıkarılır.

Varsayılan arayüz dili İngilizcedir. **Kabul et** ve **Yalnızca gereklileri kabul et** seçenekleri dil ve tema seçimini tarayıcıda hatırlar. **Kabul et** ile ilerleme, sonuçlar ve testin başlangıç zamanı da yerel depolamada tutulur. Süre tarayıcı kapalıyken işlemeye devam eder. **Reddet** yerel kayıtları ve tercih çerezini siler. Çerez tercihleri sol menünün altından değiştirilebilir.

## Çalıştırma ve Vercel

Derleme adımı veya npm bağımlılığı yoktur. Proje klasöründe:

```sh
python -m http.server 4173
```

Ardından `http://localhost:4173` adresini açın. Vercel'de depoyu içe aktarın; framework **Other**, çıktı klasörü **.**, install/build komutları boş olmalıdır. `vercel.json` bu ayarları içerir. Git entegrasyonu bağlıysa `main` dalına gönderilen commit otomatik yayımlanır.

[Vercel Web Analytics](https://vercel.com/docs/analytics/quickstart) etkinleştirildikten sonra canlı sitede yalnızca anonim ziyaret analizini ayrıca işaretleyip kabul edenlerden sayfa ziyareti ölçülür. Cevaplar ve arama metni gönderilmez. Ülke ve tarayıcı kırılımları **Analytics** bölümünde, **Visitors online** göstergesi Vercel genel bakışındaki proje kartında bulunur.

## Puanlama

- Puan: doğru cevap / puanlı soru sayısı × 100. Boş sorular puanı düşürür.
- Çözülen, doğru ve yanlış sayaçları tüm bitirilen denemeler ile devam eden denemelerdeki puanlı cevapların toplamıdır. Bitirilen deneme tekrar sayılmaz.
- Tam biten test: tüm puanlı soruları cevaplanmış, bitirilmiş deneme. Eksik bitirilen denemeler bu sayaca eklenmez.
- Test başı ortalama: tam biten testlerin eşit ağırlıklı başarı yüzdesi ve doğru sayısı ortalaması.
- AFA-022, AFA-037, AFA-080 ve AFA-112 güncel cevap anahtarıyla puana dahildir. Bu dört soru için önceki puan dışı seçimler yeni puanlamaya taşınmaz.

## Kaynak ve bağımsızlık

Soru bankası paylaşılan `grnd class -.docx` AFA SOP çalışma belgesinden aktarılmıştır. Açık uçlu maddeler için pratik şıklar eklenmiştir. Numaradan ibaret üç boş madde ve aynı testte şıklı olarak bulunan cevapsız bir açık uçlu tekrar bankaya dahil değildir.

**AFA ile bağlantısı yoktur. Resmî belge veya eğitim materyali değildir.** Uçuşta güncel, kontrollü SOP/AFM esas alınır.

AFA logosu, kullanıcının talebiyle [AFA'nın web sitesinden](https://afa.aero/afa-logo-light.png) alınmış olup ilgili sahibine aittir. Arayüz ikonları [Tabler Icons](https://github.com/tabler/tabler-icons) MIT lisanslıdır; lisans `assets/Tabler-LICENSE.txt` içindedir. Yazı tipi sistem fontudur; uygulama çalışma sırasında harici font, CDN veya API isteği yapmaz.

## Doğrulama

Tarayıcıda tam ve eksik test bitirme, doğru/yanlış cevaplar, cevap gösterme, ortalama hesapları, yenilemede veri koruma, TR/EN, temalar, soru haritası ve açılır/kapanır menü kontrol edildi. 144 sorunun tamamında 320–1920 px aralığındaki 11 telefon/tablet/masaüstü boyutunda yatay taşma kontrolü yapıldı; iPad dikey ve yatay düzenleri görsel olarak incelendi.

Geliştirici: [ccankaya](https://github.com/ccankayaa)
