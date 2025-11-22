package com.innowise.activityservice

import io.mongock.runner.springboot.EnableMongock
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableMongock
class ActivityServiceApplication

fun main(args: Array<String>) {
    runApplication<ActivityServiceApplication>(*args)
}
