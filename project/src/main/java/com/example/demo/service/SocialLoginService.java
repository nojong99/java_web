package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.entity.AuthProvider;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SocialLoginService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oauth2User.getAttribute("sub") != null ? 
            oauth2User.getAttribute("sub") : oauth2User.getAttribute("id");
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        // 네이버와 카카오의 경우 다른 속성명 사용
        if ("naver".equals(provider)) {
            Map<String, Object> response = oauth2User.getAttribute("response");
            if (response != null) {
                providerId = (String) response.get("id");
                email = (String) response.get("email");
                name = (String) response.get("name");
            }
        } else if ("kakao".equals(provider)) {
            Map<String, Object> properties = oauth2User.getAttribute("properties");
            if (properties != null) {
                name = (String) properties.get("nickname");
            }
            providerId = oauth2User.getAttribute("id").toString();
        }

        User user = userRepository.findByProviderAndProviderId(
            AuthProvider.valueOf(provider.toUpperCase()), 
            providerId
        ).orElse(null);

        if (user == null) {
            user = registerNewUser(provider, providerId, email, name);
        }

        return user;
    }

    private User registerNewUser(String provider, String providerId, String email, String name) {
        User user = User.builder()
                .username(name != null ? name : email)
                .email(email)
                .password("") // 소셜 로그인은 비밀번호 없음
                .role(Role.USER)
                .provider(AuthProvider.valueOf(provider.toUpperCase()))
                .providerId(providerId)
                .build();

        return userRepository.save(user);
    }

    public AuthResponse generateTokenForSocialUser(OAuth2User oauth2User) {
        if (oauth2User instanceof User) {
            User user = (User) oauth2User;
            String token = jwtService.generateToken(user);
            return AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();
        }
        throw new RuntimeException("Invalid OAuth2User type");
    }
} 