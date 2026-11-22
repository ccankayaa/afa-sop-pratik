# AFA SOP Pratik

Diamond DA20-C1 için bağımsız, kişisel SOP çalışma uygulaması. Altı ana testte **106 soru**, Benzer Sorular testinde **36 tekrar** bulunur. Arayüz Türkçe ve İngilizce, sorular ve şıklar İngilizcedir.

## Kullanım

Sol menüden seçilen test doğrudan soru ekranında açılır. Cevabı gösterme, soru işaretleme, soru haritası, önceki/sonraki gezinme, test sonucu ve yeniden çözme desteklenir. Ana sayfada toplam çözülen, doğru/yanlış cevap, tam biten test, test başına ortalama doğru yüzdesi ve doğru sayısı gösterilir. İstatistikler test ekranında bulunmaz.

Doğru seçimden sonra sonraki soru otomatik açılır. Yanlış seçim kırmızı kalır ve başka bir soruya geçmek için gezinme düğmesi veya soru haritası kullanılır. Test sayacı 00:00’dan başlar ve testin başlangıcından beri geçen süreyi gösterir. Sonuçta her sorunun açık ve sekmenin görünür olduğu süre ile bunların toplamı gösterilir. Soru araması açıkken geçirilen süre bu ölçüme dahil edilmez.

Her sorunun sol üstünde benzersiz bir ID görünür. Üst menüdeki **Soru ara** ile ID’yi (ör. `AFA-032`) veya soru ve şıklardaki kelimeleri arayabilirsin. Sonucu şıklarıyla açabilir ve doğrudan ilgili soruya gidebilirsin.

Sol menüde **Testleri birleştir** ile en az iki ana test seçilebilir. **Tüm soruları çöz** ana bankayı tekrarlar olmadan açar. Aynı metni ve doğru cevabı paylaşan kayıtların ilki ana testinde kalır, diğerleri **Similar Questions** altında çözülür. AFA-090 ve AFA-113 bankadan çıkarılmıştır.

**Retest Incorrect**, son cevabı yanlış olan soruları gösterir. Doğru cevaplanan soru listeden çıkar. **Worst Questions**, en az üç kez cevaplanmış ve hata oranı %30 veya üzeri olan soruları içerir. Bu testlere tekrar girildiğinde yeni uygun sorular eklenir ve devam eden denemenin sırası korunur. Ana sayfada toplam yanlış sayısına göre ilk 10 soru ve her birinin hata oranı gösterilir. Önceki sürümlerden yalnızca eldeki yanlış kayıtları aktarılabilir.

**Görülmemiş sorular** testini açtığında, ana bankada daha önce soru ekranında açmadığın sorulardan yeni bir liste oluşturulur. Çözüm yüzdesi, en az bir kez cevaplanan benzersiz soruların ana bankaya oranıdır. Test kartları deneme ve tekrar sayısını, soru kartları cevaplama sayısını gösterir. Ortalama puan, gönderilen puanlı testlerin 100 üzerinden puanlarının ortalamasıdır. Eski sürümde soru bazında kayıt tutulmadığı için önceki sayılar eldeki denemelerden çıkarılır.

Varsayılan arayüz dili İngilizcedir. **Kabul et** ve **Yalnızca gereklileri kabul et** seçenekleri dil ve tema seçimini tarayıcıda hatırlar. **Kabul et** ile ilerleme, sonuçlar ve testin başlangıç zamanı da yerel depolamada tutulur. Süre tarayıcı kapalıyken işlemeye devam eder. **Reddet** yerel kayıtları ve tercih çerezini siler. Çerez tercihleri sol menünün altından değiştirilebilir.

## Çalıştırma ve Vercel

Yerel kullanım için npm bağımlılığı gerekmez. Proje klasöründe:

```sh
python -m http.server 4173
```

Ardından `http://localhost:4173` adresini açın. Vercel'de proje **Other** olarak dağıtılır. `node scripts/build.mjs` uygulamayı ve soru bankasını tek JavaScript dosyasında birleştirip `dist/` klasörüne yazar. `vercel.json`, doğrudan açılan `/tr`, `/en` ve `/test/normal` gibi uygulama yollarını ana sayfa dosyasına yönlendirir. Eski `/#test/normal` bağlantıları da çalışır. Bilinmeyen adresler 404 olarak döner. Git entegrasyonu bağlıysa `main` dalına gönderilen commit otomatik yayımlanır.

[Vercel Web Analytics](https://vercel.com/docs/analytics/quickstart) canlı sitedeki ziyaretleri tarayıcı depolama tercihinden bağımsız ve çerez kullanmadan ölçer. Cevaplar, arama metni ve URL sorgu parametreleri gönderilmez. Ülke, tarayıcı ve **online** ziyaretçi göstergesi Vercel **Analytics** ekranındadır. HTTP hata tanısı için Vercel **Logs** bölümünü kullanın. Web Analytics sayfa ziyaretlerini ölçer, tüm statik dosya isteklerinin kaydı değildir.

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

Tarayıcıda tam ve eksik test bitirme, doğru/yanlış cevaplar, cevap gösterme, ortalama hesapları, yenilemede veri koruma, TR/EN, temalar, soru haritası ve açılır/kapanır menü kontrol edildi.

Geliştirici: [ccankaya](https://github.com/ccankayaa)
