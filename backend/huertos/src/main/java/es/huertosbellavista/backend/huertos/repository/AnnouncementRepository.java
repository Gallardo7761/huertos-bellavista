package es.huertosbellavista.backend.huertos.repository;

import es.huertosbellavista.backend.huertos.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, byte[]> {
}
