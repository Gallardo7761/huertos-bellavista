package es.huertosbellavista.backend.huertos.repository.view;

import es.huertosbellavista.backend.huertos.model.view.VAnnouncementsWithPublishers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VAnnouncementsWithPublishersRepository extends JpaRepository<VAnnouncementsWithPublishers, byte[]> {
}
