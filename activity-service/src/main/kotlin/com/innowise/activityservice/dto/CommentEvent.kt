package com.innowise.activityservice.dto

import java.time.Instant

data class CommentEvent(
    val userId: Long,
    val imageId: Long,
    val commentId: Long,
    val content: String?,
    val createdAt: Instant
)