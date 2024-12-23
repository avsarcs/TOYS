package server.mailService;

import org.springframework.stereotype.Service;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;

import java.util.Map;

@Service
public class MailFactory {
    private static Map<Concerning, Map<About, Map<Status, MailTemplate>>> templates;
    public MailFactory() {
        if (templates == null) {
            templates = Map.of(
                    Concerning.EVENT_APPLICANT, Map.of(
                            About.TOUR_APPLICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("Bilkent'e Tur İsteğiniz Hakkında", "Bilkent'e tur isteğiniz bize ulaştı. En yakın zamanda size geri dönüş yapacağız."),
                                    Status.APPROVAL, new MailTemplate("Bilkent'e Tur İsteğiniz Hakkında", "Tur isteğiniz kabul edildi!\nLütfen bu kodu gizli ve güvenli tutun, değişiklik yapmak isterseniz için bu kod gerekecek: {pass}!"),
                                    Status.REJECTION, new MailTemplate("Bilkent'e Tur İsteğiniz Hakkında", "Bilkent'e gelmek isteyen çok fazla okul var, ve sayılı sayıdaki gönüllülerimiz ancak belli bir sayıda ziyaretçi ağırlamamızı sağlıyor. Bu sebepler üzülerek bildirmek isteriz ki Bilkent'e tur isteğiniz kabul edilmemiştir."),
                                    Status.ERROR, new MailTemplate("Bilkent'e Tur İsteğiniz Hakkında", "Başvurunuz alınırken bir hata oluştu ve başvurunuz bize ulaşmadı.\nLütfen bizimle iletişime geçin."),
                                    Status.CANCELLED, new MailTemplate("Bilkent'e Tur İsteğiniz Hakkında", "Bilkent'e turunuz iptal edildi.")
                            ),
                            About.TOUR_MODIFICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("Bilkent Turu Değişiklik İsteğiniz Hakkında", "Turunuz için değişiklik isteğiniz bize ulaştı. En yakın zamanda size geri dönüş yapacağız."),
                                    Status.APPROVAL, new MailTemplate("Bilkent Turu Değişiklik İsteğiniz Hakkında", "Turunuz için değişiklikler kabul edildi!"),
                                    Status.REJECTION, new MailTemplate("Bilkent Turu Değişiklik İsteğiniz Hakkında", "Üzülerek bildirmek isteriz ki turunuz için değişiklik isteğiniz reddedildi."),
                                    Status.ERROR, new MailTemplate("Bilkent Turu Değişiklik İsteğiniz Hakkında", "Başvurunuz alınırken bir hata oluştu ve başvurunuz bize ulaşmadı.\nLütfen bizimle iletişime geçin.")
                            ),
                            About.FAIR_APPLICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("Fuar Davetiniz Hakkında", "Fuar davetiniz bize ulaştı!\nEn yakın zamanda size geri dönüş yapacağız."),
                                    Status.APPROVAL, new MailTemplate("Fuar Davetiniz Hakkında", "Fuar davetiniz kabul edildi!"),
                                    Status.REJECTION, new MailTemplate("Fuar Davetiniz Hakkında", "Üzülerek bildirityoruz ki maalesef fuarınıza katılamayacağız."),
                                    Status.ERROR, new MailTemplate("Fuar Davetiniz Hakkında", "Başvurunuz alınırken bir hata oluştu ve başvurunuz bize ulaşmadı.\nLütfen bizimle iletişime geçin.")
                            ),
                            About.REVIEW, Map.of(
                                    Status.PENDING, new MailTemplate("Son turunuz hakkında", "Bilkent'e geldiğiniz için çok teşekkür ederiz! Diğer misafirlerimizi daha iyi ağırlayabilmek için bize geridönüt sağlamak isterseniz bu kodu kullanabilirsiniz: {pass} : {tour_id}")
                            )
                    ),
                    Concerning.GUIDE, Map.of(
                            About.GUIDE_APPLICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("Rehber Başvurunuz Hakkında", "Rehber başvurunuz bize ulaştı. En yakın zamanda size geri dönüş yapacağız."),
                                    Status.APPROVAL, new MailTemplate("Rehber Başvurunuz Hakkında", "Rehber başvurunuz kabul edildi!\nLütfen bu kodu gizli ve güvenli tutun, bu kod sizin geçici şifrenizdir. En kısa zamanda değiştirin: {pass}!"),
                                    Status.REJECTION, new MailTemplate("Rehber Başvurnuz Hakkında", "Üzülerek bildiriyoruz ki rehber başvurunuz kabul edilmemiştir."),
                                    Status.ERROR, new MailTemplate("Rehber Başvurunuz Hakkında", "Başvurunuz alınırken bir hata oluştu ve başvurunuz bize ulaşmadı.\nLütfen bizimle iletişime geçin.")
                            ),
                            About.GUIDE_ASSIGNMENT, Map.of(
                                    Status.RECIEVED, new MailTemplate("Yeni bir etkinliğe davet edildiniz", "Yeni bir etkinliğe davet edildiniz. Lütfen etkinlik detaylarını kontrol edin.")
                            )
                    ),
                    Concerning.ADVISOR, Map.of(
                            About.TOUR_APPLICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("Yeni bir tur başvurusu geldi", "Yeni bir tur başvurusu geldi, lütfen en yakın zamanda geri dönüş yapmnız gerekmektedir."),
                                    Status.CANCELLED, new MailTemplate("Bir tur başvurusu iptal edildi", "Bir tur başvurusu iptal edildi.")
                            ),
                            About.TOUR_MODIFICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("Tur değişiklik isteği geldi", "Bir tur değişiklik isteği geldi, lütfen en yakın zamanda geri dönüş yapmnız gerekmektedir."),
                                    Status.APPROVAL, new MailTemplate("Tur değişiklik isteği kabul edildi", "Bir tur değişiklik isteği kabul edildi."),
                                    Status.CANCELLED, new MailTemplate("Bir tur değişiklik isteği iptal edildi", "Bir tur değişiklik isteği iptal edildi.")
                            ),
                            About.GUIDE_ASSIGNMENT, Map.of(
                                    Status.APPROVAL, new MailTemplate("Yeni bir etkinliğe rehber atandı", "Yeni bir etkinliğe rehber atandı, lütfen etkinlik detaylarını kontrol edin."),
                                    Status.REJECTION, new MailTemplate("Bir rehber ataması reddedildi", "Bir rehber ataması reddedildi."),
                                    Status.CANCELLED, new MailTemplate("Bir rehber ataması iptal edildi", "Bir rehber ataması iptal edildi.")
                            ),
                            About.REVIEW, Map.of(
                                    Status.RECIEVED, new MailTemplate("Yeni bir inceleme geldi", "Yeni bir inceleme geldi, lütfen en yakın zamanda geri dönüş yapmnız gerekmektedir.")
                            )
                    )
            );
        }
    }

    public static Map<Concerning, Map<About, Map<Status, MailTemplate>>> getTemplates() {
        return templates;
    }


}
