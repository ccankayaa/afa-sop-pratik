# AFA SOP Pratik

Diamond DA20-C1 için bağımsız, kişisel SOP çalışma uygulaması. Altı ana testte **106 soru**, Benzer Sorular testinde **36 tekrar** bulunur. Arayüz Türkçe ve İngilizce, sorular ve şıklar İngilizcedir.

## Kullanım

Sol menüden seçilen test doğrudan soru ekranında açılır. Cevabı gösterme, soru işaretleme, soru haritası, önceki/sonraki gezinme, test sonucu ve yeniden çözme desteklenir. Ana sayfada toplam çözülen, doğru/yanlış cevap, tam biten test, test başına ortalama doğru yüzdesi ve doğru sayısı gösterilir. İstatistikler test ekranında bulunmaz.

Doğru seçimden 100 ms sonra sonraki soru açılır. Yanlış seçim kırmızı kalır. Sayaç teste girişte 00:00’dan başlar ve testten çıkınca sıfırlanır. Sekme gizlendiğinde, pencere odağı kaybolduğunda veya soru araması açıldığında sayaç durur. Aynı soru beş dakika açık kalınca sayaç yine durur ve sonraki tıklamada veya cevapta devam eder. Manuel duraklatmayı sayaç düğmesiyle kaldırabilirsin. Sonuç ekranındaki soru süreleri, ilgili denemede birikmiş aktif çalışma süresidir.

Her sorunun sol üstünde benzersiz bir ID görünür. Üst menüdeki **Soru ara** ile ID’yi (ör. `AFA-032`) veya soru ve şıklardaki kelimeleri arayabilirsin. Sonucu şıklarıyla açabilir ve doğrudan ilgili soruya gidebilirsin.

Sol menüde **Testleri birleştir** ile en az iki ana test seçilebilir. **Tüm soruları çöz** ana bankayı tekrarlar olmadan açar. Aynı metni ve doğru cevabı paylaşan kayıtların ilki ana testinde kalır, diğerleri **Similar Questions** altında çözülür. AFA-090 ve AFA-113 bankadan çıkarılmıştır.

**Retest Incorrect**, son cevabı yanlış olan soruları gösterir. Doğru cevaplanan soru listeden çıkar. **Worst Questions**, en az üç kez cevaplanmış ve hata oranı %30 veya üzeri olan soruları içerir. Bu testlere tekrar girildiğinde yeni uygun sorular eklenir ve devam eden denemenin sırası korunur. Ana sayfada toplam yanlış sayısına göre ilk 10 soru ve her birinin hata oranı gösterilir. Önceki sürümlerden yalnızca eldeki yanlış kayıtları aktarılabilir.

**Görülmemiş sorular** testini açtığında, ana bankada daha önce soru ekranında açmadığın sorulardan yeni bir liste oluşturulur. Çözüm yüzdesi, en az bir kez cevaplanan benzersiz soruların ana bankaya oranıdır. Test kartları deneme ve tekrar sayısını, soru kartları cevaplama sayısını gösterir. Ortalama puan, gönderilen puanlı testlerin 100 üzerinden puanlarının ortalamasıdır. Eski sürümde soru bazında kayıt tutulmadığı için önceki sayılar eldeki denemelerden çıkarılır.

Varsayılan arayüz dili İngilizcedir. **Kabul et** ve **Yalnızca gereklileri kabul et** seçenekleri dil ve tema seçimini tarayıcıda hatırlar. **Kabul et** ile ilerleme ve sonuçlar da yerel depolamada tutulur. **Reddet** yerel kayıtları ve tercih çerezini siler. Çerez tercihleri sol menünün altından değiştirilebilir.

## Çalıştırma ve Vercel

Uygulama Next.js App Router ve Node.js 24 kullanır. Proje klasöründe:

```sh
npm ci
npm run dev
```

Ardından `http://localhost:3000` adresini açın. Üretim derlemesi için `npm run build`, yerel önizleme için `npm start` kullanın. Vercel projesinde **Next.js** preset'i ve varsayılan derleme/çıktı ayarları kullanılır. Ana sayfa ve bilinen test sayfaları önceden oluşturulur. Eski `/#test/normal` bağlantıları ve doğrudan `/test/normal` bağlantıları desteklenir. Bilinmeyen adresler gerçek 404 döndürür. Git entegrasyonu bağlıysa `main` dalındaki commit otomatik yayımlanır.

[Vercel Web Analytics](https://vercel.com/docs/analytics/quickstart) canlı sitedeki ziyaretleri tarayıcı depolama tercihinden bağımsız ve çerez kullanmadan ölçer. Cevaplar, arama metni ve site URL'sindeki sorgu parametreleri gönderilmez. Ülke, tarayıcı ve **online** ziyaretçi göstergesi Vercel **Analytics** ekranındadır. **Logs** bölümünde ana sayfa ve test girişleri için `practice_request` satırlarını arayın. Log satırları URL sorgusu, çerez veya cevap içermez.

## Puanlama

- Puan: doğru cevap / puanlı soru sayısı × 100. Boş sorular puanı düşürür.
- Çözülen, doğru ve yanlış sayaçları tüm bitirilen denemeler ile devam eden denemelerdeki puanlı cevapların toplamıdır. Bitirilen deneme tekrar sayılmaz.
- Tam biten test: tüm puanlı soruları cevaplanmış, bitirilmiş deneme. Eksik bitirilen denemeler bu sayaca eklenmez.
- Test başı ortalama: tam biten testlerin eşit ağırlıklı başarı yüzdesi ve doğru sayısı ortalaması.
- AFA-022, AFA-037, AFA-080 ve AFA-112 güncel cevap anahtarıyla puana dahildir. Bu dört soru için önceki puan dışı seçimler yeni puanlamaya taşınmaz.

## Kaynak ve bağımsızlık

Soru bankası paylaşılan `grnd class -.docx` AFA SOP çalışma belgesinden aktarılmıştır. Açık uçlu maddeler için pratik şıklar eklenmiştir. Numaradan ibaret üç boş madde ve aynı testte şıklı olarak bulunan cevapsız bir açık uçlu tekrar bankaya dahil değildir.

**AFA ile bağlantısı yoktur. Resmî belge veya eğitim materyali değildir.** Uçuşta güncel, kontrollü SOP/AFM esas alınır.

AFA logosu [AFA'nın web sitesinden](https://afa.aero/afa-logo-light.png) alınmış olup ilgili sahibine aittir. Arayüz ikonları [Tabler Icons](https://github.com/tabler/tabler-icons) MIT lisanslıdır. Lisans `assets/Tabler-LICENSE.txt` içindedir. Uygulama ikonlarını sayfanın içine gömer ve sistem yazı tipini kullanır.

## Doğrulama

Tarayıcıda tam ve eksik test bitirme, doğru/yanlış cevaplar, cevap gösterme, ortalama hesapları, yenilemede veri koruma, TR/EN, temalar, soru haritası ve açılır/kapanır menü kontrol edildi.

Geliştirici: [ccankaya](https://github.com/ccankayaa)
