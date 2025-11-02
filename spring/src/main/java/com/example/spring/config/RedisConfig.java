package com.example.spring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
@EnableRedisRepositories
public class RedisConfig {

    @Value("${SPRING_DATA_REDIS_HOST}")
    private String host;

    @Value("${SPRING_DATA_REDIS_PORT}")
    private int port;

    @Value("${SPRING_DATA_REDIS_PASSWORD}")
    private String password;

    //private int timeoutSec; //커맨드 타임아웃

    //private boolean useSsl; //SSL 사용

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        // 1) 서버 설정
        RedisStandaloneConfiguration standalone = new RedisStandaloneConfiguration();
        standalone.setHostName(host);
        standalone.setPort(port);
        standalone.setDatabase(1);
        if (password != null && !password.isBlank()) {
            standalone.setPassword(RedisPassword.of(password)); // 신식 방식
        }

        // 2) 클라이언트 옵션(타임아웃/SSL 등 아직 추가 안함)
        LettuceClientConfiguration clientCfg = LettuceClientConfiguration.builder()
                //.commandTimeout(Duration.ofSeconds(timeoutSec))
                //.useSsl(useSsl)
                .build();

        // 3) 팩토리 생성
        return new LettuceConnectionFactory(standalone, clientCfg);
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate(LettuceConnectionFactory cf) {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(cf);
        // key/value 둘 다 String 직렬화
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }
}


