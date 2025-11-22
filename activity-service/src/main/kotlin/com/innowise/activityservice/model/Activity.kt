package com.innowise.activityservice.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant
import java.util.Objects

@Document(collection = "activity")
data class Activity(
    @Id val id: String?,
    val userId: String,
    val imageId: String,
    val createdAt: Instant,
    val status: Status,
    val type: Type
) {
    override fun equals(other: Any?) =
        (this === other) || (other is Activity &&
                userId == other.userId &&
                imageId == other.imageId &&
                type == other.type)

    override fun hashCode() =
        Objects.hash(userId, imageId, type)
}