package com.innowise.activityservice.config

import com.innowise.activityservice.dto.CommentEvent
import com.innowise.activityservice.dto.LikeEvent
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.StringDeserializer
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.support.serializer.JsonDeserializer

@Configuration
class KafkaConfig(
    @Value("\${spring.kafka.bootstrap-servers}")
    private val bootstrapServers: String,

    @Value("\${spring.kafka.consumer.group-id:activity-service}")
    private val groupId: String,

    @Value("\${spring.kafka.consumer.auto-offset-reset:earliest}")
    private val autoOffsetReset: String
) {

    private companion object {
        private const val IMAGE_SERVICE_DTO_PACKAGE = "com.innowise.imageservice.dto.event"

        private val TYPE_MAPPINGS: String = StringBuilder()
            .append(IMAGE_SERVICE_DTO_PACKAGE).append(".LikeEvent:")
            .append(LikeEvent::class.java.name)
            .append(',')
            .append(IMAGE_SERVICE_DTO_PACKAGE).append(".CommentEvent:")
            .append(CommentEvent::class.java.name)
            .toString()
    }

    @Bean
    fun consumerFactory(): ConsumerFactory<String, Any> {
        val props = mapOf<String, Any>(
            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to bootstrapServers,
            ConsumerConfig.GROUP_ID_CONFIG to groupId,
            ConsumerConfig.AUTO_OFFSET_RESET_CONFIG to autoOffsetReset,
            ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG to StringDeserializer::class.java,
            ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG to JsonDeserializer::class.java,
            JsonDeserializer.TRUSTED_PACKAGES to "*",
            JsonDeserializer.TYPE_MAPPINGS to TYPE_MAPPINGS
        )
        return DefaultKafkaConsumerFactory(props)
    }

    @Bean
    fun kafkaListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String, Any> =
        ConcurrentKafkaListenerContainerFactory<String, Any>().apply {
            consumerFactory = consumerFactory()
        }
}