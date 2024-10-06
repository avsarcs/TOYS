*Front-end Süreç ve Görev Dağılımı*

Front-end’deki iş yükünü herkese farklı bir component atayarak dağıtacağız. Spesifik olarak [Figma tasarımındaki](https://www.figma.com/design/74MqgWLeymA9jut3elvSF2/Tourex?node-id=0-1&node-type=canvas&t=G96HGYyrb2ZAe2PR-0) her bir kareyi başka birisine atayacağız.

Front-end için boilerplate başlangıç kodunu repoya ekleyeceğim.

Kendinize atanan componentleri yazarken lütfen yeni bir proje oluşturmayın. Github’taki projeyi clone’layın, o projeyi çalıştırın ve o projenin içinde componentlerı yazın lütfen.

**CSS**

Front-end için bir renk şemasına karar verelim. Benim önerim **Basic Black** bir renk şeması kullanmak, yani siyahın farklı tonlarıyla hem klas bir görüntü oluşturmak hem de farklı renkleri uyuşturmakla çok vakit kaybetmemek.

Genel olarak Siyah olan programın içinde renkler semantik anlamlı kullanılacak. Mesela bir Uyarı belirtmek için kırmızı, Bilgi belirtmek için mavi, Onay belirtmek için yeşil kullanabiliriz.

Semantik anlamlı bir renk kullanmadan önce lütfen diğer componentleri bir gözden geçirmeye çalışın. Örneğin daha önce yazılan componentlerde Onay anlamına gelecek şekilde yeşil rengi kullanılmışsa sizin componentinizde Onay anlamına gelen kısmı farklı bir renkle yapmamaya çalışın, site boyunca bir tutarlılık sağlayalım.

Hazır component librarysi olarak [Mantine UI](https://mantine.dev/) kullanmayı mantıklı buluyorum. Bunun sebepleri şunlar. Birincisi bütün componentleri open-source ve beleş, ayrıca Bootstrap gibi diğer popüler kütüphanelerde olmayan bir özellik olarak bu componentleri kendimize göre customize etmemiz daha kolay. Ayrıca herkesin bilip kullandığı bir component librarysi olmadığından dizaynımıza orijinallik katacağını düşünüyorum.

Lütfen componentlerinizi yazarken **olabildiğince az kod yazmaya çalışın**. Eğer Mantine’de sizin yapmaya çalıştığınıza benzer bir component varsa onu alın ve oraya yapıştırın geçin. Eğer kendi stilinizi oluşturmanız gerekiyorsa lütfen olabildiğince Tailwind kullanın çünkü Tailwind’in stilleri responsive oluyor, hem mobile hem desktop’a uyum sağlıyor hem de hazır stil kullanıp vakit alacak baş ağrısından kurtulmuş oluyorsun.

Dediğim gibi lütfen componentleri ayrı projelerde değil de github’taki front-end codebase’ini indirip kurarak onun üzerinden yapın.


*Görev Dağılımı*

Her zamanki gibi bu bir **öneri**, bu dağılım hoşunuza gitmiyorsa söylemeniz elzem.

Bu componentlar üzerine çalışmaya başlamadan önce bir de elimizde örnek verilerin olması lazım. Data formatına karar verip JSON dosyalarında örnek veri yazmamız lazım back-end’den gelen veriyi simüle edecek.

*Emin*

Individual Tour Page

Tur Kaydetme Sayfası

Tour Calendar Page

Tour Calendar’ın diğer componentlar içinde kullanılacak simplified versiyonu

Tours Page



*Can*

Fuar Davet Sayfası

Guide Bilgi Sayfası

Advisor Bilgi Sayfası


