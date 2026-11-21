# AFA SOP Pratik

Diamond DA20-C1 sınavı için Türkçe arayüzlü, 6 test ve 144 soruluk kişisel çalışma uygulaması. HTML, CSS ve JavaScript ile çalışır. Hesap, sunucu ve npm kurulumu gerektirmez.

Tarayıcıda `index.html` dosyasını açabilir veya proje klasöründe `python3 -m http.server 8000` çalıştırıp `http://localhost:8000` adresine gidebilirsiniz. Vercel’de depoyu içe aktararak mevcut `vercel.json` ile statik site olarak dağıtabilirsiniz.

Sorular ve özgün şıklar paylaşılan AFA SOP çalışma belgesinden aktarıldı. Açık uçlu maddelere pratik şıkları eklendi. Cevap anahtarı belirsiz veya çelişkili olan dört madde kaynak notuyla görünür ve puan dışıdır. Numaradan ibaret üç boş maddeyle, aynı testte şıklı olarak geçen cevapsız bir açık uçlu tekrar atlandı. Soru bankası `questions.js` dosyasındadır. Uçuşta güncel kontrollü SOP/AFM esas alınır.

İlerleme, tema ve sonuçlar kullanılan tarayıcıda saklanır. Çözülen soru sayısına puanlanan işaretli cevaplar dahildir. Doğru ve yanlış sayaçları cevap gösterildiğinde veya test bitirildiğinde güncellenir. Tam biten test ve ortalama göstergelerinde puanlanan bütün soruları işaretlenmiş testler kullanılır. Test puanı doğru cevap sayısının toplam puanlı soru sayısına oranıdır.
