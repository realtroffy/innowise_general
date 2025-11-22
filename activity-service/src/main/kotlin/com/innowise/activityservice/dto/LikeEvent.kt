package com.innowise.activityservice.dto

import java.time.Instant

data class LikeEvent(val userId: Long, val imageId: Long, val createdAt: Instant)