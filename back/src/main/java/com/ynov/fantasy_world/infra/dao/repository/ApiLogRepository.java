package com.ynov.fantasy_world.infra.dao.repository;

import com.ynov.fantasy_world.infra.dao.document.ApiLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiLogRepository extends MongoRepository<ApiLog, String> {
}

