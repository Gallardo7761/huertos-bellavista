package es.huertosbellavista.backend.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import es.huertosbellavista.backend.core.model.User;

public interface UserRepository extends JpaRepository<User, byte[]> {

}
