package com.innowise.activityservice.service

import com.innowise.activityservice.model.Activity
import com.innowise.activityservice.dto.CommentEvent
import com.innowise.activityservice.dto.LikeEvent
import com.innowise.activityservice.model.Status
import com.innowise.activityservice.model.Type
import com.innowise.activityservice.repository.ActivityRepository
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class ActivityKafkaConsumer(private val repo: ActivityRepository) {

    @KafkaListener(topics = ["add_like"])
    fun addLike(evt: LikeEvent) {
        save(evt.userId, evt.imageId, evt.createdAt, Status.ADDED, Type.LIKE)
    }

    @KafkaListener(topics = ["remove_like"])
    fun removeLike(evt: LikeEvent) {
        save(evt.userId, evt.imageId, evt.createdAt, Status.REMOVED, Type.LIKE)
    }

    @KafkaListener(topics = ["create_comment"])
    fun createComment(evt: CommentEvent) {
        save(evt.userId, evt.imageId, evt.createdAt, Status.ADDED, Type.COMMENT)
    }

    @KafkaListener(topics = ["remove_comment"])
    fun removeComment(evt: CommentEvent) {
        save(evt.userId, evt.imageId, evt.createdAt, Status.REMOVED, Type.COMMENT)
    }

    private fun save(
        userId: Long, imageId: Long, createdAt: java.time.Instant,
        status: Status, type: Type
    ) {
        repo.save(
            Activity(
                id = null,
                userId = userId.toString(),
                imageId = imageId.toString(),
                createdAt = createdAt,
                status = status,
                type = type
            )
        )
    }
}