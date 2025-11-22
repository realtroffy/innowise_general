package com.innowise.activityservice.service

import com.innowise.activityservice.dto.CommentEvent
import com.innowise.activityservice.dto.LikeEvent
import com.innowise.activityservice.model.Activity
import com.innowise.activityservice.model.Status
import com.innowise.activityservice.model.Type
import com.innowise.activityservice.repository.ActivityRepository
import org.junit.jupiter.api.extension.ExtendWith
import org.assertj.core.api.Assertions.assertThat
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoExtension
import java.time.Instant
import kotlin.test.Test

@ExtendWith(MockitoExtension::class)
class ActivityKafkaConsumerJUnit5Test {

    @Mock
    lateinit var repo: ActivityRepository

    @InjectMocks
    lateinit var consumer: ActivityKafkaConsumer

    @Captor
    lateinit var captor: ArgumentCaptor<Activity>

    @Test
    fun `addLike should persist ADDED LIKE`() {
        val instant = Instant.parse("2023-10-01T12:00:00Z")
        val event = LikeEvent(userId = 1L, imageId = 10L, createdAt = instant)

        consumer.addLike(event)

        verify(repo).save(captor.capture())
        with(captor.value) {
            assertThat(userId).isEqualTo("1")
            assertThat(imageId).isEqualTo("10")
            assertThat(createdAt).isEqualTo(instant)
            assertThat(status).isEqualTo(Status.ADDED)
            assertThat(type).isEqualTo(Type.LIKE)
        }
    }

    @Test
    fun `removeLike should persist REMOVED LIKE`() {
        val instant = Instant.parse("2023-10-01T12:01:00Z")
        val event = LikeEvent(userId = 2L, imageId = 20L, createdAt = instant)

        consumer.removeLike(event)

        verify(repo).save(captor.capture())
        with(captor.value) {
            assertThat(userId).isEqualTo("2")
            assertThat(imageId).isEqualTo("20")
            assertThat(createdAt).isEqualTo(instant)
            assertThat(status).isEqualTo(Status.REMOVED)
            assertThat(type).isEqualTo(Type.LIKE)
        }
    }

    @Test
    fun `createComment should persist ADDED COMMENT`() {
        val instant = Instant.parse("2023-10-01T12:02:00Z")
        val event = CommentEvent(
            userId = 3L,
            imageId = 30L,
            createdAt = instant,
            commentId = 300L,
            content = "Nice pic!"
        )

        consumer.createComment(event)

        verify(repo).save(captor.capture())
        with(captor.value) {
            assertThat(userId).isEqualTo("3")
            assertThat(imageId).isEqualTo("30")
            assertThat(createdAt).isEqualTo(instant)
            assertThat(status).isEqualTo(Status.ADDED)
            assertThat(type).isEqualTo(Type.COMMENT)
        }
    }

    @Test
    fun `removeComment should persist REMOVED COMMENT`() {
        val instant = Instant.parse("2023-10-01T12:03:00Z")
        val event = CommentEvent(
            userId = 4L,
            imageId = 40L,
            createdAt = instant,
            commentId = 400L,
            content = null
        )

        consumer.removeComment(event)

        verify(repo).save(captor.capture())
        with(captor.value) {
            assertThat(userId).isEqualTo("4")
            assertThat(imageId).isEqualTo("40")
            assertThat(createdAt).isEqualTo(instant)
            assertThat(status).isEqualTo(Status.REMOVED)
            assertThat(type).isEqualTo(Type.COMMENT)
        }
    }
}