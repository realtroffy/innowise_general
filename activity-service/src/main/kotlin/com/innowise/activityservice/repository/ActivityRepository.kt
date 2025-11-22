package com.innowise.activityservice.repository

import com.innowise.activityservice.model.Activity
import org.springframework.data.mongodb.repository.MongoRepository

interface ActivityRepository : MongoRepository<Activity, String>