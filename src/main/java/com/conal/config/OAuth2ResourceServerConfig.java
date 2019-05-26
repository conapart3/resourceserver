package com.conal.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.provider.expression.OAuth2MethodSecurityExpressionHandler;
import org.springframework.security.oauth2.provider.token.RemoteTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;

import javax.sql.DataSource;

@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class OAuth2ResourceServerConfig extends GlobalMethodSecurityConfiguration
{
    @Autowired
    private Environment env;

    @Value("classpath:schema.sql")
    private Resource schemaScript;

    @Bean
    public DataSource dataSource()
    {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(env.getProperty("jdbc.driverClassName"));
        dataSource.setUrl(env.getProperty("jdbc.url"));
        dataSource.setUsername(env.getProperty("jdbc.user"));
        dataSource.setPassword(env.getProperty("jdbc.pass"));
        return dataSource;
    }

    // In order to persist the tokens, we used a JdbcTokenStore
    @Bean
    public TokenStore tokenStore()
    {
        return new JdbcTokenStore(dataSource());
    }

    // Instead of using a TokenStore in our Resource Server, we can use RemoteTokenServices:
    @Primary
    @Bean
    public RemoteTokenServices tokenService()
    {
        RemoteTokenServices tokenService = new RemoteTokenServices();
        //todo change url to match auth server
        tokenService.setCheckTokenEndpointUrl(
                "http://localhost:8080/spring-security-oauth-server/oauth/check_token");
        tokenService.setClientId("fooClientIdPassword");
        tokenService.setClientSecret("secret");
        return tokenService;
    }
    //This RemoteTokenService will use CheckTokenEndPoint on Authorization Server to validate AccessToken and obtain Authentication object from it.
    //The can be found at AuthorizationServerBaseURL +”/oauth/check_token“
    //The Authorization Server can use any TokenStore type [JdbcTokenStore, JwtTokenStore, …] – this won’t affect the RemoteTokenService or Resource server.

    // i think this is for rreading the PreAuthorize values e.g. "#oath2.hasScope('read')"
    // it translates the security expressions above into method calls
    @Override
    protected MethodSecurityExpressionHandler createExpressionHandler() {
        return new OAuth2MethodSecurityExpressionHandler();
    }
}
