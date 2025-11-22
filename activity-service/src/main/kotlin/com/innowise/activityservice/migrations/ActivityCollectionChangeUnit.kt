package com.innowise.activityservice.migrations

import io.mongock.api.annotations.ChangeUnit
import io.mongock.api.annotations.Execution
import io.mongock.api.annotations.RollbackExecution
import org.springframework.data.mongodb.core.MongoTemplate

@ChangeUnit(id = "1.0.0-create-activity-collection", order = "001", author = "Artur Asiptsou")
class ActivityCollectionChangeUnit {

    @Execution
    fun createCollection(mongo: MongoTemplate) {
        if (!mongo.collectionExists("activity")) {
            mongo.createCollection("activity")
        }
    }

    @RollbackExecution
    fun rollback(mongo: MongoTemplate) {
        mongo.dropCollection("activity")
    }
}