*UML Diyagramlarının Çiziminde Süreç ve Görev Dağılımı **Önerisi***

Süreç

- Her bir diyagram bir veya iki kişiye atansın.
- **Teslim tarihinden en geç iki gün öncesine kadar diyagramın Sorumlu’su tamamlanmış çalışmasını takımla paylaşsın.**
- Takımın her üyesi çalışma üzerine beyin fırtınası yaparak eksikler ve geliştirilebilir yönler konusundaki fikirlerini paylaşsın.
- Diyagramın Sorumlu’su **teslim tarihinden en geç bir gün öncesine kadar** çalışmasını geribildirim üzerine revize edip yeniden takımla paylaşsın.
- Hâlâ bir revizyona ihtiyaç duyulması halinde diyagram farklı bir veya iki kişiye atansın ve yeni Sorumlu takım geribildirimi üzerine son revizyonu yapıp teslimi gerçekleştirsin.



*Görev Dağılımı*

Henüz bize verilecek görevleri bilmediğimizden bu dağılım şu an için farazi kalacak. Class diagram’a bir kişiyi atayabiliriz fakat bize verilen isterlerde örneğin 15 farklı class diagram istemeleri halinde tabii ki bu listeyi gözden geçirmemiz gerekir.

Bu **değişime ve önerilerinize açık** görev dağılımı sorumlulukların dağıtılması açısından **bağlayıcı** bir referans olarak kabul edilsin. Böylelikle kim neyi yaptı yapmadı veya neyden sorumlu kafa karışıklığını önlemiş oluruz.

Tekrar söylüyorum, bu görev dağılımı değişebilir, ödevler beklediğimiz gibi olmayabilir. Bir değişiklik yapmak istersek ortak bir karar alalım ve bunu buraya yazalım ki **kafa karışıklığı önlensin**

Herkesin kendi alanına en yakın diyagramları çizmesinin bizi hızlandıracağını düşünüyorum. Bu yüzden aşağıdaki gibi bir **öneri** yapıyorum.

*Can*

Diyagram çizmekle vakit kaybetmesi yerine React ve Typescript öğrenmeye odaklanmasını daha mantıklı buluyorum. [Figma tasarımındaki](https://www.figma.com/design/74MqgWLeymA9jut3elvSF2/Tourex?node-id=0-1&t=fGqYTJPu5X1eGR7L-1) “Rehberlik Başvurusu Ret Overlay”, “Tur Rehberliği Ret Overlay” ve “Değişim Maili Overlay” componentlerini yazmaya odaklanması taraftarıyım -hem kendini geliştirir hem de progress kazanmış oluruz.

Front-end için ayrı bir görev dağılımı dokümanı oluşturmayı planlıyorum.



*Göktuğ ve Mehmet Emin*

Front-end ile yakından ilişkili olduğundan şu iki diyagramın bize atanmasını mantıklı buluyorum:

Use Case Diagram

Activity Diagram


*Ruşen*

Back-end’le ve veritabanıyla olan etkileşimlerle yakından ilgileneceğinden
Class Diagram’ları ve State Diagram’ları (çünkü örneğin bir Tour objesinin Onay Bekliyor, Değişim Bekliyor, Onaylanmış, Reddedilmiş gibi birçok state’i olacak ve backend bu state değişimleriyle yakından ilgilenecek).

*Begüm ve Orhun*

Data işlemesinde yapılan Sequence Diagram’lardan sorumlu olabilirler -eğer bu az kaçarsa ve diğer alanlarda da Sequence Diagram istenirse hazır yazılı kodu inceleyerek Sequence Diagram çıkartmaktan sorumlu olmalarını mantıklı buluyorum.
